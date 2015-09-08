"use strict";

var Parse = require('parse').Parse;
var splituri = require('parseuri');
var _ = require('underscore');

//var currentTimestamp = null;
//var currentTab = null;
var state = []; 

// Initialize Parse 
Parse.initialize('ElGYGALqbwqrM4GBrRKxjK2MRZ1cOZq2Bq3Xi0Ko', 'CwMUO32jiUfarcgZdScIcSOT9LIV9Dpm1U9aAATc');



//
// Start capture the provided Tab
//
function captureTab(tab) {
	
	// Get current date
	var timestamp = Date.now();

	releaseCurrentTab(timestamp);

		
	// Change the extension icon and fade the page out
	chrome.browserAction.setIcon({ path: "chrome://favicon/" + tab.url });
	chrome.browserAction.setBadgeText({text: "O"});
	chrome.tabs.sendMessage(tab.id, "fadeOut");


	var query = new Parse.Query('Urls');
	query.equalTo("url", tab.url);
	query.first().then(function (urlObject) 
	{
		// Get or create an Url object with the current tab URL
		if (urlObject != undefined)
			return Parse.Promise.as(urlObject);
			
		var UrlObject = Parse.Object.extend('Urls');
		urlObject = new UrlObject();
		
		return urlObject.save({
			url: tab.url,
			title: tab.title
		});
		
	}).then(function(urlObject)
	{
		// Create a new timestamp for this Url object
		
		var TimestampObject = Parse.Object.extend('Timestamps');
		var timestampObject = new TimestampObject();
		
		return timestampObject.save({
			url: urlObject,
			begin: timestamp,
			end: timestamp
			
		});
		
	}).then(function(timestampObject)
	{
		// Cache the state for when the tab is released
		state.push({
			timestamp: timestampObject,
			tab: tab
		});

		console.log("[" + formatDate(timestamp) + "] capture tab #" + tab.id);
			
	}, function (error) {
		alert("Error while querying Url: " + error.code + " " + error.message);

	});
}


//
// Stop capture the current Tab
//
function releaseCurrentTab(timestamp) {

	var lastState = state.shift();
	if (!lastState)
		return;
		
	// Change the extension icon and fade the page in
	chrome.tabs.sendMessage(lastState.tab.id, "fadeIn");
	chrome.browserAction.setBadgeText({text: "."});
	
		
	if (timestamp == undefined)
		timestamp = Date.now();

	lastState.timestamp.save({
		end: timestamp
		
	}).then( function (object) {
		// The object was saved successfully.

		console.log("[" + formatDate(timestamp) + "] released tab #" + lastState.tab.id);

	}, function (object, error) {
		// The save failed.
		// error is a Parse.Error with an error code and message.
		alert("Error while saving the released object: " + error.code + " " + error.message);

	});

}


chrome.runtime.onMessage.addListener( function(message, sender, sendResponse) {
	if (message == "focus") {
		captureTab(sender.tab);
	
	} else if (message == "blur") {
		releaseCurrentTab();
		
	} else if (message == "injected") {
		
		//alert("INjected into " + sender.tab.title);
		
	}
});

function formatDate(timeStamp) {
	var a = new Date(timeStamp);
	var h = a.getHours() < 10 ? '0' + a.getHours() : a.getHours(); 
	var m = a.getMinutes() < 10 ? '0' + a.getMinutes() : a.getMinutes(); 
	var s = a.getSeconds() < 10 ? '0' + a.getSeconds() : a.getSeconds();
	return h + ":" + m + ":" + s; 
}

// chrome.webNavigation.onBeforeNavigate.addListener(function(data) {
// 	if (data.frameId) return;
// 	console.log("[" + formatDate(data.timeStamp) + "] onBeforeNavigate:           " + data.url + "\n                                       " +
// 				"tabId:" + data.tabId +
// 				" - frameId:" + data.frameId +
// 				" - processId:" + data.processId + 
// 				" - parentFrameId:" + data.parentFrameId
// 				);
// });

// chrome.webNavigation.onCommitted.addListener(function(data) {
// 	if (data.frameId) return;
// 	console.log("[" + formatDate(data.timeStamp) + "] onCommitted:                " + data.url + "\n                                       " + 
// 				"tabId:" + data.tabId +
// 				" - frameId:" + data.frameId +
// 				" - processId:" + data.processId + 
// 				" - transitionType:" + data.transitionType +
// 				" - transitionQualifiers:" + data.transitionQualifiers  
// 				);
// });

