import * as manifest from '../../manifest.json';

import StorageController from '../controller/storage';

const displayVersion = document.getElementById('display-version');
displayVersion.textContent = manifest.version;

const display = document.getElementById('display');

const getCurrentHostSettings = () => {

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {

    const currentHostname = new URL(tabs[0].url).hostname;

    StorageController.getHostSettings(currentHostname)
      .then((settings) => {
        display.value = JSON.stringify(settings);
      })
      .catch((error) => {
        display.value = (error);
      });

  });

};

getCurrentHostSettings();

document.getElementById('button-reset-hosts').addEventListener('click', () => {
  StorageController.resetAllHosts();
  getCurrentHostSettings();
});




var displayActive = document.getElementById("active-status")
var buttonActive = document.getElementById("active-button")


/*
* activate/deactivate
*/

chrome.storage.local.get(['hosts'], (storage) => {

  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    
    var tab = tabs[0];

    var currentHostname = new URL(tab.url).hostname

    var hostInStorage = null;

    storage.hosts.forEach( (host, index) => {

      hostInStorage = host.name === currentHostname ? host : hostInStorage;
  
    });

    //display.value = JSON.stringify(hostInStorage)

    if(!hostInStorage){

      displayActive.textContent = 'not set'

      buttonActive.textContent = 'enable'
  
    }else{

     displayActive.textContent = hostInStorage.enabled;

      buttonActive.textContent = hostInStorage.enabled?'disable':'enable';
    
    }
    
  })

})

buttonActive.addEventListener('click', function(){

  chrome.storage.local.get(['hosts'], (storage) => {


          chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {

            var tab = tabs[0];
        
            var currentHostname = new URL(tab.url).hostname
        
            var hostInStorage = null;
        
            storage.hosts.forEach( (host, index) => {
        
              hostInStorage = host.name === currentHostname ? host : hostInStorage;
          
            });

            if(!hostInStorage){

              chrome.tabs.sendMessage(tab.id, {command:'activate'});

        
              displayActive.textContent = 'true'
        
              buttonActive.textContent = 'disable'
          
            }else{

              if(hostInStorage.enabled){
                chrome.tabs.sendMessage(tab.id, {command:'deactivate'});
              }else{
                chrome.tabs.sendMessage(tab.id, {command:'activate'});
              }
              
              displayActive.textContent = !hostInStorage.enabled;
              buttonActive.textContent = !hostInStorage.enabled?'disable':'enable';
            
            }
            
          })

        })

})