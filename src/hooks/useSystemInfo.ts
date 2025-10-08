import { useState, useEffect } from "react";

interface SystemInfo {
  platform: string;
  userAgent: string;
  language: string;
  cores: number;
  memory: number;
  memoryUsed: number;
  connection: string;
  batteryLevel: number;
  batteryCharging: boolean;
  storageUsed: number;
  storageTotal: number;
}

export const useSystemInfo = () => {
  const [systemInfo, setSystemInfo] = useState<SystemInfo>({
    platform: "Unknown",
    userAgent: "Unknown",
    language: "en-US",
    cores: 4,
    memory: 8,
    memoryUsed: 0,
    connection: "Unknown",
    batteryLevel: 0,
    batteryCharging: false,
    storageUsed: 0,
    storageTotal: 0,
  });

  useEffect(() => {
    const updateSystemInfo = async () => {
      const info: Partial<SystemInfo> = {};

      // Platform and user agent
      info.platform = navigator.platform;
      info.userAgent = navigator.userAgent;
      info.language = navigator.language;

      // CPU cores
      info.cores = navigator.hardwareConcurrency || 4;

      // Memory (if available)
      if ('deviceMemory' in navigator) {
        info.memory = (navigator as any).deviceMemory;
      }

      // Performance memory (Chrome only)
      if ('memory' in performance) {
        const mem = (performance as any).memory;
        info.memoryUsed = (mem.usedJSHeapSize / mem.jsHeapSizeLimit) * 100;
      }

      // Network information
      if ('connection' in navigator) {
        const conn = (navigator as any).connection;
        info.connection = conn.effectiveType || "Unknown";
      }

      // Battery API
      if ('getBattery' in navigator) {
        try {
          const battery: any = await (navigator as any).getBattery();
          info.batteryLevel = battery.level * 100;
          info.batteryCharging = battery.charging;
        } catch (e) {
          info.batteryLevel = 92;
          info.batteryCharging = false;
        }
      }

      // Storage estimation
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        try {
          const estimate = await navigator.storage.estimate();
          info.storageUsed = estimate.usage || 0;
          info.storageTotal = estimate.quota || 0;
        } catch (e) {
          // Fallback values
        }
      }

      setSystemInfo((prev) => ({ ...prev, ...info }));
    };

    updateSystemInfo();
    const interval = setInterval(updateSystemInfo, 5000);

    return () => clearInterval(interval);
  }, []);

  return systemInfo;
};
