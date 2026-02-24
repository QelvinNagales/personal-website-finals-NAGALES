import { useState, useEffect } from 'react';
import type { DeviceInfo, Orientation } from '@/types/game';

export function useOrientation(): DeviceInfo {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>(() => ({
    isMobile: typeof window !== 'undefined' && window.innerWidth < 768,
    isTouch: typeof window !== 'undefined' && 'ontouchstart' in window,
    orientation: typeof window !== 'undefined' 
      ? window.innerWidth > window.innerHeight ? 'landscape' : 'portrait'
      : 'landscape',
  }));

  useEffect(() => {
    const updateDeviceInfo = () => {
      const isMobile = window.innerWidth < 768;
      const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const orientation: Orientation = window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
      
      setDeviceInfo({ isMobile, isTouch, orientation });
    };

    updateDeviceInfo();
    
    window.addEventListener('resize', updateDeviceInfo);
    window.addEventListener('orientationchange', updateDeviceInfo);
    
    return () => {
      window.removeEventListener('resize', updateDeviceInfo);
      window.removeEventListener('orientationchange', updateDeviceInfo);
    };
  }, []);

  return deviceInfo;
}
