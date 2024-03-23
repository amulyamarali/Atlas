console.log("bgScript working");
//whenever a tab is focused (use onUpdated for creation as well)
chrome.tabs.onActivated.addListener((tab) => {
  let currTab = tab.tabId;
  if (currTab.url != "chrome://newtab/") {
    chrome.scripting.executeScript({
      target: { tabId: currTab },
      files: ["content.js"],
    });
  }
});

// for reciveing the msg from content & responding
chrome.runtime.onMessage.addListener((msg, sender, sendRes) => {
  console.log(sender, "says :", msg);
  sendRes("Hello from background");
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "getCurrentTabUrl") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];
      const currentUrl = currentTab.url;
      sendResponse({ url: currentUrl });
    });
    return true; // To indicate that sendResponse will be called asynchronously
  }
});
