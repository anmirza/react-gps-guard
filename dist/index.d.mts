import React, { ReactNode } from 'react';

type GPSLocation = {
    latitude: number;
    longitude: number;
    accuracy?: number;
    altitude?: number | null;
    altitudeAccuracy?: number | null;
    heading?: number | null;
    speed?: number | null;
    timestamp?: number;
};
type GPSOptions = {
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
type GPSPermissionState = 'prompt' | 'granted' | 'denied' | 'unsupported';
type GPSStatus = 'idle' | 'checking' | 'priming' | 'watching' | 'error';
type GPSError = {
    code: 'PERMISSION_DENIED' | 'POSITION_UNAVAILABLE' | 'TIMEOUT' | 'UNSUPPORTED' | 'UNKNOWN';
    message: string;
};
type GPSCallbacks = {
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

interface UseGPSGuardProps extends GPSOptions, GPSCallbacks {
}
interface UseGPSGuardReturn {
    status: GPSStatus;
    permission: GPSPermissionState;
    location: GPSLocation | null;
    error: GPSError | null;
    loading: boolean;
    retry: () => void;
    decline: () => void;
    requestPermission: () => void;
    startWatching: () => void;
    stopWatching: () => void;
}
declare function useGPSGuard(props?: UseGPSGuardProps): UseGPSGuardReturn;

interface GPSGuardProps extends UseGPSGuardProps {
    children: ReactNode;
    /** Component to render while loading/checking permissions */
    loadingComponent?: ReactNode;
    /** Component to render to ask for permission before triggering browser prompt */
    permissionComponent?: ReactNode;
    /** Component to render on error (denied or gps disabled) */
    errorComponent?: ReactNode;
    /** Render prop for loading state */
    renderLoading?: () => ReactNode;
    /** Render prop for primer state */
    renderPermission?: (requestPermission: () => void, decline: () => void) => ReactNode;
    /** Render prop for error state */
    renderError?: (error: any, retry: () => void) => ReactNode;
}
declare const GPSGuard: React.FC<GPSGuardProps>;

declare const DefaultLoading: React.FC;

interface DefaultPrimerProps {
    onAllow: () => void;
    onDeny: () => void;
}
declare const DefaultPrimer: React.FC<DefaultPrimerProps>;

interface DefaultErrorProps {
    error: GPSError | null;
    permission: GPSPermissionState;
    showInstructions: boolean;
    onRetry: () => void;
}
declare const DefaultError: React.FC<DefaultErrorProps>;

interface GPSProviderProps extends UseGPSGuardProps {
    children: ReactNode;
}
declare const GPSProvider: React.FC<GPSProviderProps>;
declare const useGPS: () => UseGPSGuardReturn;

declare class GeolocationService {
    /**
     * Wraps getCurrentPosition in a Promise.
     */
    static getCurrentPosition(options?: GPSOptions): Promise<GPSLocation>;
    /**
     * Starts watching position.
     */
    static watchPosition(onSuccess: (loc: GPSLocation) => void, onError: (err: GPSError) => void, options?: GPSOptions): number;
    /**
     * Clears a watch.
     */
    static clearWatch(watchId: number): void;
    /**
     * Maps a GeolocationPosition to our GPSLocation type.
     */
    private static mapPositionToLocation;
    /**
     * Maps a GeolocationPositionError to our GPSError type.
     */
    private static mapPositionError;
}

declare class PermissionService {
    /**
     * Checks the current geolocation permission state without triggering a prompt.
     * Resolves to the permission state (prompt, granted, denied, or unsupported).
     */
    static checkPermission(): Promise<GPSPermissionState>;
    /**
     * Attaches a listener to geolocation permission changes.
     * Returns a cleanup function to remove the listener.
     */
    static listenPermissionChanges(onChange: (state: GPSPermissionState) => void): () => void;
}

declare class PlatformService {
    /**
     * Returns true if running on the server (SSR).
     */
    static isSSR(): boolean;
    /**
     * Returns true if the device is Android.
     */
    static isAndroid(): boolean;
    /**
     * Returns true if the device is iOS.
     */
    static isIOS(): boolean;
    /**
     * Returns true if the device is likely a desktop browser.
     */
    static isDesktop(): boolean;
    /**
     * Checks if Geolocation API is supported in the current environment.
     */
    static isGeolocationSupported(): boolean;
    /**
     * Checks if Permissions API is supported in the current environment.
     */
    static isPermissionsSupported(): boolean;
}

declare class WatchService {
    private options;
    private onLocation;
    private onError;
    private onStop?;
    private watchId;
    private isWatching;
    private lastLocation;
    private stopTimeout;
    constructor(options: GPSOptions, onLocation: (loc: GPSLocation) => void, onError: (err: GPSError) => void, onStop?: (() => void) | undefined);
    start(): void;
    stop(): void;
    restart(): void;
    dispose(): void;
    private shouldUpdateLocation;
    /**
     * Calculates distance between two coords using Haversine formula (returns meters)
     */
    private calculateDistance;
}

declare const ERROR_MESSAGES: {
    PERMISSION_DENIED: string;
    POSITION_UNAVAILABLE: string;
    TIMEOUT: string;
    UNSUPPORTED: string;
    UNKNOWN: string;
};
declare const PERMISSION_STATES: {
    PROMPT: "prompt";
    GRANTED: "granted";
    DENIED: "denied";
    UNSUPPORTED: "unsupported";
};
declare const STATUS_STATES: {
    IDLE: "idle";
    CHECKING: "checking";
    PRIMING: "priming";
    WATCHING: "watching";
    ERROR: "error";
};

export { DefaultError, type DefaultErrorProps, DefaultLoading, DefaultPrimer, type DefaultPrimerProps, ERROR_MESSAGES, type GPSCallbacks, type GPSError, GPSGuard, type GPSGuardProps, type GPSLocation, type GPSOptions, type GPSPermissionState, GPSProvider, type GPSProviderProps, type GPSStatus, GeolocationService, PERMISSION_STATES, PermissionService, PlatformService, STATUS_STATES, type UseGPSGuardProps, type UseGPSGuardReturn, WatchService, useGPS, useGPSGuard };
