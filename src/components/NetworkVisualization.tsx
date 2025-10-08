import { useState, useEffect } from "react";
import { Activity } from "lucide-react";

interface DataPoint {
  value: number;
}

export const NetworkVisualization = () => {
  const [dataPoints, setDataPoints] = useState<DataPoint[]>(
    Array.from({ length: 40 }, () => ({ value: Math.random() * 100 }))
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setDataPoints((prev) => {
        const newPoints = [...prev.slice(1), { value: Math.random() * 100 }];
        return newPoints;
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const maxValue = Math.max(...dataPoints.map((p) => p.value));

  return (
    <div className="glass-panel h-full p-4 flex flex-col">
      <div className="flex items-center gap-2 pb-3 border-b border-neon mb-4">
        <Activity className="w-4 h-4 text-neon-purple animate-pulse" />
        <span className="text-neon-cyan font-semibold text-sm">NETWORK ACTIVITY</span>
      </div>

      {/* Graph */}
      <div className="flex-1 flex items-end gap-1 relative">
        {/* Grid lines */}
        <div className="absolute inset-0 grid grid-rows-4 border-neon-cyan/20">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="border-t border-neon-cyan/10" />
          ))}
        </div>

        {/* Bars */}
        {dataPoints.map((point, idx) => (
          <div
            key={idx}
            className="flex-1 relative group"
            style={{ height: "100%" }}
          >
            <div
              className="absolute bottom-0 w-full bg-gradient-to-t from-neon-purple to-neon-cyan transition-all duration-300"
              style={{
                height: `${(point.value / maxValue) * 100}%`,
                boxShadow: `0 0 10px hsl(270 100% 65% / 0.5)`,
              }}
            />
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="mt-4 pt-3 border-t border-neon/30 grid grid-cols-2 gap-4 text-xs">
        <div>
          <div className="text-muted-foreground">UPLOAD</div>
          <div className="text-neon-green font-bold">24.3 MB/s</div>
        </div>
        <div>
          <div className="text-muted-foreground">DOWNLOAD</div>
          <div className="text-neon-cyan font-bold">86.7 MB/s</div>
        </div>
      </div>
    </div>
  );
};
