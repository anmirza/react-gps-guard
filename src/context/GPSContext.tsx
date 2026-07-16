import React, { createContext, useContext, ReactNode } from 'react';
import { useGPSGuard, UseGPSGuardReturn, UseGPSGuardProps } from '../hooks/useGPSGuard';

const GPSContext = createContext<UseGPSGuardReturn | null>(null);

export interface GPSProviderProps extends UseGPSGuardProps {
  children: ReactNode;
}

export const GPSProvider: React.FC<GPSProviderProps> = ({ children, ...props }) => {
  const gps = useGPSGuard(props);

  return <GPSContext.Provider value={gps}>{children}</GPSContext.Provider>;
};

export const useGPS = (): UseGPSGuardReturn => {
  const context = useContext(GPSContext);
  if (!context) {
    throw new Error('useGPS must be used within a GPSProvider');
  }
  return context;
};
