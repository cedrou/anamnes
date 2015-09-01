"use strict";

var Parse = require('parse').Parse;
var splituri = require('parseuri');

var parseObject = null;

// Initialize Parse 
Parse.initialize('ElGYGALqbwqrM4GBrRKxjK2MRZ1cOZq2Bq3Xi0Ko', 'CwMUO32jiUfarcgZdScIcSOT9LIV9Dpm1U9aAATc');



function createTimestamp(urlObject, timestamp) {

	var TimestampObject = Parse.Object.extend('Timestamps');
	var timestampObject = new TimestampObject();
	timestampObject.save({
		url: urlObject,
		begin: timestamp,
		end: 0
	}, {
		
		success: function (timestampObject) {
			parseObject = timestampObject;
		},
		
		error: function (urlObject, error) {
			alert("Error while creating a new Timestamps instance: " + error.code + " " + error.message);
		}
	});
}


//
// Start capture the provided Tab
//
function captureTab(tab) {
	// Get current date
	var timestamp = Date.now();

	releaseCurrentTab(timestamp);

	new Parse.Query('Urls').equalTo("url", tab.url).first({

		success: function (urlObject) {
			if (urlObject != undefined) {
				createTimestamp(urlObject, timestamp);
			} else {
				var UrlObject = Parse.Object.extend('Urls');
				urlObject = new UrlObject();
				urlObject.save({
					url: tab.url,
					title: tab.title
				}, {
					
					success: function (urlObject) {
						createTimestamp(urlObject, timestamp);
					},
					
					error: function (urlObject, error) {
						alert("Error while creating a new Urls instance: " + error.code + " " + error.message);
					}
				});
			}

		},

		error: function (error) {
			alert("Error while querying Url: " + error.code + " " + error.message);
		}
	});
}


//
// Stop capture the current Tab
//
function releaseCurrentTab(timestamp) {

	if (parseObject == null)
		return;

	parseObject.set("end", timestamp);
	parseObject.save(null, {
		success: function (siteAccess) {
			// The object was saved successfully.
		},
		error: function (siteAccess, error) {
			// The save failed.
			// error is a Parse.Error with an error code and message.
			alert("Error while saving the released object: " + error.code + " " + error.message);
		}
	});

	parseObject = null;
}


//
//
//
function updateAfterActivation(activatedTab) {

	captureTab(activatedTab);

	chrome.browserAction.setIcon({
		path: "chrome://favicon/" + activatedTab.url,
		tabId: activatedTab.id
	});

}


//
// Called when a tab is activated in the current window
// TODO: Handle the case of multiple windows
chrome.tabs.onActivated.addListener(function (activeInfo) {
  
	// Get the tab
	chrome.tabs.get(activeInfo.tabId, function (activatedTab) {

		if (activatedTab.url == null) {
			chrome.tabs.onUpdated.addListener(
				function onActivatedUpdatedHandler(tabId, changeInfo, updatedTab) {
					if (tabId == activatedTab.id) {
						chrome.tabs.onUpdated.removeListener(onActivatedUpdatedHandler);
						updateAfterActivation(updatedTab);
					}
				}
				);
		}
		else {
			updateAfterActivation(activatedTab);
		}
	});
});


//
// At startup, we need to get the currently active tab
//
chrome.tabs.query({ active: true }, function (tabs) {
	updateAfterActivation(tabs[0]);
});