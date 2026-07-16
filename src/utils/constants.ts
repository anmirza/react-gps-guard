export const DEFAULT_TIMEOUT = 10000;
export const DEFAULT_RETRY_INTERVAL = 3000;

export const ERROR_MESSAGES = {
  PERMISSION_DENIED: 'Location permission denied.',
  POSITION_UNAVAILABLE: 'GPS is turned off. Please enable Location Services on your device.',
  TIMEOUT: 'Unable to determine your location within the time limit.',
  UNSUPPORTED: 'Geolocation is not supported by this browser.',
  UNKNOWN: 'Unable to access your location.',
};

export const PERMISSION_STATES = {
  PROMPT: 'prompt' as const,
  GRANTED: 'granted' as const,
  DENIED: 'denied' as const,
  UNSUPPORTED: 'unsupported' as const,
};

export const STATUS_STATES = {
  IDLE: 'idle' as const,
  CHECKING: 'checking' as const,
  PRIMING: 'priming' as const,
  WATCHING: 'watching' as const,
  ERROR: 'error' as const,
};
