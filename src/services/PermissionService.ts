import { PlatformService } from './PlatformService';
import { PERMISSION_STATES } from '../utils/constants';
import type { GPSPermissionState as GPSPermissionStateType } from '../types';

export class PermissionService {
  /**
   * Checks the current geolocation permission state without triggering a prompt.
   * Resolves to the permission state (prompt, granted, denied, or unsupported).
   */
  static async checkPermission(): Promise<GPSPermissionStateType> {
    if (!PlatformService.isGeolocationSupported()) {
      return PERMISSION_STATES.UNSUPPORTED;
    }

    if (!PlatformService.isPermissionsSupported()) {
      // If Permissions API is not supported (e.g., some older Safari versions),
      // we default to 'prompt' so that the consumer knows to try asking.
      return PERMISSION_STATES.PROMPT;
    }

    try {
      const permission = await navigator.permissions.query({ name: 'geolocation' });
      return permission.state as GPSPermissionStateType;
    } catch (e) {
      // Fallback if query fails
      return PERMISSION_STATES.PROMPT;
    }
  }

  /**
   * Attaches a listener to geolocation permission changes.
   * Returns a cleanup function to remove the listener.
   */
  static listenPermissionChanges(onChange: (state: GPSPermissionStateType) => void): () => void {
    if (!PlatformService.isPermissionsSupported()) {
      return () => {};
    }

    let permissionStatus: PermissionStatus | null = null;

    navigator.permissions.query({ name: 'geolocation' }).then((status) => {
      permissionStatus = status;
      status.onchange = () => {
        onChange(status.state as GPSPermissionStateType);
      };
    }).catch(() => {
      // Ignore errors silently
    });

    return () => {
      if (permissionStatus) {
        permissionStatus.onchange = null;
      }
    };
  }
}
