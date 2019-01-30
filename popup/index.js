var buttonVisible = document.getElementById("visible")
var buttonActivated = document.getElementById("activated")
var buttonEnabled = document.getElementById("enabled")

/*
* show/hide
*/

chrome.storage.local.get(['visible'], function(result) {

  buttonVisible.textContent = 
  
  result.visible===undefined?'hide':
  
  result.visible?'hide':'show'

});

buttonVisible.addEventListener('click', function(){

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

      buttonVisible.textContent = state?'hide':'show'

    });

  });

})

/*
* activate/deactivate (on this site)
*/

chrome.storage.local.get(['active'], function(result) {

  buttonActivated.textContent = 
  
  result.active===undefined?'deactivate':
  
  result.active?'deactivate':'activate'

})

buttonActivated.addEventListener('click', function(){

  chrome.storage.local.get(['active'], function(result) {

    var state = !result.active

    chrome.storage.local.set({active: state}, function() {

      if(!state){
        chrome.tabs.query({}, tabs => {
            tabs.forEach(tab => {
            chrome.tabs.sendMessage(tab.id, {command:'deactivate'});
          });
        });
      }else{
        chrome.tabs.query({}, tabs => {
          tabs.forEach(tab => {
          chrome.tabs.sendMessage(tab.id, {command:'activate'});
        });
      });
      }

      buttonActivated.textContent = state?'deactive':'activate'

    });

  });

})

/*
* Erase verything and turn the whole thing off.
*/

chrome.storage.local.get(['enabled'], function(result) {

  buttonEnabled.textContent = 
  
  result.enabled===undefined?'enabled':
  
  result.enabled?'disable':'enable'

})  

buttonEnabled.addEventListener('click', function(){

  chrome.storage.local.get(['enabled'], function(result) {

    var state = !result.enabled

    chrome.storage.local.set({enabled: state}, function() {

      if(!state){
        chrome.tabs.query({}, tabs => {
            tabs.forEach(tab => {
            chrome.tabs.sendMessage(tab.id, {command:'erase'});
          });
        });
      }

      buttonEnabled.textContent = state?'disable':'enable'

    });

  });

})