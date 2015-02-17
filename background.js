var closeTab = closeTab  || {};
var _closeTab = function(){
	var scope = this;

    chrome.runtime.onMessage.addListener(
      function(request, sender, sendResponse) {
        if (request.command == 'closeCallingTab') {
          chrome.tabs.remove(sender.tab.id);
        }
  });
};

_closeTab.call(closeTab);