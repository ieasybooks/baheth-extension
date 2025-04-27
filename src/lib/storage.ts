import { default_settings } from "./constants";

export async function get_settings() {
  try {
    // Get settings from storage
    const result = await chrome.storage.sync.get("settings");
    
    // If settings don't exist, return defaults
    if (!result.settings) {
      return default_settings;
    }
    
    // Merge with defaults to ensure any new settings are included
    return { ...default_settings, ...result.settings };
  } catch (error) {
    console.error("Error retrieving settings:", error);
    // Return defaults if there's an error
    return default_settings;
  }
}

export async function set_setting(property: string, value: any) {
  try {
    // Get current settings
    const settings = await get_settings();
    
    // Update the property
    settings[property] = value;
    
    // Save back to storage
    await chrome.storage.sync.set({ settings });
    
    return true;
  } catch (error) {
    console.error(`Error saving setting ${property}:`, error);
    return false;
  }
}
