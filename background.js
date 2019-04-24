chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
	// read changeInfo data and do something with it
	// send the new url to contentscripts.js
	if (changeInfo.url) {
		chrome.tabs.sendMessage(tabId, {
			url: changeInfo.url
		})
	}
});