// chrome.webNavigation.onDOMContentLoaded.addListener(function(data) {
// 	if (data.frameId) return;
// 	console.log("[" + formatDate(data.timeStamp) + "] onDOMContentLoaded:         " + data.url + "\n                                       " +
// 				"tabId:" + data.tabId +
// 				" - frameId:" + data.frameId +
// 				" - processId:" + data.processId  
// 				);
// });

chrome.webNavigation.onCompleted.addListener(function(data) {
	if (data.frameId) return;
	chrome.tabs.get(data.tabId, function(tab) {
		if (!tab.active) return;
		
		console.log("[" + formatDate(data.timeStamp) + "] onCompleted:                " + data.url + "\n                                       " +
					"tabId:" + data.tabId +
					" - frameId:" + data.frameId +
					" - processId:" + data.processId  
					);
					
		captureTab(tab);
	});
});

chrome.webNavigation.onReferenceFragmentUpdated.addListener(function(data) {
	if (data.frameId) return;
	chrome.tabs.get(data.tabId, function(tab) {
		if(!tab.active) return;
		
		console.log("[" + formatDate(data.timeStamp) + "] onReferenceFragmentUpdated: " + data.url + "\n                                       " +
					"tabId:" + data.tabId +
					" - frameId:" + data.frameId +
					" - processId:" + data.processId + 
					" - transitionType:" + data.transitionType +
					" - transitionQualifiers:" + data.transitionQualifiers  
					);
				
		captureTab(tab);
	});
});

chrome.webNavigation.onTabReplaced.addListener(function(data) {
	console.log("[" + formatDate(data.timeStamp) + "] onTabReplaced:              " + "\n                                       " +
				"tabId:" + data.tabId +
				" - replacedTabId:" + data.replacedTabId
				);
});

chrome.webNavigation.onErrorOccurred.addListener(function(data) {
	if (data.frameId) return;
	console.log("[" + formatDate(data.timeStamp) + "] onErrorOccurred:            " + data.url + "\n                                       " +
				"tabId:" + data.tabId +
				" - frameId:" + data.frameId +
				" - processId:" + data.processId +
				" - string:" + data.string  
				);
});

chrome.webNavigation.onCreatedNavigationTarget.addListener(function(data) {
	if (data.frameId) return;
	console.log("[" + formatDate(data.timeStamp) + "] onCreatedNavigationTarget:  " + data.url + "\n                                       " +
				"tabId:" + data.tabId +
				" - sourceTabId:" + data.sourceTabId +
				" - sourceFrameId:" + data.sourceFrameId +
				" - sourceProcessId:" + data.sourceProcessId
				);
});


chrome.webNavigation.onHistoryStateUpdated.addListener(function(data) {
	if (data.frameId) return;
	console.log("[" + formatDate(data.timeStamp) + "] onHistoryStateUpdated:      " + data.url + "\n                                       " +
				"tabId:" + data.tabId +
				" - frameId:" + data.frameId +
				" - processId:" + data.processId + 
				" - transitionType:" + data.transitionType +
				" - transitionQualifiers:" + data.transitionQualifiers  
				);
});

// chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
// 	console.log("[--:--:--] tabs.onUpdated:             " + changeInfo.url + "\n                                       " +
// 				"tabId:" + tabId +
// 				" - status: " + changeInfo.status
// 				);
// });

// chrome.history.onVisited.addListener(function(historyItem) {
// 	console.log("[--:--:--] history.onVisited:          " + historyItem.url + "\n                                       " +
// 				"id:" + historyItem.id +
// 				" - title:" + historyItem.title + "\n                                       " +
// 				"lastVisitTime:" + formatDate(historyItem.lastVisitTime) +
// 				" - visitCount:" + historyItem.visitCount +
// 				" - typedCount:" + historyItem.typedCount
// 				);
// });


// Refresh all windows to be sure the content-script is loaded

chrome.windows.getAll({populate: true}, function (windows) {
    for(var i = 0; i < windows.length; i++ ) {
        for(var j = 0; j < windows[i].tabs.length; j++ ) {
			chrome.tabs.reload(windows[i].tabs[j].id);
        }
    }
});


//
// At startup, we need to get the currently active tab
//
chrome.tabs.query({ active: true }, function (tabs) {
	captureTab(tabs[0]);
});





//
// Uncomment this to execute the CloudCode method at first start of the extension
//
/*
Parse.Cloud.run("updateSchema", null, {
	success: function(result) { alert(result);},
	error: function(error) { alert(error.code + " - " + error.message);	}
});
*/