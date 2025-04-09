import { default_settings } from "./constants";

export async function get_settings() {
  return Object.assign(
    default_settings,
    (await chrome.storage.local.get("settings")).settings
  );
}

export async function set_setting(property, value) {
  const current_settings = await get_settings();
  const new_settings = Object.assign(current_settings, { [property]: value });
  await chrome.storage.local.set({ settings: new_settings });
  return;
}
