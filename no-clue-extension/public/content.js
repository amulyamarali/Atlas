console.log("contentScript working");
// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   if (message.selectedText) {
//     alert('Selected text: ' + message.selectedText);
//   }
// });
alert("Hello There");

// for sending msg to background
chrome.runtime.sendMessage("Hello from content", (res) => {
  console.log(res);
});

// document.addEventListener("mouseup", () => {
//   const selectedText = window.getSelection().toString().trim();
//   if (selectedText) {
//     chrome.runtime.sendMessage(
//       JSON.stringify({ action: "setSelectedText", text: selectedText }),
//       (res) => {
//         alert("worked -->", res);
//       }
//     );
//   }
// });
