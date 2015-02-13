var closetab = {};
var _closetab = function(){
  var scope = this;

  // this.TabOperation = Operation.None; //test site: http://ezswag.com/swagbucks/watcher/
  // this._audioSourceCache = {}; // Dictionary for 'id', audiosource.
  this.targetDate = null;
  this.shouldMute = false;
  this.shouldDim = false;
  this.shouldClose = false;

 console.log('hihihi');
// console.log($this);
  this.$dimElement = null;
  this.$dimDialogElement = null;

  this.StartTime = function(targetDate, shouldMute, shouldDim, shouldClose)
  {
    this.targetDate = targetDate;
    this.shouldMute = shouldMute;
    this.shouldDim = shouldDim;
    this.shouldClose = shouldClose;
    // setTimeout(function() { scope.StartTime(); }, targetDate.getTime());
  };

  this.ToggleMute = function()
  {
  //TODO: implement
  };

  this.RemoveDim = function()
  {
    if(this.$dimElement !== null)
    {
      this.$dimElement.remove();
    }
  };

  this.ToggleDim = function()
  {
    this.RemoveDim();
    this.$dimElement = $('<div></div>').css({
      "height":"100%",
      "width":"100%",
      "position":"fixed",
      "left":"0",
      "top":"0",
      "z-index":"1 !important",
      "background-color":"black"
    }).after($('<div></div>').css({
      "width":"100%",
      "top":"40%",
      "left":"0px",
      "position":"fixed",
      "z-index":"5",
      "display":"block",
      "text-align":"center"
    }).append($('<a>Undim Page</a>').css({
      "width":"100px",
      "margin":"0 auto",
      "padding":"40px",
      "border-radius":"25px",
      "border":"1px solid #333",
      "color":"#333",
      "font-family":"Sans-serif"
    }))).hide();

    this.$dimElement.click(function (e){
      scope.$dimElement.fadeOut();
    });

    $('body').append(this.$dimElement);
    
    this.$dimElement.fadeIn();

    console.log('here we go');
  };

  this.StartTimer = function()
  {

  };

  this.ResetTimer = function()
  {

  };

  this.CancelFullcreen = function()
  {
    //tab.windowId
    chrome.windows.update(windowId, { state: "fullscreen" });
    /*
enum of "normal", "minimized", "maximized", or "fullscreen"
    */
  };

  this.CloseTab = function()
  {
    // chrome.tabs.remove(integer or array of integer tabIds, function callback);
  };

/*
 * Message Listener
 */
chrome.extension.onMessage.addListener(function(request, sender, sendResponse)
{
  console.log('request:'+request);
  if (request.targetDate !== undefined)
  {
    console.log(scope);
    scope.StartTime(request.targetDate, request.shouldMute, request.shouldDim, request.shouldClose);
    console.log(request.targetDate);
    console.log('set date:');
    console.log(request.targetDate.toString());
    console.log('self date:');
    console.log(scope.targetDate);
    console.log('self date:');
    console.log(scope.targetDate.toString());
    // scope.ToggleDim();
        //get target date, etc
  }
  else if(request.command === 'getCloseTab')
  {
    console.log('getCloseTab Yo');
    console.log(scope);
    sendResponse(scope);
  }
});

};

_closetab.call(closetab);

// chrome.browserAction.onClicked.addListener(function(tab) {
//  console.log('triggered');
//   chrome.tabs.executeScript({
//     code: 'document.body.style.backgroundColor="red"'
//   });
// });


/* Listen for messages */
// chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
//     /* If the received message has the expected format... */
//     console.log('aaaaaaaaaaaaaa');
//     // if (msg.text && (msg.text == "report_back")) {
//         /* Call the specified callback, passing 
//            the web-pages DOM content as argument */
//     // sendResponse(document.getElementById("mybutton").innerHTML);
//     // }
// });
