import * as manifest from '../../manifest.json';

import StorageController from '../controller/storage';

const displayVersion = document.getElementById('display-version');

const statusEnabled = document.getElementById('status-enabled');
const buttonEnabled = document.getElementById('button-enabled');

const statusConsent = document.getElementById('status-consent');
const buttonConsent = document.getElementById('button-consent');

const displaySettings = document.getElementById('string-settings');

const statusToolbar = document.getElementById('status-toolbar');
const buttonToolbar = document.getElementById('button-toolbar');

const displayActive = document.getElementById('active-status');

const buttonActiveEnable = document.getElementById('active-button-enable');
const buttonActiveDisable = document.getElementById('active-button-disable');

const display = document.getElementById('display');

const statusHosts = document.getElementById('status-hosts');
const buttonResetHosts = document.getElementById('button-reset-hosts');

/**
 * Settings
 */
const getSettings = () => {
  StorageController.getSettings()
    .then((settings) => {
      displaySettings.value = JSON.stringify(settings);

      statusEnabled.textContent = settings.enabled;
      buttonEnabled.textContent = settings.enabled ? 'disable' : 'enable';

      statusToolbar.textContent = settings.toolbar;
      buttonToolbar.textContent = settings.toolbar ? 'hide' : 'show';

      statusConsent.textContent = settings.consent;
      buttonConsent.textContent = settings.consent ? 'take' : 'give';
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

        displayActive.textContent = settings.enabled === null ? 'not set' : settings.enabled;

        buttonActiveEnable.textContent = 'enable';
        buttonActiveDisable.textContent = 'disable';

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
 * Enabled
 */
buttonEnabled.addEventListener('click', () => {

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {

    chrome.tabs.sendMessage(tabs[0].id, { command: 'enabled' });

  });

});

chrome.runtime.onMessage.addListener((settings) => {
  if (settings.enabled === undefined) return;
  StorageController.getSettings()
    .then((_settings) => {
      displaySettings.value = JSON.stringify(_settings);
      statusEnabled.textContent = _settings.enabled;
      buttonEnabled.textContent = _settings.enabled ? 'disable' : 'enable';
    })
    .catch((error) => {
      displaySettings.value = (error);
    });
});

/**
 * Consent
 */
buttonConsent.addEventListener('click', () => {

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {

    chrome.tabs.sendMessage(tabs[0].id, { command: 'consent' });

  });

});

chrome.runtime.onMessage.addListener((settings) => {
  if (settings.consent === undefined) return;
  StorageController.getSettings()
    .then((_settings) => {
      displaySettings.value = JSON.stringify(_settings);
      statusConsent.textContent = _settings.consent;
      buttonConsent.textContent = _settings.consent ? 'take' : 'give';
    })
    .catch((error) => {
      displaySettings.value = (error);
    });
});

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
buttonActiveEnable.addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { command: 'host-enable' });
  });
});
buttonActiveDisable.addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { command: 'host-disable' });
  });
});

chrome.runtime.onMessage.addListener((settings) => {
  if (settings.host === undefined) return;
  displayActive.textContent = settings.host.enabled;
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
