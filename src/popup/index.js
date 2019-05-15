import * as manifest from '../../manifest.json';

import config from '../../config';

import hosts from '../../hosts';

import StorageController from '../controller/storage';

const STRING_ENABLE_HOST = 'Auf dieser Seite aktivieren';
const STRING_DISABLE_HOST = 'Auf dieser Seite deaktivieren';
const STRING_READ_MORE = 'Mehr zu Fairlanguage';

const STRING_SUPPORTED = 'Diese Website wird unterst&uuml;tzt. <br/> Sollte dennoch ein Fehler auftreten <br/> schreib uns bitte eine Mal.';
const STRING_EXPERIMENTAL = 'Es kann auf dieser Website noch zu<br/>Fehlern kommen.<br/><br/>Daher haben haben wir die Extension <br/>auf dieser Seite zun&auml;chst deaktiviert.<br/><br/>Du kannst sie jedoch troztem<br/>im EXPERIMENTAL STATE aktivieren.';

const logo = document.getElementById('logo');
logo.src = chrome.extension.getURL('flam.png');
logo.style.width = '85px';
logo.style.height = '85px';

const statusHost = document.getElementById('status-host');

const displaySupported = document.getElementById('status-supported');
const statusSupportedString = document.getElementById('status-supported-string');


chrome.runtime.onMessage.addListener((host) => {

  if (host.name === undefined) return;

  displaySupported.textContent = host.name;

});

const captionSettings = document.getElementById('caption-settings');
const displaySettings = document.getElementById('string-settings');

captionSettings.style.display = config.options.settingsString ? 'flex' : 'none';
displaySettings.style.display = config.options.settingsString ? 'flex' : 'none';

const captionEnabled = document.getElementById('caption-enabled');
const statusEnabled = document.getElementById('status-enabled');
const buttonEnabled = document.getElementById('button-enabled');

statusEnabled.style.display = config.options.settingsEnabled ? 'flex' : 'none';
buttonEnabled.style.display = config.options.settingsEnabled ? 'flex' : 'none';
captionEnabled.style.display = config.options.settingsEnabled ? 'flex' : 'none';

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

stringHost.style.display = config.options.hostSettingsString ? 'flex' : 'none';
captionHost.style.display = config.options.hostSettingsCaption ? 'flex' : 'none';
displayHost.style.display = config.options.hostSettingsDisplay ? 'flex' : 'none';
buttonHostEnable.style.display = config.options.buttonHostEnable ? 'flex' : 'none';
buttonHostDisable.style.display = config.options.buttonHostDisable ? 'flex' : 'none';

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
displayVersion.style.display = config.options.version ? 'flex' : 'none';

const buttonReadMore = document.getElementById('button-read-more');
buttonReadMore.style.display = config.options.buttonReadMore ? 'flex' : 'none';
buttonReadMore.textContent = STRING_READ_MORE;

buttonReadMore.addEventListener('click', () => {

  chrome.tabs.create({ url: 'https://fairlanguage.com' });

});

/**
 * Settings
 */
const getSettings = () => {
  StorageController.getSettings()
    .then((settings) => {
      displaySettings.value = JSON.stringify(settings);

      statusEnabled.textContent = settings.enabled===null?'null':settings.enabled;
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
        buttonHostEnable.style.color = settings.enabled === true || settings.enabled === null ? 'grey' : 'black';
        buttonHostEnable.style.borderColor = settings.enabled === true || settings.enabled === null ? 'grey' : 'black';

        buttonHostDisable.textContent = 'disable';

        displaySupported.textContent = `${currentHost}`;

        statusHost.style.backgroundColor = currentHostSupport === 'full' ? 'green' : 'red';

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

chrome.runtime.onMessage.addListener((data) => {

  if (data.settings === undefined) return;

  const { settings } = data;

  displaySettings.value = JSON.stringify(settings);
  statusEnabled.textContent = settings.settings === null?'null':settings.enabled;
  buttonEnabled.textContent = settings.enabled ? 'disable' : 'enable';

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {

    tabs[0].reload()

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
    chrome.tabs.sendMessage(tabs[0].id, { command: buttonHostEnable.textContent === STRING_DISABLE_HOST ? 'host-disable' : 'host-enable' });
    buttonHostEnable.style.color = buttonHostEnable.textContent === STRING_ENABLE_HOST ? 'grey' : 'black';
    buttonHostEnable.style.borderColor = buttonHostEnable.textContent === STRING_ENABLE_HOST ? 'grey' : 'black';
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
  buttonHostEnable.textContent = settings.host.enabled ? STRING_DISABLE_HOST : STRING_ENABLE_HOST;
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
displayVersion.textContent = `v${manifest.version}`;
