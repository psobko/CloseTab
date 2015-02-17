
function toggleCountdown(enabled, animated) {
  if(animated) {
    if(enabled) {
        updateTimerWithDate(m.toDate());
        $datePicker.fadeOut(400, function() {
          $countdownContainer.fadeIn();
        });
    } else {
       clearInterval(intervalID);
       $countdownText.text('00:00:00');
       $countdownContainer.fadeOut(400, function() {
         $datePicker.fadeIn();
       });
    }
    return;
  }

  $datePicker.toggle(!enabled);
  $countdownContainer.toggle(enabled);
}

function updateTimerWithDate(date) {
    clearInterval(intervalID);

    var duration = moment.duration(date - new Date(), 'milliseconds');
    var interval = 1000;
    isCounting = true;

    $countdownText.text(moment.utc(duration.asMilliseconds())
                              .format("HH:mm:ss"));
    
    intervalID = setInterval(function() {
      duration.subtract(interval);
      if(duration.isB)
      $countdownText.text(moment.utc(duration.asMilliseconds())
                                .format("HH:mm:ss"));
    }, interval);
    //TODO: reset on finish
}

function updateUI(sendResponse) {
  if(sendResponse.targetDate !== null) //Is Counting
  {
    $('#checkbox-mute').prop('checked', sendResponse.shouldMute);
    $('#checkbox-dim').prop('checked', sendResponse.shouldDim);
    $('#checkbox-close').prop('checked', sendResponse.shouldClose);
    m = moment(sendResponse.targetDate);
    updateTimerWithDate(sendResponse.targetDate);
    toggleCountdown(true, false);
    updatePrimaryButton(true);
  } else {
    toggleCountdown(false, false);
    updatePrimaryButton(false);
  }
  //TODO: update button/UI state
  // $('body').css('display','block');
}

/***********************************************************************
 * UTILITY
 ***********************************************************************/

function consoleLog(obj) {
  // console.log(obj);
  chrome.tabs.executeScript({
    code: 'console.log("'+obj+'")'
  });
}

function getCurrentTab(callback) {
  var queryInfo = {
    active: true,
    currentWindow: true
  };
  chrome.tabs.query(queryInfo, function(tabs) {
    callback(tabs[0]);
  });
}

/***********************************************************************
 * MESSAGING
 ***********************************************************************/

function getPreviousDate()
{
  consoleLog('get previous date');
  getCurrentTab(function(tab){
    chrome.tabs.sendMessage(tab.id, {command: 'getCloseTab'}, updateUI);
  });
}

function updateDate()
{
  consoleLog('updateDate');
  getCurrentTab(function(tab)
  {
    consoleLog('setting date'+m.toString());
    consoleLog(m.toDate());
    chrome.tabs.sendMessage(tab.id, {
      targetDate: m.valueOf(),
      shouldMute:$('#checkbox-mute').prop('checked'),
      shouldDim:$('#checkbox-dim').prop('checked'),
      shouldClose:$('#checkbox-close').prop('checked')
    });
  });
}

function updatePrimaryButton(isCounting)
{
  $('#button-primary').toggleClass('btn-success', !isCounting)
                      .toggleClass('btn-danger', isCounting)
                      .text(isCounting ? 'CANCEL' : 'START');
}

/***********************************************************************
 * JQUERY
 ***********************************************************************/

var $countdownText;
var $datePicker;
var $countdownContainer;
var isCounting;
var m = moment();
var intervalID;

 // document.write('<style type="text/css">body{display:none}</style>');

$(document).ready(function() {
  consoleLog(new Date());
  consoleLog(m.toDate());
  consoleLog('DOC READY');
   $countdownText = $('#countdown-text');
   $datePicker = $('#datetimepicker3');
   $countdownContainer = $('#countdown-container');
   $countdownText = $('#countdown-text');

    var xyz = $('#datetimepicker3').datetimepicker({
                        format: 'LT',
                        defaultDate: new Date()
                    });

  getPreviousDate();

  $('.options-form input:checkbox').change(function() {
     if(m.isBefore(new Date())) {
      consoleLog('INVALID DATE');
      return;
    }
    updateDate();
  });

// $countdownContainer.removeClass('hidden');
  $('a[data-interval]').click(function(e) {
      e.preventDefault();
      m.add($(this).data('interval'), 'm');
      xyz.data("DateTimePicker").date(m.toDate());
      if(isCounting) {
          updateTimerWithDate(m.toDate());
      }
  });

  $('#button-primary').click(function(e) {
    e.preventDefault();
    if(m.isBefore(new Date())) {
      consoleLog('INVALID DATE');
      return;
    }
    
    updateDate();

    isCounting = !isCounting;
    toggleCountdown(isCounting, true);
    updatePrimaryButton(isCounting);
  });
});