export type GPSLocation = {
  latitude: number;
  longitude: number;
  accuracy?: number;
  altitude?: number | null;
  altitudeAccuracy?: number | null;
  heading?: number | null;
  speed?: number | null;
  timestamp?: number;
};

export type GPSOptions = {
  /** Enables high accuracy geolocation (GPS). Defaults to true. */
  enableHighAccuracy?: boolean;
  /** Maximum time in milliseconds allowed to retrieve location. Defaults to 10000 (10s). */
  timeout?: number;
  /** Maximum age of a cached location in milliseconds. Defaults to 0 (always ask for fresh). */
  maximumAge?: number;
  /** Only fire location updates if moved by this many meters. */
  distanceFilter?: number;
  /** Automatically retry on certain errors. Defaults to false. */
  autoRetry?: boolean;
  /** Milliseconds to wait before auto-retrying. Defaults to 3000. */
  retryInterval?: number;
  /** Show primer component before asking for native permission. Defaults to true. */
  enablePrimer?: boolean;
  /** Enable debug logging. Defaults to false. */
  debug?: boolean;
  /** Show instructions on how to enable GPS/Permissions on error screens. Defaults to true. */
  showInstructions?: boolean;
  /** Optional time in milliseconds to automatically stop watching location after starting. */
  stopAfterMs?: number;
};

export type GPSPermissionState = 'prompt' | 'granted' | 'denied' | 'unsupported';

export type GPSStatus = 'idle' | 'checking' | 'priming' | 'watching' | 'error';

export type GPSError = {
  code: 'PERMISSION_DENIED' | 'POSITION_UNAVAILABLE' | 'TIMEOUT' | 'UNSUPPORTED' | 'UNKNOWN';
  message: string;
};

export type GPSCallbacks = {
  /** Called when the package is ready and initialized. */
  onReady?: () => void;
  /** Called when a new location is retrieved. */
  onLocation?: (location: GPSLocation) => void;
  /** Called when the user grants permission. */
  onPermissionGranted?: () => void;
  /** Called when the user denies permission. */
  onPermissionDenied?: () => void;
  /** Called when the browser prompts for permission. */
  onPermissionPrompt?: () => void;
  /** Called when GPS is disabled (position unavailable). */
  onGPSDisabled?: () => void;
  /** Called when a retry attempt is made. */
  onRetry?: () => void;
  /** Called when watch tracking starts. */
  onStartWatching?: () => void;
  /** Called when watch tracking stops. */
  onStopWatching?: () => void;
  /** Called when any error occurs. */
  onError?: (error: GPSError) => void;
};
