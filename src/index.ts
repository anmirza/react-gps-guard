// Types
export * from './types';

// Components
export { GPSGuard } from './components/GPSGuard';
export type { GPSGuardProps } from './components/GPSGuard';

export { DefaultLoading } from './components/DefaultLoading';
export { DefaultPrimer } from './components/DefaultPrimer';
export type { DefaultPrimerProps } from './components/DefaultPrimer';
export { DefaultError } from './components/DefaultError';
export type { DefaultErrorProps } from './components/DefaultError';

// Hooks & Context
export { useGPSGuard } from './hooks/useGPSGuard';
export type { UseGPSGuardProps, UseGPSGuardReturn } from './hooks/useGPSGuard';

export { GPSProvider, useGPS } from './context/GPSContext';
export type { GPSProviderProps } from './context/GPSContext';

// Services
export { GeolocationService } from './services/GeolocationService';
export { PermissionService } from './services/PermissionService';
export { PlatformService } from './services/PlatformService';
export { WatchService } from './services/WatchService';

// Constants
export { ERROR_MESSAGES, PERMISSION_STATES, STATUS_STATES } from './utils/constants';
