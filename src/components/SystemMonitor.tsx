import { useState, useEffect } from "react";
import { Cpu, HardDrive, Activity } from "lucide-react";

interface SystemMetric {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

export const SystemMonitor = () => {
  const [metrics, setMetrics] = useState<SystemMetric[]>([
    { label: "CPU", value: 45, icon: <Cpu className="w-5 h-5" />, color: "cyan" },
    { label: "RAM", value: 62, icon: <HardDrive className="w-5 h-5" />, color: "green" },
    { label: "NET", value: 38, icon: <Activity className="w-5 h-5" />, color: "purple" },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) =>
        prev.map((metric) => ({
          ...metric,
          value: Math.max(10, Math.min(95, metric.value + (Math.random() - 0.5) * 20)),
        }))
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-panel h-full p-4 space-y-4">
      <div className="flex items-center gap-2 pb-3 border-b border-neon">
        <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
        <span className="text-neon-cyan font-semibold text-sm">SYSTEM MONITOR</span>
      </div>

      <div className="space-y-6">
        {metrics.map((metric) => (
          <div key={metric.label} className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className={`flex items-center gap-2 text-neon-${metric.color}`}>
                {metric.icon}
                <span className="font-semibold">{metric.label}</span>
              </div>
              <span className={`text-neon-${metric.color} font-bold`}>
                {metric.value.toFixed(1)}%
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

      {/* Uptime display */}
      <div className="pt-4 border-t border-neon/30">
        <div className="text-xs text-muted-foreground">
          <div className="flex justify-between mb-1">
            <span>UPTIME</span>
            <span className="text-neon-cyan">24:13:47</span>
          </div>
          <div className="flex justify-between">
            <span>PROCESSES</span>
            <span className="text-neon-green">142</span>
          </div>
        </div>
      </div>
    </div>
  );
};
