console.log("bgScript working");
//whenever a tab is focused (use onUpdated for creation as well)
chrome.tabs.onActivated.addListener((tab) => {
  let currTab = tab.tabId;
  if (currTab.url != "chrome://newtab/") {
    chrome.scripting.executeScript({
      target: { tabId: currTab },
      files: ["content.js"],
    });
                                                  
    //injecting scripts have a small delay so just in case sleep for 2 sec
    // setTimeout(()=>{
    //   chrome.tabs.sendMessage(
    //     currTab,
    //     'Hello & welcome to background',
    //     (res)=>{
    //       console.log(res);
    //     }
    //   )
    // }, 2000);
  }
});

// for reciveing the msg from content & responding
chrome.runtime.onMessage.addListener((msg, sender, sendRes) => {
  console.log(sender, "says :", msg);
  sendRes("Hello from background");
});

// chrome.runtime.onMessage.addListener((msg, sender, sendRes)=>{
//   console.log(`Recieved from ${sender} -->`, JSON.parse(msg)),
//   sendRes("'got'");
// })
