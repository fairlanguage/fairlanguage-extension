chrome.runtime.onInstalled.addListener(() => {

  // Open remote host
  chrome.tabs.create({ url: 'https://fairlanguage.com/impressum/' }, () => {
    //
  });

  // Open local file
/*   chrome.tabs.create({url:chrome.extension.getURL("src/terms/www/index.html")}, function (tab) { 
    console.log("Opened local terms"); 
  }); */

  chrome.tabs.query({ status: 'complete' }, (tabs) => {
    tabs.forEach((tab) => {
      if (tab.url) {
        chrome.tabs.update(tab.id, { url: tab.url });
      }
    });
  });

});
