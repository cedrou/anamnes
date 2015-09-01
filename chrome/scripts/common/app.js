"use strict";

var Parse = require('parse').Parse;
var _ = require('underscore');
 

var App = function() {
	
	//this.storageName = "anamnes";
	//this.entries = localStorage.getItem(this.storageName) ? JSON.parse(localStorage.getItem(this.storageName)) : [];
	this.currentTab = null;
	this.parseItems = {};
};

		
// App.prototype._storageAdd = function(item) {
// 	this._storageRemove(item.url);
// 	this.entries.push(item);
// 	this._storageSave();
// };
// 		
// App.prototype._storageRemove = function(url) {
// 	var idx = this.findEntryIndex(url);
// 	if (idx != null)
// 	{
// 		this.entries.splice(idx, 1);
// 		this._storageSave();
// 	}
// };
// 		
// App.prototype._storageSave = function() {
// 	localStorage.setItem(this.storageName, JSON.stringify(this.entries));
// }



// App.prototype.findEntryIndex = function (url) {
// 	var idx = null;
// 	
// 	for (var i=0; i < this.entries.length; i++) {
// 		if (this.entries[i].url == url)
// 		{
// 			idx = i;
// 			break;
// 		}
// 	}	
// 	
// 	return idx;
// }
// 
// App.prototype.getEntry = function (url) {
// 	for (var i=0; i < this.entries.length; i++) {
// 		if (this.entries[i].url == url)
// 		{
// 			return this.entries[i];
// 		}
// 	}	
// 	
// 	return null;
// }

App.prototype.createEntry = function (tab) {
	return {
		url: tab.url,
		title: tab.title,
		lastActivated: 0,
		totalTime: 0,
		timestamps: []
	};
}

// App.prototype.activateTab = function(tab) {
// 	
// 	// Get current date
// 	var timestamp = Date.now();
// 	
// 	// Update the total time of the previous tab
// 	if (this.currentTab != null)
// 	{
// 		var currentEntry = this.getEntry(this.currentTab.url);
// 		
// 		var activeTime = timestamp - currentEntry.lastActivated;
// 		currentEntry.totalTime += activeTime;
// 	}
// 	
// 	// Get or create an entry for the activated tab
// 	var idx = this.findEntryIndex(tab.url);
// 	var entry = (idx != null) ? this.entries[idx] : this.createEntry(tab);
// 	
// 	// update its last activate timestamp
// 	entry.lastActivated = timestamp;
// 	this._storageAdd(entry);
// 	
// 	// update current tab pointer for the next time
// 	this.currentTab = tab;
// }

App.prototype.captureTab = function (tab) {
	// Get current date
	var timestamp = Date.now();
	
	this.releaseCurrentTab(timestamp);
	
	var item = this.parseItems[tab.url];
	if (item == undefined)
	{
		item = this.createEntry(tab);
		this.parseItems[tab.url] = item
	}

	// update its last activate timestamp
	item.timestamps.push([timestamp, 0]);	
	item.lastActivated = timestamp;
	
	// update current tab pointer for the next time
	this.currentTab = tab;
}

App.prototype.releaseCurrentTab = function (timestamp) {
		
	if (this.currentTab == null)
		return;
		
	var item = this.parseItems[this.currentTab.url];
	
	item.totalTime += (timestamp - item.lastActivated);	
	_.last(item.timestamps)[1] = timestamp;
	
	// release current tab pointer
	this.currentTab = null;
}


module.exports = App;