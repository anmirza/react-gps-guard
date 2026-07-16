import { useState, useEffect, useCallback, useRef } from 'react';
import { GPSLocation, GPSStatus, GPSPermissionState, GPSError, GPSOptions, GPSCallbacks } from '../types';
import { PERMISSION_STATES, STATUS_STATES, ERROR_MESSAGES } from '../utils/constants';
import { PlatformService } from '../services/PlatformService';
import { PermissionService } from '../services/PermissionService';
import { GeolocationService } from '../services/GeolocationService';
import { WatchService } from '../services/WatchService';

export interface UseGPSGuardProps extends GPSOptions, GPSCallbacks {}

export interface UseGPSGuardReturn {
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

export function useGPSGuard(props: UseGPSGuardProps = {}): UseGPSGuardReturn {
  const {
    enableHighAccuracy = true,
    timeout = 10000,
    maximumAge = 0,
    distanceFilter,
    autoRetry = false,
    retryInterval = 3000,
    enablePrimer = true,
    stopAfterMs,
  } = props;

  // Store callbacks in a ref to avoid infinite re-render loops if the user passes inline functions
  const callbacks = useRef<GPSCallbacks>({
    onReady: props.onReady,
    onLocation: props.onLocation,
    onPermissionGranted: props.onPermissionGranted,
    onPermissionDenied: props.onPermissionDenied,
    onPermissionPrompt: props.onPermissionPrompt,
    onGPSDisabled: props.onGPSDisabled,
    onRetry: props.onRetry,
    onStartWatching: props.onStartWatching,
    onStopWatching: props.onStopWatching,
    onError: props.onError,
  });

  // Update callbacks ref on every render
  useEffect(() => {
    callbacks.current = {
      onReady: props.onReady,
      onLocation: props.onLocation,
      onPermissionGranted: props.onPermissionGranted,
      onPermissionDenied: props.onPermissionDenied,
      onPermissionPrompt: props.onPermissionPrompt,
      onGPSDisabled: props.onGPSDisabled,
      onRetry: props.onRetry,
      onStartWatching: props.onStartWatching,
      onStopWatching: props.onStopWatching,
      onError: props.onError,
    };
  });

  const [status, setStatus] = useState<GPSStatus>(STATUS_STATES.IDLE);
  const [permission, setPermission] = useState<GPSPermissionState>(PERMISSION_STATES.PROMPT);
  const [location, setLocation] = useState<GPSLocation | null>(null);
  const [error, setError] = useState<GPSError | null>(null);

  const watchServiceRef = useRef<WatchService | null>(null);
  const isMounted = useRef(false);
  const initialized = useRef(false);

  // Only show loading spinner while actively checking — not when idle (which means uninitialised or declined)
  const loading = status === STATUS_STATES.CHECKING;

  const handleLocationUpdate = useCallback(
    (loc: GPSLocation) => {
      setLocation(loc);
      setStatus(STATUS_STATES.WATCHING);
      setError(null);
      if (callbacks.current.onLocation) callbacks.current.onLocation(loc);
    },
    []
  );

  const handleError = useCallback(
    (err: GPSError) => {
      setError(err);
      setStatus(STATUS_STATES.ERROR);

      if (err.code === 'PERMISSION_DENIED') {
        setPermission(PERMISSION_STATES.DENIED);
        if (callbacks.current.onPermissionDenied) callbacks.current.onPermissionDenied();
      } else if (err.code === 'POSITION_UNAVAILABLE') {
        if (callbacks.current.onGPSDisabled) callbacks.current.onGPSDisabled();
      }

      if (callbacks.current.onError) callbacks.current.onError(err);
    },
    []
  );

  const startWatching = useCallback(() => {
    if (watchServiceRef.current) {
      watchServiceRef.current.dispose();
    }

    watchServiceRef.current = new WatchService(
      { enableHighAccuracy, timeout, maximumAge, distanceFilter, stopAfterMs },
      handleLocationUpdate,
      handleError,
      () => {
        setStatus(STATUS_STATES.IDLE);
        if (callbacks.current.onStopWatching) callbacks.current.onStopWatching();
      }
    );

    watchServiceRef.current.start();
    if (callbacks.current.onStartWatching) callbacks.current.onStartWatching();
  }, [enableHighAccuracy, timeout, maximumAge, distanceFilter, stopAfterMs, handleLocationUpdate, handleError]);

  const stopWatching = useCallback(() => {
    if (watchServiceRef.current) {
      watchServiceRef.current.dispose();
      watchServiceRef.current = null;
    }
    setStatus(STATUS_STATES.IDLE);
    if (callbacks.current.onStopWatching) callbacks.current.onStopWatching();
  }, []);

  /**
   * Called when the user taps "Not now" on the primer screen.
   * Sets an error state so the error/retry screen is shown.
   */
  const decline = useCallback(() => {
    setError({ code: 'PERMISSION_DENIED', message: 'You chose not to share your location.' });
    setStatus(STATUS_STATES.ERROR);
    if (callbacks.current.onPermissionDenied) callbacks.current.onPermissionDenied();
  }, []);

  const requestPermission = useCallback(() => {
    setStatus(STATUS_STATES.CHECKING);
    if (callbacks.current.onPermissionPrompt) callbacks.current.onPermissionPrompt();

    GeolocationService.getCurrentPosition({ enableHighAccuracy, timeout, maximumAge })
      .then((loc) => {
        setPermission(PERMISSION_STATES.GRANTED);
        if (callbacks.current.onPermissionGranted) callbacks.current.onPermissionGranted();
        handleLocationUpdate(loc);
        startWatching();
      })
      .catch((err) => {
        handleError(err);
      });
  }, [enableHighAccuracy, timeout, maximumAge, handleLocationUpdate, handleError, startWatching]);

  const initialize = useCallback(async () => {
    if (PlatformService.isSSR()) return;

    setStatus(STATUS_STATES.CHECKING);
    
    const permState = await PermissionService.checkPermission();
    setPermission(permState);

    if (permState === PERMISSION_STATES.GRANTED) {
      startWatching();
      if (callbacks.current.onReady) callbacks.current.onReady();
      return;
    }

    if (permState === PERMISSION_STATES.DENIED) {
      handleError({ code: 'PERMISSION_DENIED', message: ERROR_MESSAGES.PERMISSION_DENIED });
      if (callbacks.current.onReady) callbacks.current.onReady();
      return;
    }

    if (permState === PERMISSION_STATES.UNSUPPORTED) {
      handleError({ code: 'UNSUPPORTED', message: ERROR_MESSAGES.UNSUPPORTED });
      if (callbacks.current.onReady) callbacks.current.onReady();
      return;
    }

    if (enablePrimer) {
      setStatus(STATUS_STATES.PRIMING);
    } else {
      requestPermission();
    }

    if (callbacks.current.onReady) callbacks.current.onReady();
  }, [enablePrimer, requestPermission, startWatching, handleError]);

  const retry = useCallback(() => {
    if (callbacks.current.onRetry) callbacks.current.onRetry();
    initialize();
  }, [initialize]);

  useEffect(() => {
    isMounted.current = true;
    
    // Only initialize once on mount
    if (!initialized.current) {
      initialized.current = true;
      initialize();
    }

    const cleanupListener = PermissionService.listenPermissionChanges((newState) => {
      if (isMounted.current) {
        setPermission(newState);
        if (newState === PERMISSION_STATES.DENIED) {
          stopWatching();
          handleError({ code: 'PERMISSION_DENIED', message: ERROR_MESSAGES.PERMISSION_DENIED });
        } else if (newState === PERMISSION_STATES.GRANTED) {
          // startWatching is safe to call multiple times as it checks if already watching internally
          startWatching();
        }
      }
    });

    return () => {
      isMounted.current = false;
      cleanupListener();
      stopWatching();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty array ensures we only bind the listener and initialize ONCE on mount

  return {
    status,
    permission,
    location,
    error,
    loading,
    retry,
    decline,
    requestPermission,
    startWatching,
    stopWatching,
  };
}
