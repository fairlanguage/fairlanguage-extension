export default class StorageController {

  constructor() {
    return 'I controll the storage.';
  }

  static getHostSettings(currentHost = window.location.hostname) {

    return new Promise((resolve, reject) => {

      let settings;

      chrome.storage.local.get(['hosts'], (storage) => {

        settings = storage.hosts.find(hostInStorage => hostInStorage.name === currentHost);

        if (settings) {
          resolve(settings);
        }

        reject(new Error('No custom host settings'));
      
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
