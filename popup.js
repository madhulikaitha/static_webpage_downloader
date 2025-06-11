document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('captureButton');
    if (!btn) {
      console.error('Button with ID "captureButton" not found.');
      return;
    }
  
    btn.addEventListener('click', () => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length === 0) {
          console.error("No active tab found.");
          return;
        }
  
        const tab = tabs[0];
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: capturePage
        });
      });
    });
  });
  
  // Function to inject into the page
  function capturePage() {
    const htmlContent = "<!DOCTYPE html>\n" + document.documentElement.outerHTML;
    chrome.runtime.sendMessage({
      action: "saveStaticPage",
      html: htmlContent
    });
  }
  
  // Listen for message from the page to download the HTML
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "saveStaticPage" && message.html) {
      const blob = new Blob([message.html], { type: "text/html" });
      const url = URL.createObjectURL(blob);
  
      chrome.downloads.download({
        url: url,
        filename: "snapshot.html",
        saveAs: true
      });
    }
  });