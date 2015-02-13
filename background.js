var closeTab = closeTab  || {};
var _closeTab = function(){
	var scope = this;

	this.tabInfoDict = {};



};

function testRequest() {        
    chrome.tabs.getSelected(null, function(tab) {
        chrome.tabs.sendMessage(tab.id, {greeting: "hello"});
    });    
}



_closeTab.call(closeTab);

/* A function creator for callbacks */
function doStuffWithDOM(element) {
	console.log(element);
}

/* When the browser- action button is clicked... 
DOESNT SEEM TO WORK
*/
chrome.browserAction.onClicked.addListener(function(tab) {
    // ...check the URL of the active tab against our pattern and... 
    // if (urlRegex.test(tab.url)) {
         // ...if it matches, send a message specifying a callback too 
        console.log('asdasdasdasd');
        console.log(tab.url);
        chrome.tabs.sendMessage(tab.id, { text: "report_back1" },
                                function(response){ 
            doStuffWithDOM(response);
        });
    // }
});


// setInterval(function() {
// 	        console.log('as11111dasdasdasd');
//     chrome.tabs.getSelected(null, function(tab) {
//         if(tab) {
//             // CURRENT_LOCATION.location = tab.url;
//             // CURRENT_LOCATION.title = tab.title;
//         }
//     });
// }, 200);
var aTab;

//Tab updated
chrome.tabs.onUpdated.addListener(function(id, changeInfo ,tab) {
	console.log('4444');
    if(changeInfo.status=='complete'){ //To send message after the webpage has loaded
        chrome.tabs.sendMessage(tab.id, { text: "report_back" },function(response){ 
            doStuffWithDOM(response);
        });
    }
});