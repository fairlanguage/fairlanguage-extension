import * as manifest from '../../manifest.json';

import config from '../../config';

import hosts from '../../hosts';

import StorageController from '../controller/storage';

const STRING_STATUS_DISABLED = 'Die Extension ist aktiviert und kann genutzt werden.<br/>Hiermit ist unserer Datennutzung zugestimmt. Wenn du damit nicht mehr einverstanden bist kannst du die Extension jederzeit deaktivieren.';

const STRING_STATUS_ENABLED = `
Um dir Feedback und Empfehlungen zu deiner Sprache geben zu können, 
müssen wir diese an unseren Server senden und dort analysieren.
Weder speichern wir deine Daten noch geben wir sie weiter und werden dies
auch niemals tun.
Mit der Nutzung dieser Extension stimmst du der Verarbeitung deiner 
Daten und unserer Datenschutzerklärung ausdrücklich zu.`;

const STRING_BUTTON_ENABLE = 'Ja, damit bin ich einverstanden.';
const STRING_BUTTON_DISABLE = 'Extension deaktivieren';

const STRING_ENABLE_HOST = 'Auf dieser Seite aktivieren';
const STRING_DISABLE_HOST = 'Auf dieser Seite deaktivieren';
const STRING_READ_MORE = 'Mehr zu Fairlanguage';

const STRING_SUPPORTED = `
Diese Website wird bereits unterst&uuml;tzt. 
Sollte dennoch ein Fehler auftreten schreibe uns bitte eine Mail.`;

const STRING_EXPERIMENTAL = `
Es kann auf dieser Website noch zu Fehlern kommen. Daher haben haben wir die Extension 
auf dieser Seite zun&auml;chst deaktiviert. Du kannst sie jedoch im experimentellen Modus aktivieren.
`;

/**
 * Elements
 */
const logo = document.getElementById('logo');

const heading = document.getElementById('heading');
const subHeading = document.getElementById('sub-heading');

const viewEnabled = document.getElementById('view-enabled');

const statusHost = document.getElementById('status-host');
const displaySupported = document.getElementById('status-supported');
const statusSupportedString = document.getElementById('status-supported-string');

// General settings
const captionSettings = document.getElementById('caption-settings');
const displaySettings = document.getElementById('string-settings');
const captionEnabled = document.getElementById('caption-enabled');
const statusEnabled = document.getElementById('status-enabled');
const buttonEnabled = document.getElementById('button-enabled');

// Host settings
const captionHost = document.getElementById('caption-host');
const stringHost = document.getElementById('string-host');
const captionHostEnabled = document.getElementById('caption-host');
const displayHost = document.getElementById('active-status');
const buttonHostEnable = document.getElementById('active-button-enable');

// Dev/Hosts
const captionDev = document.getElementById('caption-dev');
const statusHosts = document.getElementById('status-hosts');
const buttonResetHosts = document.getElementById('button-reset-hosts');

// Version
const displayVersion = document.getElementById('display-version');

/**
 * Logo
 */
logo.src = chrome.extension.getURL('flam.png');
logo.style.width = '85px';
logo.style.height = '85px';

/**
 * Heading
 */
heading.innerHTML = 'Fairlanguage';
subHeading.innerHTML = 'Dein Tool f&uuml;r gendergerechte Sprache';

heading.style.display = config.options.heading ? 'flex' : 'none';
subHeading.style.display = config.options.subHeading ? 'flex' : 'none';

/**
 * Status host
 */


/**
 * General settings
 */

// General settings string caption
captionSettings.style.display = config.options.settingsString ? 'flex' : 'none';
// General settings string
displaySettings.style.display = config.options.settingsString ? 'flex' : 'none';
// General settings caption
captionEnabled.style.display = config.options.settingsCaption ? 'flex' : 'none';
// General settings status
statusEnabled.style.display = config.options.settings ? 'flex' : 'none';
// General settings button
buttonEnabled.style.display = config.options.settings ? 'flex' : 'none';

buttonEnabled.addEventListener('click', () => {

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {

    chrome.tabs.sendMessage(tabs[0].id, { command: 'enabled' });

  });

});

/**
 * Host settings
 */

// Host settings string caption
captionHost.style.display = config.options.hostSettingsCaption ? 'flex' : 'none';
// Host settings string
stringHost.style.display = config.options.hostSettingsString ? 'flex' : 'none';
// Host settings caption
displayHost.style.display = config.options.hostSettingsDisplay ? 'flex' : 'none';
// Host settings status
captionHostEnabled.style.display = config.options.hostSettingsCaption ? 'flex' : 'none';
// Host settings button
buttonHostEnable.style.display = config.options.buttonHostEnable ? 'flex' : 'none';

buttonHostEnable.addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { command: buttonHostEnable.textContent === STRING_DISABLE_HOST ? 'host-disable' : 'host-enable' });
    // buttonHostEnable.style.color = buttonHostEnable.textContent === STRING_ENABLE_HOST ? 'grey' : 'black';
    // buttonHostEnable.style.borderColor = buttonHostEnable.textContent === STRING_ENABLE_HOST ? 'grey' : 'black';
  });
});

