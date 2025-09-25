export const APP_NAME = 'PointRally';
export const APP_TAGLINE = 'One balance. All teams. Endless rewards.';
export const APP_DESCRIPTION = 'Unify your sports loyalty points across all your favorite teams';

export const AUTH = {
  SESSION_DURATION: 3600000,
  REFRESH_THRESHOLD: 300000,
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 900000,
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/
} as const;

export const POINTS = {
  TIERS: {
    BRONZE: { min: 0, max: 999, multiplier: 1 },
    SILVER: { min: 1000, max: 4999, multiplier: 1.1 },
    GOLD: { min: 5000, max: 9999, multiplier: 1.25 },
    PLATINUM: { min: 10000, max: Infinity, multiplier: 1.5 }
  },
  CONVERSION_RATES: {
    DEFAULT: 1,
    CROSS_SPORT: 0.9,
    PROMOTIONAL: 1.2
  },
  EXPIRATION_DAYS: 365
} as const;

export const TEAMS = {
  CATEGORIES: {
    NBA: 'National Basketball Association',
    NFL: 'National Football League',
    MLB: 'Major League Baseball',
    NHL: 'National Hockey League',
    MLS: 'Major League Soccer'
  },
  MAX_CONNECTIONS: 10,
  SYNC_INTERVAL: 3600000
} as const;

export const API = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'https://api.pointrally.com',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000
} as const;

export const UI = {
  ANIMATION_DURATION: 200,
  DEBOUNCE_DELAY: 300,
  PAGE_SIZE: 20,
  MAX_FILE_SIZE: 5242880,
  ACCEPTED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  BREAKPOINTS: {
    SM: 640,
    MD: 768,
    LG: 1024,
    XL: 1280,
    '2XL': 1536
  }
} as const;

export const ROUTES = {
  HOME: '/',
  LOGIN: '/auth/login',
  SIGNUP: '/auth/signup',
  DASHBOARD: '/dashboard',
  TEAMS: '/teams',
  REWARDS: '/rewards',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  ONBOARDING: '/onboarding'
} as const;

export const MESSAGES = {
  SUCCESS: {
    LOGIN: 'Welcome back!',
    SIGNUP: 'Account created successfully!',
    LOGOUT: 'You have been logged out',
    TEAM_CONNECTED: 'Team connected successfully',
    POINTS_REDEEMED: 'Points redeemed successfully',
    PROFILE_UPDATED: 'Profile updated successfully'
  },
  ERROR: {
    GENERIC: 'Something went wrong. Please try again.',
    NETWORK: 'Network error. Please check your connection.',
    UNAUTHORIZED: 'You are not authorized to perform this action',
    NOT_FOUND: 'The requested resource was not found',
    VALIDATION: 'Please check your input and try again',
    SESSION_EXPIRED: 'Your session has expired. Please login again.'
  },
  INFO: {
    LOADING: 'Loading...',
    NO_DATA: 'No data available',
    EMPTY_LIST: 'No items to display',
    COMING_SOON: 'This feature is coming soon!'
  }
} as const;

export const SOCIAL_LINKS = {
  TWITTER: 'https://twitter.com/pointrally',
  FACEBOOK: 'https://facebook.com/pointrally',
  INSTAGRAM: 'https://instagram.com/pointrally',
  LINKEDIN: 'https://linkedin.com/company/pointrally'
} as const;