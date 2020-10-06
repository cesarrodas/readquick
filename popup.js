document.addEventListener("DOMContentLoaded", function() {
  
  const readingBars = document.getElementById("readingBarsActivationButton");

  chrome.storage.sync.get(['activated'], function(result) {
    //console.log("result", result)
    //console.log("activated", result.activated);
    readingBars.checked = result.activated;
  });

  
  readingBars.addEventListener("change", (e) => {

    chrome.storage.sync.set({'activated': e.target.checked}, function() {
      //console.log('Value is set to ' + value);
    });

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {readingBars: e.target.checked}, function(response) {
        //console.log(response);
        if(response.ok){
          console.log("ok");
        }
      });
    });
  });

});