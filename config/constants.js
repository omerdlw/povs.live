// API related constants
export const API_ENDPOINTS = {
  KICK: {
    CHANNEL: (username) => `https://kick.com/api/v2/channels/${username}`,
    VIDEOS: (username) => `https://kick.com/api/v2/channels/${username}/videos`,
  },
};

// Theme related constants
export const THEMES = {
  SYSTEM: "system",
  LIGHT: "light",
  DARK: "dark",
};

export const VALID_THEMES = Object.values(THEMES);

// Storage related constants
export const STORAGE_KEYS = {
  SETTINGS: "SETTINGS",
  THEME: "THEME",
};

// Navigation related constants
export const NAVIGATION_LINKS = [
  {
    icon: "solar:home-angle-2-bold",
    description: "about me & stuff",
    name: "home",
    href: "/",
  },
];

export const NAV_ANIMATION_CONFIG = {
  expanded: {
    offsetY: -85,
    scale: 1,
  },
  collapsed: {
    offsetY: -10,
    scale: 0.9,
  },
  transition: {
    stiffness: 150,
    mass: 0.8,
    damping: 20,
    restDelta: 0.1,
  },
  BASE_CARD_HEIGHT: 75,
  ACTION_GAP: 10,
};

// UI/Layout related constants
export const Z_INDEX = {
  MODAL_BACKDROP: 40,
  BACKGROUND: -20,
  DROPDOWN: 10,
  TOOLTIP: 60,
  MODAL: 50,
};

// Error handling constants
export const ERROR_MESSAGES = {
  GENERIC: "An unexpected error occurred. Please try again",
  NETWORK: "Network error. Please check your connection",
  NOT_FOUND: "The requested resource was not found",
  UNAUTHORIZED: "You are not authorized to perform this action",
  VALIDATION: "Please check your input and try again",
  SERVER: "A server error occurred. Please try again later",
};

// Validation patterns
export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  SLUG: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  URL: /^https?:\/\/.+/,
};
