export class PlatformService {
  /**
   * Returns true if running on the server (SSR).
   */
  static isSSR(): boolean {
    return typeof window === 'undefined' || typeof navigator === 'undefined';
  }

  /**
   * Returns true if the device is Android.
   */
  static isAndroid(): boolean {
    if (this.isSSR()) return false;
    return /Android/i.test(navigator.userAgent);
  }

  /**
   * Returns true if the device is iOS.
   */
  static isIOS(): boolean {
    if (this.isSSR()) return false;
    return /iPhone|iPad|iPod/i.test(navigator.userAgent);
  }

  /**
   * Returns true if the device is likely a desktop browser.
   */
  static isDesktop(): boolean {
    return !this.isAndroid() && !this.isIOS();
  }

  /**
   * Checks if Geolocation API is supported in the current environment.
   */
  static isGeolocationSupported(): boolean {
    if (this.isSSR()) return false;
    return 'geolocation' in navigator;
  }

  /**
   * Checks if Permissions API is supported in the current environment.
   */
  static isPermissionsSupported(): boolean {
    if (this.isSSR()) return false;
    return 'permissions' in navigator && typeof navigator.permissions.query === 'function';
  }
}
