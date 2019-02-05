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
          reject(new Error('Reading settings from local storage'));
        }
      
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

        settings = storage.hosts.find(hostInStorage => hostInStorage.name === currentHost);

        if (settings) resolve(settings);

        reject(new Error('Reading host settings from local storage'));
      
      });

    });

  }

  static setHost(mode = 'toggle') {

    const currentHost = window.location.hostname;

    return new Promise((resolve, reject) => {

      chrome.storage.local.get(['hosts'], (storage) => {

        if (storage.hosts) {

        //console.log(storage.hosts);

        const settings = storage.hosts.find(hostInStorage => hostInStorage.name === currentHost);

        //console.log(settings);

        const index =  storage.hosts.indexOf(settings);

        //console.log(index);

        storage.hosts[index].enabled = !storage.hosts[index].enabled; 

        //console.log(storage.hosts);

        chrome.storage.local.set({ hosts: storage.hosts }, () => {

          if (settings) resolve(storage.hosts[index]);

        //reject(new Error('Reading host settings from local storage'));

        })

       /*  const settings = storage.hosts.find(hostInStorage => hostInStorage.name === currentHost);
        
        const index = hosts.indexOf(settings);

        console.log(hosts[index]);

        hosts[index].enabled = !hosts[index].enabled;

        console.log(hosts[index])

        console.log(hosts); */

        }
        
        //console.log(hosts[hosts.indexOf(settings)])
/* 
        hosts[hosts.indexOf(settings)].enabled = !settings.enabled;

        console.log(hosts[hosts.indexOf(settings)])

        console.log(hosts); */
        //console.log(hosts)

        /* // Write the invert
        chrome.storage.local.set({ hosts: hosts }, () => {

          if (settings) resolve(settings);

        reject(new Error('Reading host settings from local storage'));

        }) */
      
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
