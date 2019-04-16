chrome.runtime.onInstalled.addListener(function (object) {

  chrome.tabs.create({url: "http://fairlanguage.com/"}, function (tab) {
      console.log("New tab launched with http://yoursite.com/");
  });

  chrome.tabs.query({status:'complete'}, (tabs)=>{
    tabs.forEach((tab)=>{
        if(tab.url){
            chrome.tabs.update(tab.id,{url: tab.url});
         }
        });
    });

});