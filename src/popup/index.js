import * as manifest from '../../manifest.json';

import StorageController from '../controller/storage';

const displayVersion = document.getElementById('display-version');

const displaySettings = document.getElementById('string-settings');

const statusToolbar = document.getElementById('status-toolbar');
const buttonToolbar = document.getElementById('button-toolbar');

const displayActive = document.getElementById('active-status');
const buttonActive = document.getElementById('active-button');

const display = document.getElementById('display');

const statusHosts = document.getElementById('status-hosts');
const buttonResetHosts = document.getElementById('button-reset-hosts');

/**
 * Storage settings
 */
const getSettings = () => {
  StorageController.getSettings()
    .then((settings) => {
      displaySettings.value = JSON.stringify(settings);
      statusToolbar.textContent = settings.toolbar;
      buttonToolbar.textContent = settings.toolbar ? 'hide' : 'show';
    })
    .catch((error) => {
      displaySettings.value = (error);
    });
};

const getCurrentHostSettings = () => {

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {

    const currentHostname = new URL(tabs[0].url).hostname;

    StorageController.getHostSettings(currentHostname)
      .then((settings) => {
        display.value = JSON.stringify(settings);

        displayActive.textContent = settings.enabled;
        buttonActive.textContent = settings.enabled ? 'disable' : 'enable';


      })
      .catch((error) => {
        display.value = (error);
      });

  });

};

StorageController.getHosts()
  .then((hosts) => {
    statusHosts.textContent = 'hosts: '+hosts.length;
  });

getSettings();
getCurrentHostSettings();

/**
 * Toolbar
 */
buttonToolbar.addEventListener('click', () => {

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {

    chrome.tabs.sendMessage(tabs[0].id, { command: 'toolbar' });

  });

});

chrome.runtime.onMessage.addListener((settings) => {
  if (settings.toolbar === undefined) return;
  StorageController.getSettings()
    .then((_settings) => {
      displaySettings.value = JSON.stringify(_settings);
      statusToolbar.textContent = _settings.toolbar;
      buttonToolbar.textContent = _settings.toolbar ? 'hide' : 'show';
    })
    .catch((error) => {
      displaySettings.value = (error);
    });
});

/**
 * Hosts
 */
buttonActive.addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { command: 'host' });
  });
});
chrome.runtime.onMessage.addListener((settings) => {
  if (settings.host === undefined) return;
  displayActive.textContent = settings.host.enabled;
  buttonActive.textContent = settings.host.enabled ? 'disable' : 'enable';
  display.value = JSON.stringify(settings.host);
});

/**
 * Reset hosts
 */
buttonResetHosts.addEventListener('click', () => {
  StorageController.resetAllHosts();
  getCurrentHostSettings();
});

/**
 * Version
 */
displayVersion.textContent = manifest.version;
