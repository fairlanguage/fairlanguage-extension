import * as manifest from '../../manifest.json';

import config from '../../config';

import StorageController from '../controller/storage';

const captionSettings = document.getElementById('caption-settings');
const displaySettings = document.getElementById('string-settings');

captionSettings.style.display = config.options.settingsString ? 'flex' : 'none';
displaySettings.style.display = config.options.settingsString ? 'flex' : 'none';

const captionEnabled = document.getElementById('caption-enabled');
const statusEnabled = document.getElementById('status-enabled');
const buttonEnabled = document.getElementById('button-enabled');

statusEnabled.style.display = config.options.enabled ? 'flex' : 'none';
buttonEnabled.style.display = config.options.enabled ? 'flex' : 'none';
captionEnabled.style.display = config.options.enabled ? 'flex' : 'none';

const captionConsent = document.getElementById('caption-consent');
const statusConsent = document.getElementById('status-consent');
const buttonConsent = document.getElementById('button-consent');

statusConsent.style.display = config.options.consent ? 'flex' : 'none';
buttonConsent.style.display = config.options.consent ? 'flex' : 'none';
captionConsent.style.display = config.options.consent ? 'flex' : 'none';

const captionHost = document.getElementById('caption-host');
const stringHost = document.getElementById('string-host');
const displayHost = document.getElementById('active-status');
const buttonHostEnable = document.getElementById('active-button-enable');
const buttonHostDisable = document.getElementById('active-button-disable');

captionHost.style.display = config.options.host ? 'flex' : 'none';
stringHost.style.display = config.options.hostString ? 'flex' : 'none';
displayHost.style.display = config.options.host ? 'flex' : 'none';
buttonHostEnable.style.display = config.options.host ? 'flex' : 'none';
buttonHostDisable.style.display = config.options.host ? 'flex' : 'none';

const captionToolbar = document.getElementById('caption-toolbar');
const statusToolbar = document.getElementById('status-toolbar');
const buttonToolbar = document.getElementById('button-toolbar');

captionToolbar.style.display = config.options.toolbar ? 'flex' : 'none';
statusToolbar.style.display = config.options.toolbar ? 'flex' : 'none';
buttonToolbar.style.display = config.options.toolbar ? 'flex' : 'none';

const captionDev = document.getElementById('caption-dev');
const statusHosts = document.getElementById('status-hosts');
const buttonResetHosts = document.getElementById('button-reset-hosts');

captionDev.style.display = config.options.dev ? 'flex' : 'none';
statusHosts.style.display = config.options.dev ? 'flex' : 'none';
buttonResetHosts.style.display = config.options.dev ? 'flex' : 'none';

const captionVersion = document.getElementById('caption-version');
const displayVersion = document.getElementById('display-version');

captionVersion.style.display = config.options.dev ? 'flex' : 'none';
displayVersion.style.display = config.options.dev ? 'flex' : 'none';

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
        stringHost.value = JSON.stringify(settings);

        displayHost.textContent = settings.enabled === null ? 'not set' : settings.enabled;

        buttonHostEnable.textContent = 'enable';
        buttonHostDisable.textContent = 'disable';

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
}

getSettings();
getCurrentHostSettings();
getAllHosts();

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
buttonHostEnable.addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { command: 'host-enable' });
  });
});
buttonHostDisable.addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { command: 'host-disable' });
  });
});

chrome.runtime.onMessage.addListener((settings) => {
  if (settings.host === undefined) return;
  displayHost.textContent = settings.host.enabled;
  stringHost.value = JSON.stringify(settings.host);
});

/**
 * Reset hosts
 */
buttonResetHosts.addEventListener('click', () => {
  StorageController.resetAllHosts();
  getCurrentHostSettings();
  getAllHosts();
});

/**
 * Version
 */
displayVersion.textContent = manifest.version;
