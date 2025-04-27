// Listen for keyboard command
chrome.commands.onCommand.addListener(async (command) => {
  // Only handle the check_video command (Alt+Shift+B by default)
  if (command === "check_video") {
    // Get the active tab
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    const activeTab = tabs[0];
    
    // Check if the tab is on our supported platform (YouTube)
    const supportedPlatforms = [
      "youtube.com"
    ];
    
    const url = new URL(activeTab.url || "");
    const isSupported = supportedPlatforms.some(platform => url.hostname.includes(platform));
    
    if (isSupported) {
      // Send a message to the content script to check for the video
      chrome.tabs.sendMessage(activeTab.id as number, { action: "check_video" });
    }
  }
}); 