/**
 * Dev/hosts
 */
captionDev.style.display = config.options.dev ? 'flex' : 'none';
statusHosts.style.display = config.options.dev ? 'flex' : 'none';
buttonResetHosts.style.display = config.options.dev ? 'flex' : 'none';

buttonResetHosts.addEventListener('click', () => {
  StorageController.resetAllHosts();
  getCurrentHostSettings();
  getAllHosts();
});

/**
 * Version
 */
displayVersion.style.display = config.options.displayVersion ? 'flex' : 'none';

displayVersion.textContent = `v${manifest.version}`;

/**
 * Run
 */

chrome.runtime.onMessage.addListener((host) => {

  if (host.name === undefined) return;

  displaySupported.textContent = host.name;

});
chrome.runtime.onMessage.addListener((settings) => {
  if (settings.host === undefined) return;
  displayHost.textContent = settings.host.enabled;
  stringHost.value = JSON.stringify(settings.host);
  buttonHostEnable.textContent = settings.host.enabled ? STRING_DISABLE_HOST : STRING_ENABLE_HOST;

  // Reload current tab
  chrome.tabs.query({status:'complete'}, (tabs)=>{
    tabs.forEach((tab)=>{
        if(tab.url){
            chrome.tabs.update(tab.id,{url: tab.url});
         }
        });
    });

});
chrome.runtime.onMessage.addListener((data) => {

  if (data.settings === undefined) return;

  const { settings } = data;

  displaySettings.value = JSON.stringify(settings);

  buttonEnabled.textContent = settings.enabled || settings.enabled === undefined ? STRING_BUTTON_DISABLE : STRING_BUTTON_ENABLE;
  
  statusEnabled.innerHTML = settings.enabled || settings.enabled === undefined ? STRING_STATUS_DISABLED : STRING_STATUS_ENABLED;
  statusEnabled.style.display = settings.enabled || settings.enabled === undefined ? 'none' : 'flex';

  viewEnabled.style.display = settings.enabled || settings.enabled === undefined ? 'flex' : 'none';

  // Reload current tab
  chrome.tabs.query({status:'complete'}, (tabs)=>{
    tabs.forEach((tab)=>{
        if(tab.url){
            chrome.tabs.update(tab.id,{url: tab.url});
         }
        });
    });

});
chrome.runtime.onMessage.addListener((settings) => {
  if (settings.toolbar === undefined) return;
  StorageController.getSettings()
    .then((_settings) => {
      displaySettings.value = JSON.stringify(_settings);
    })
    .catch((error) => {
      displaySettings.value = (error);
    });
});


const getSettings = () => {
  StorageController.getSettings()
    .then((settings) => {
      displaySettings.value = JSON.stringify(settings);
      
      buttonEnabled.textContent = settings.enabled || settings.enabled === undefined ? STRING_BUTTON_DISABLE : STRING_BUTTON_ENABLE;

      statusEnabled.innerHTML = settings.enabled || settings.enabled === undefined ? STRING_STATUS_DISABLED : STRING_STATUS_ENABLED;
      statusEnabled.style.display = settings.enabled || settings.enabled === undefined ? 'none' : 'flex';

      viewEnabled.style.display = settings.enabled || settings.enabled === undefined ? 'flex' : 'none';

    })
    .catch((error) => {
      displaySettings.value = (error);
    });
};

const getCurrentHostSupportFromHosts = (currentHost) => {
  let currentHostSupport = 'experimental';
  for (const host of hosts){
    if (currentHost.match(new RegExp(host.host, 'g'))){
      currentHostSupport = host.support;
    }
  }
  return currentHostSupport;
};

const getCurrentHostSettings = () => {

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {

    const currentHost = new URL(tabs[0].url).hostname;

    StorageController.getHostSettings(currentHost)
      .then((settings) => {

        stringHost.value = JSON.stringify(settings);

        displayHost.textContent = settings.enabled === null ? 'not set' : settings.enabled;

        const currentHostSupport = getCurrentHostSupportFromHosts(currentHost);

        buttonHostEnable.textContent = settings.enabled === true || settings.enabled === null ? STRING_DISABLE_HOST : STRING_ENABLE_HOST;
        // buttonHostEnable.style.color = settings.enabled === true || settings.enabled === null ? 'grey' : 'black';
        // buttonHostEnable.style.borderColor = settings.enabled === true || settings.enabled === null ? 'grey' : 'black';

        // buttonHostDisable.textContent = 'disable';

        displaySupported.textContent = `${currentHost}`;

        if(settings.enabled){
          statusHost.style.backgroundColor = currentHostSupport === 'full' ? 'green' : 'orange';
        }else{
          statusHost.style.backgroundColor = 'red';
        }

        statusSupportedString.innerHTML = currentHostSupport === 'full' ? STRING_SUPPORTED : STRING_EXPERIMENTAL;

      })
      .catch((error) => {
        display.value = (error);
      });

  });

};

const getAllHosts = () => {
  StorageController.getHosts()
    .then((hosts) => {
      statusHosts.textContent = 'hosts: '+hosts.length;
    });
};

getSettings();
getCurrentHostSettings();
getAllHosts();
