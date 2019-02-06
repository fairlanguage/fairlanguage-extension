export default class StorageController {

  constructor() {
    return 'I controll the storage.';
  }

  static getSettings() {

    return new Promise((resolve, reject) => {

      chrome.storage.local.get(['settings'], (storage) => {

        if (storage.settings) {
          resolve(storage.settings);
        } else {
          const settings = {
            enabled: true,
            consent: false,
            toolbar: false,
          };
    
          chrome.storage.local.set({ settings }, () => {
            resolve(settings);
          });
        }

        reject(new Error('Reading settings from local storage'));
      
      });

    });

  }

  static setEnabled(mode = 'toggle') {

    return new Promise((resolve, reject) => {

      chrome.storage.local.get(['settings'], (storage) => {

        const settings = storage.settings;

        //console.log(settings)

        settings.enabled = mode === 'toggle' ? !settings.enabled : mode;

        //console.log(settings)

        chrome.storage.local.set({ settings: settings }, () => {

          if (settings) {
            resolve(settings.consent);
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

  static getHostSettings(currentHost = window.location.hostname) {

    return new Promise((resolve, reject) => {

      let settings;

      chrome.storage.local.get(['hosts'], (storage) => {

        // If there aren't any entries, start with this one
        if (!storage.hosts) {
          settings = {
            enabled: null,
            name: currentHost,
          };
    
          chrome.storage.local.set({ hosts: [settings] }, () => {
            resolve(settings);
          });
        }

        // Look up this host
        settings = storage.hosts.find(hostInStorage => hostInStorage.name === currentHost);

        if (settings) {
          resolve(settings);
        } else {

          // No settings for this host yet, make an empty entry
          settings = {
            enabled: null,
            name: currentHost,
          };

          storage.hosts.push(settings);
          
          chrome.storage.local.set({ hosts: storage.hosts }, () => {
            resolve(settings);
          });

        }

        settings = {
          enabled: null,
          name: currentHost,
        };

        chrome.storage.local.set({ hosts: [settings] }, () => {
          resolve(settings);
        });

        reject(new Error('Reading host settings from local storage'));
      
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

  static resetAllHosts() {

    return new Promise((resolve, reject) => {

      chrome.storage.local.set({ hosts: [] }, () => {

        resolve(true);

      });

      reject(new Error('No resetting hosts'));

    });

  }

}
