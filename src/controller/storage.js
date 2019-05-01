import config from "../../config";

import hosts from '../../hosts';

import log from '../helpers/helper-logger';

import '@babel/polyfill';

export default class StorageController {

  constructor() {
    return 'I controll the storage.';
  }

  static getSettings() {

    return new Promise((resolve, reject) => {

      chrome.storage.local.get(['settings'], (storage) => {

        log('Reading general settings from local storage...')

        if (storage.settings) {
          log('Found general settings:');
          log(JSON.stringify(storage.settings));
          resolve(storage.settings);
        } else {
          const settings = {
            enabled: config.default.enabled,
          };
    
          chrome.storage.local.set({ settings }, () => {
            log('Wrote initial settings to local storage:');
            log(JSON.stringify(settings))
            resolve(settings);
          });
        }

        // We don't have any settings saved yet: Extension was just installed

        // reject(new Error('Reading general settings from local storage'));
      
      });

    });

  }

  static getHostSettings(currentHost = window.location.hostname) {

    /**
     * TODO: !IMPORTANT! Get custom dev state from hosts
     */

    const hostDevState = hosts.find(host => currentHost.includes(host.host));
    const defaultEnabled = hostDevState && hostDevState.support && hostDevState.support === 'full' ? null : false;

    return new Promise((resolve, reject) => {

      let settings;

      chrome.storage.local.get(['hosts'], async (storage) => {

        log('Reading hosts settings from local storage...');

        // console.log(storage.hosts)

        // If there aren't any entries, start with this one
        if (!storage.hosts) {

          log('No hosts found.');
          settings = {
            enabled: defaultEnabled,
            name: currentHost,
          };
    
          await chrome.storage.local.set({ hosts: [settings] }, () => {
            log('Wrote current host settings to local storage:');
            log(JSON.stringify(settings));
            return resolve(settings);
          });

        } else {

          // Look up this host
          settings = storage.hosts.find(hostInStorage => hostInStorage.name === currentHost);

          if (settings) {
            log(settings);
            resolve(settings);
          } else {

            // No settings for this host yet, make an empty entry
            settings = {
              enabled: defaultEnabled,
              name: currentHost,
            };

            storage.hosts.push(settings);
            
            await chrome.storage.local.set({ hosts: storage.hosts }, () => {
              resolve(settings);
            });

          }

        }

        //reject(new Error('Reading host settings from local storage'));
      
      });

    });

  }

  static setHost(mode = 'toggle') {

    const currentHost = window.location.hostname;

    return new Promise((resolve, reject) => {

      chrome.storage.local.get(['hosts'], (storage) => {

        if (storage.hosts) {

          const settings = storage.hosts.find(hostInStorage => hostInStorage.name === currentHost);

          const index =  storage.hosts.indexOf(settings);

          storage.hosts[index].enabled = mode === 'toggle' ? !storage.hosts[index].enabled : mode; 

          chrome.storage.local.set({ hosts: storage.hosts }, () => {

            if (settings) resolve(storage.hosts[index]);

          });

        }
      
      });

    });
  }

  static getHosts() {

    return new Promise((resolve, reject) => {

      chrome.storage.local.get(['hosts'], (storage) => {

        if (storage.hosts) resolve(storage.hosts);

        reject(new Error('Reading host settings from local storage'));
      
      });

    });

  }



  static setEnabled(mode = 'toggle') {

    return new Promise((resolve, reject) => {

      chrome.storage.local.get(['settings'], (storage) => {

        log('Reading current settings from local storage...')

        const { settings } = storage;

        log(JSON.stringify(settings))

        settings.enabled = mode === 'toggle' ? !settings.enabled : mode;

        log('Writing new settings to local storage:')

        log(JSON.stringify(settings))

        chrome.storage.local.set({ settings: settings }, () => {

          if (settings) {
            log('Wrote new settings to local storage:');
            log(JSON.stringify(settings));
            resolve(settings)
          } else {
            reject(new Error('Writing enabled settings to local storage'));
          }

        });

      });

    });

  }

  static setConsent(mode = 'toggle') {

    return new Promise((resolve, reject) => {

      chrome.storage.local.get(['settings'], (storage) => {

        const settings = storage.settings;

        //console.log(settings)

        settings.consent = mode === 'toggle' ? !settings.consent : mode;

        //console.log(settings)

        chrome.storage.local.set({ settings: settings }, () => {

          if (settings) {
            resolve(settings.consent);
          } else {
            reject(new Error('Writing consent settings to local storage'));
          }

        });

      });

    });

  }

  static setToolbar(mode = 'toggle') {

    return new Promise((resolve, reject) => {

      chrome.storage.local.get(['settings'], (storage) => {

        const settings = storage.settings;

        //console.log(settings)

        settings.toolbar = mode === 'toggle' ? !settings.toolbar : mode;

        //console.log(settings)

        chrome.storage.local.set({ settings: settings }, () => {

          if (settings) {
            resolve(settings.toolbar);
          } else {
            reject(new Error('Writing toolbar settings to local storage'));
          }

        });

      });

    });

  }

  static resetAllHosts() {

    return new Promise((resolve, reject) => {

      chrome.storage.local.set({ hosts: [] }, () => {

        resolve(true);

      });

      reject(new Error('No resetting hosts'));

    });

  }

}
