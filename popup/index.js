var buttonEnabled = document.getElementById("enabled")

/*
* show/hide
*/

chrome.storage.local.get(['visible'], function(result) {

  buttonEnabled.textContent = 
  
  result.visible===undefined?'hide':
  
  result.visible?'hide':'show'

});

buttonEnabled.addEventListener('click', function(){

  chrome.storage.local.get(['visible'], function(result) {

    var state = !result.visible

    chrome.storage.local.set({visible: state}, function() {

      if(!state){
        chrome.tabs.query({}, tabs => {
            tabs.forEach(tab => {
            chrome.tabs.sendMessage(tab.id, {command:'hide'});
          });
        });
      }else{
        chrome.tabs.query({}, tabs => {
          tabs.forEach(tab => {
          chrome.tabs.sendMessage(tab.id, {command:'show'});
        });
      });
      }

      buttonEnabled.textContent = state?'hide':'show'

    });

  });

})