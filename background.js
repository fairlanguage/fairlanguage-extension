chrome.runtime.onInstalled.addListener(() => {

  chrome.tabs.create({ url: 'https://fairlanguage.com/impressum/' }, () => {
    //
  });

  chrome.tabs.query({ status: 'complete' }, (tabs) => {
    tabs.forEach((tab) => {
      if (tab.url) {
        chrome.tabs.update(tab.id, { url: tab.url });
      }
    });
  });

});
