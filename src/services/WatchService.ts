import { GeolocationService } from './GeolocationService';
import { GPSLocation, GPSError, GPSOptions } from '../types';

export class WatchService {
  private watchId: number | null = null;
  private isWatching: boolean = false;
  private lastLocation: GPSLocation | null = null;
  private stopTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private options: GPSOptions,
    private onLocation: (loc: GPSLocation) => void,
    private onError: (err: GPSError) => void,
    private onStop?: () => void
  ) {}

  start(): void {
    if (this.isWatching) {
      return;
    }

    this.isWatching = true;
    this.watchId = GeolocationService.watchPosition(
      (loc) => {
        if (this.shouldUpdateLocation(loc)) {
          this.lastLocation = loc;
          this.onLocation(loc);
        }
      },
      (err) => {
        this.onError(err);
        this.stop(); // auto-stop on error
      },
      this.options
    );

    if (this.options.stopAfterMs && this.options.stopAfterMs > 0) {
      this.stopTimeout = setTimeout(() => {
        this.stop();
        if (this.onStop) this.onStop();
      }, this.options.stopAfterMs);
    }
  }

  stop(): void {
    if (this.watchId !== null) {
      GeolocationService.clearWatch(this.watchId);
      this.watchId = null;
    }
    if (this.stopTimeout !== null) {
      clearTimeout(this.stopTimeout);
      this.stopTimeout = null;
    }
    this.isWatching = false;
  }

  restart(): void {
    this.stop();
    this.start();
  }

  dispose(): void {
    this.stop();
    this.lastLocation = null;
  }

  private shouldUpdateLocation(newLoc: GPSLocation): boolean {
    if (!this.lastLocation || !this.options.distanceFilter) {
      return true;
    }
    const distance = this.calculateDistance(this.lastLocation, newLoc);
    return distance >= this.options.distanceFilter;
  }

  /**
   * Calculates distance between two coords using Haversine formula (returns meters)
   */
  private calculateDistance(loc1: GPSLocation, loc2: GPSLocation): number {
    const R = 6371e3; // Earth's radius in meters
    const rad = Math.PI / 180;
    const lat1 = loc1.latitude * rad;
    const lat2 = loc2.latitude * rad;
    const dLat = (loc2.latitude - loc1.latitude) * rad;
    const dLon = (loc2.longitude - loc1.longitude) * rad;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }
}
