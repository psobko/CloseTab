var closetab = {};
var _closetab = function(){
  var scope = this;
  
  this.targetDate = null;
  this.shouldMute = false;
  this.shouldDim = false;
  this.shouldClose = false;
  this.timerIntrvalID = null;

  this.$dimElement = null;
  this.$dimDialogElement = null;

  /***********************************************************************
   * Timer
   ***********************************************************************/

  this.StartTimer = function() {
    clearInterval(this.timerIntrvalID);
    var interval = this.targetDate - new Date().valueOf();
    this.timerIntrvalID = setTimeout(function() { scope.TimerEnded();  }, interval);
  };

  this.TimerEnded = function() {
    if(this.shouldClose) {
      this.CloseTab();
      return;
    }
    
    if(this.shouldDim) {
      this.ToggleDim();
    }

    if(this.shouldMute) {
      this.ToggleMute();
    }
  };

  this.StopTimer = function() {
    clearInterval(this.timerIntrvalID);
  };

  this.ClearTimer = function() {
    this.targetDate = null;
    clearInterval(this.timerIntrvalID);
  };

  /***********************************************************************
   * Screen Dim
   ***********************************************************************/

  this.ToggleDim = function() {
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
  };

  this.CancelFullcreen = function() {
    //tab.windowId
    chrome.windows.update(windowId, { state: "fullscreen" });
    /*
enum of "normal", "minimized", "maximized", or "fullscreen"
    */
  };

  this.ToggleMute = function() {
  //TODO: implement
  };

  this.RemoveDim = function() {
    if(this.$dimElement !== null)
    {
      this.$dimElement.remove();
    }
  };

  this.CloseTab = function() {
    chrome.runtime.sendMessage({command: 'closeCallingTab'});
  };

  /***********************************************************************
   * Messaging
   ***********************************************************************/

  chrome.extension.onMessage.addListener(function(request, sender, sendResponse)
  {
    console.log('request:'+request);
    if (request && request.targetDate !== undefined)
    {
      scope.targetDate = request.targetDate;
      scope.shouldMute = request.shouldMute;
      scope.shouldDim = request.shouldDim;
      scope.shouldClose = request.shouldClose;
      scope.StartTimer();
    }
    else if(request.command === 'getCloseTab')
    {
      sendResponse(scope);
    }
    else if(request.command === 'cancelCountdown')
    {
      scope.StopTimer();
    }
  });
};

_closetab.call(closetab);