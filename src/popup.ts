import { get_settings, set_setting } from "./lib/storage";
import { ensure_fonts_imported } from "./lib/fonts";

// elements
const settings_inputs = document.querySelectorAll(
  "[data-type=setting-input]"
) as NodeListOf<HTMLInputElement>;
const themeToggleButton = document.getElementById('theme-toggle');
const loadingOverlay = document.getElementById('loading-overlay');

// Theme handling
function setTheme(isDark: boolean) {
  if (isDark) {
    document.documentElement.classList.add('dark-theme');
    document.documentElement.classList.remove('light-theme');
    localStorage.setItem('baheth-theme', 'dark');
  } else {
    document.documentElement.classList.add('light-theme');
    document.documentElement.classList.remove('dark-theme');
    localStorage.setItem('baheth-theme', 'light');
  }
}

function getPreferredTheme(): boolean {
  const savedTheme = localStorage.getItem('baheth-theme');
  if (savedTheme === 'dark') return true;
  if (savedTheme === 'light') return false;
  
  // Check system preference
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

// Loading state
function showLoading() {
  if (loadingOverlay) {
    loadingOverlay.classList.add('active');
  }
}

function hideLoading() {
  if (loadingOverlay) {
    loadingOverlay.classList.remove('active');
  }
}

// handlers
async function handle_setting_change(event) {
  const property = event.target.dataset.property;
  const value =
    event.target.type === "checkbox"
      ? event.target.checked
      : event.target.value;

  showLoading();
  await set_setting(property, value);
  hideLoading();
}

// Add micro-interaction classes
function addFadeInClass() {
  const elements = document.querySelectorAll('.options-list, .welcome-message, .footer');
  elements.forEach((el, index) => {
    setTimeout(() => {
      el.classList.add('fade-in');
    }, index * 100);
  });
}

// Ensure auto_check is always enabled
async function ensureAutoCheckEnabled() {
  const settings = await get_settings();
  if (settings.auto_check === false || settings.auto_check === undefined) {
    await set_setting('auto_check', true);
  }
}

// initialization
(async () => {
  // load fonts
  ensure_fonts_imported();

  // Initialize theme
  const isDarkTheme = getPreferredTheme();
  setTheme(isDarkTheme);

  // get saved settings
  showLoading();
  const settings = await get_settings();
  
  // Make sure auto_check is always enabled since we removed the UI toggle
  await ensureAutoCheckEnabled();
  
  hideLoading();

  // Add animation classes
  addFadeInClass();

  settings_inputs.forEach((element) => {
    // set initial values
    const property = element.dataset.property;
    if (!property) return;

    const value = settings[property];

    if (element.type === "checkbox") {
      element.checked = value;
    } else {
      element.value = value;
    }

    // event listener
    element.addEventListener("change", handle_setting_change);
  });

  // Theme toggle event listener
  if (themeToggleButton) {
    themeToggleButton.addEventListener('click', () => {
      const isDark = document.documentElement.classList.contains('dark-theme');
      setTheme(!isDark);
    });
  }
})();
