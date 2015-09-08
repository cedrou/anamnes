window.addEventListener('focus',function() { chrome.runtime.sendMessage('focus'); });
window.addEventListener('blur',function() { chrome.runtime.sendMessage('blur'); });

//chrome.runtime.sendMessage('injected');

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
	if (message == "fadeIn") {
		displayOverlay();
	} else if (message == "fadeOut") {
		removeOverlay();
	}
	
});

function displayOverlay(){
	var div = document.getElementById("anamnes-overlay");
	if (div != null)
		return;
		
	div = document.createElement('div');
	div.id = "anamnes-overlay";
	
	div.style.position="fixed";
	div.style.top="0";
	div.style.left="0";
	div.style.width="100%";
	div.style.height="100%";
    div.style.backgroundColor="rgba(0,0,0,.5)";
	div.style.zIndex="10000";
	
	document.body.appendChild(div);
	
	
};

function removeOverlay() {
	var div = document.getElementById("anamnes-overlay");
	if (div != null)
		document.body.removeChild(div);
}
