import { GPSLocation, GPSError, GPSOptions } from '../types';
import { ERROR_MESSAGES } from '../utils/constants';

export class GeolocationService {
  /**
   * Wraps getCurrentPosition in a Promise.
   */
  static getCurrentPosition(options?: GPSOptions): Promise<GPSLocation> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject({
          code: 'UNSUPPORTED',
          message: ERROR_MESSAGES.UNSUPPORTED,
        } as GPSError);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve(this.mapPositionToLocation(position));
        },
        (error) => {
          reject(this.mapPositionError(error));
        },
        {
          enableHighAccuracy: options?.enableHighAccuracy ?? true,
          timeout: options?.timeout ?? 10000,
          maximumAge: options?.maximumAge ?? 0,
        }
      );
    });
  }

  /**
   * Starts watching position.
   */
  static watchPosition(
    onSuccess: (loc: GPSLocation) => void,
    onError: (err: GPSError) => void,
    options?: GPSOptions
  ): number {
    if (!navigator.geolocation) {
      onError({ code: 'UNSUPPORTED', message: ERROR_MESSAGES.UNSUPPORTED });
      return 0;
    }

    return navigator.geolocation.watchPosition(
      (position) => onSuccess(this.mapPositionToLocation(position)),
      (error) => onError(this.mapPositionError(error)),
      {
        enableHighAccuracy: options?.enableHighAccuracy ?? true,
        timeout: options?.timeout ?? 10000,
        maximumAge: options?.maximumAge ?? 0,
      }
    );
  }

  /**
   * Clears a watch.
   */
  static clearWatch(watchId: number): void {
    if (navigator.geolocation && watchId) {
      navigator.geolocation.clearWatch(watchId);
    }
  }

  /**
   * Maps a GeolocationPosition to our GPSLocation type.
   */
  private static mapPositionToLocation(position: GeolocationPosition): GPSLocation {
    return {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy,
      altitude: position.coords.altitude,
      altitudeAccuracy: position.coords.altitudeAccuracy,
      heading: position.coords.heading,
      speed: position.coords.speed,
      timestamp: position.timestamp,
    };
  }

  /**
   * Maps a GeolocationPositionError to our GPSError type.
   */
  private static mapPositionError(error: GeolocationPositionError): GPSError {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        return { code: 'PERMISSION_DENIED', message: ERROR_MESSAGES.PERMISSION_DENIED };
      case error.POSITION_UNAVAILABLE:
        return { code: 'POSITION_UNAVAILABLE', message: ERROR_MESSAGES.POSITION_UNAVAILABLE };
      case error.TIMEOUT:
        return { code: 'TIMEOUT', message: ERROR_MESSAGES.TIMEOUT };
      default:
        return { code: 'UNKNOWN', message: ERROR_MESSAGES.UNKNOWN };
    }
  }
}
