console.log('concept')

//Highlighting
document.addEventListener("mouseup", () => {
  const selectedText = window.getSelection().toString().trim();
  if (selectedText) {
    const span = document.createElement("span");
    span.classList.add("highlighted-text"); // Add a specific class
    span.style.backgroundColor = "yellow";
    const range = window.getSelection().getRangeAt(0);
    range.surroundContents(span);
    
    chrome.runtime.sendMessage(
      { action: "setSelectedText", text: selectedText },
      (res) => {
        console.log("Response from background script:", res);
      }
    );
  }
});

// Unhighlight text when clicked
document.addEventListener("click", (event) => {
  const clickedElement = event.target;
  if (clickedElement.classList.contains("highlighted-text") ||
      clickedElement.parentElement.classList.contains("highlighted-text")) { // Check for the specific class in parent element
    const parentElement = clickedElement.closest('.highlighted-text');
    const textNode = document.createTextNode(parentElement.textContent);
    parentElement.parentElement.replaceChild(textNode, parentElement);
    // Send message to remove highlighted text from storage if necessary
  }
});