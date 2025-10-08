import { useState, useEffect } from "react";
import { Cpu, HardDrive, Activity, Thermometer } from "lucide-react";
import { useSystemInfo } from "@/hooks/useSystemInfo";

interface SystemMetric {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  unit?: string;
}

export const SystemMonitor = () => {
  const systemInfo = useSystemInfo();
  const [cpuUsage, setCpuUsage] = useState(0);
  const [ramUsage, setRamUsage] = useState(0);
  const [netUsage, setNetUsage] = useState(0);
  const [temp, setTemp] = useState(0);

  useEffect(() => {
    const updateMetrics = () => {
      // Simulate CPU usage based on actual performance
      if ('memory' in performance) {
        const mem = (performance as any).memory;
        setRamUsage(systemInfo.memoryUsed || (mem.usedJSHeapSize / mem.jsHeapSizeLimit) * 100);
      } else {
        setRamUsage((prev) => Math.max(20, Math.min(85, prev + (Math.random() - 0.5) * 15)));
      }

      // CPU simulation with more realistic values
      setCpuUsage((prev) => {
        const target = 30 + Math.random() * 40;
        return prev + (target - prev) * 0.3;
      });

      // Network simulation
      setNetUsage((prev) => Math.max(5, Math.min(95, prev + (Math.random() - 0.5) * 25)));

      // Temperature simulation
      setTemp((prev) => {
        const target = 45 + Math.random() * 30;
        return prev + (target - prev) * 0.2;
      });
    };

    updateMetrics();
    const interval = setInterval(updateMetrics, 1500);
    return () => clearInterval(interval);
  }, [systemInfo]);

  const metrics: SystemMetric[] = [
    { label: "CPU", value: cpuUsage, icon: <Cpu className="w-5 h-5" />, color: "cyan", unit: "%" },
    { label: "RAM", value: ramUsage, icon: <HardDrive className="w-5 h-5" />, color: "green", unit: "%" },
    { label: "NET", value: netUsage, icon: <Activity className="w-5 h-5" />, color: "purple", unit: "%" },
    { label: "TEMP", value: temp, icon: <Thermometer className="w-5 h-5" />, color: "pink", unit: "°C" },
  ];

  return (
    <div className="glass-panel h-full p-4 space-y-4 relative overflow-hidden">
      {/* Holographic effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/5 via-transparent to-neon-purple/5 pointer-events-none" />
      
      <div className="flex items-center gap-2 pb-3 border-b border-neon relative z-10">
        <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
        <span className="text-neon-cyan font-semibold text-sm">SYSTEM MONITOR</span>
        <div className="ml-auto text-xs text-muted-foreground">
          {systemInfo.cores} CORES
        </div>
      </div>

      <div className="space-y-6 relative z-10">
        {metrics.map((metric) => (
          <div key={metric.label} className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className={`flex items-center gap-2 text-neon-${metric.color}`}>
                {metric.icon}
                <span className="font-semibold">{metric.label}</span>
              </div>
              <span className={`text-neon-${metric.color} font-bold`}>
                {metric.value.toFixed(1)}{metric.unit}
              </span>
            </div>
            
            {/* Progress Bar */}
            <div className="h-2 bg-muted rounded-full overflow-hidden relative">
              <div
                className={`h-full bg-neon-${metric.color} transition-all duration-500 relative`}
                style={{ width: `${metric.value}%` }}
              >
                <div className="absolute inset-0 animate-pulse-glow" />
              </div>
            </div>

            {/* Grid visualization */}
            <div className="grid grid-cols-10 gap-1 h-8">
              {Array.from({ length: 10 }).map((_, idx) => (
                <div
                  key={idx}
                  className={`border ${
                    idx < Math.floor(metric.value / 10)
                      ? `border-neon-${metric.color} bg-neon-${metric.color}/20`
                      : "border-muted"
                  } transition-all duration-300`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* System info display */}
      <div className="pt-4 border-t border-neon/30 relative z-10">
        <div className="text-xs text-muted-foreground space-y-2">
          <div className="flex justify-between">
            <span>PLATFORM</span>
            <span className="text-neon-cyan">{systemInfo.platform}</span>
          </div>
          <div className="flex justify-between">
            <span>MEMORY</span>
            <span className="text-neon-green">{systemInfo.memory}GB</span>
          </div>
          <div className="flex justify-between">
            <span>CONNECTION</span>
            <span className="text-neon-purple">{systemInfo.connection.toUpperCase()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
