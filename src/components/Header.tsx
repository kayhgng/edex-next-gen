import { useState, useEffect } from "react";
import { Wifi, Signal, Battery, Zap } from "lucide-react";

export const Header = () => {
  const [time, setTime] = useState(new Date());
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    // Random glitch effect
    const glitchTimer = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 100);
    }, 8000);

    return () => {
      clearInterval(timer);
      clearInterval(glitchTimer);
    };
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <header className="glass-panel border-b-2 border-neon px-6 py-3 flex items-center justify-between relative overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 grid-pattern opacity-20" />
      
      {/* Left side - Logo */}
      <div className="flex items-center gap-3 z-10">
        <div className="relative">
          <Zap className={`w-8 h-8 text-neon-cyan ${glitch ? "animate-glitch" : ""}`} />
          <div className="absolute inset-0 blur-md bg-neon-cyan/50 animate-pulse-glow" />
        </div>
        <div>
          <h1 className={`text-2xl font-bold text-neon-cyan ${glitch ? "animate-glitch" : ""}`}>
            EDEX-UI
          </h1>
          <p className="text-xs text-neon-green">v2.0 Enhanced</p>
        </div>
      </div>

      {/* Center - Time */}
      <div className="flex flex-col items-center z-10">
        <div className={`text-4xl font-bold text-neon-cyan tabular-nums ${glitch ? "animate-glitch" : ""}`}>
          {formatTime(time)}
        </div>
        <div className="text-xs text-muted-foreground">{formatDate(time)}</div>
      </div>

      {/* Right side - System icons */}
      <div className="flex items-center gap-4 z-10">
        <div className="flex items-center gap-2 text-neon-green">
          <Wifi className="w-5 h-5 animate-pulse" />
          <span className="text-xs font-semibold">ONLINE</span>
        </div>
        <div className="flex items-center gap-2 text-neon-purple">
          <Signal className="w-5 h-5" />
          <span className="text-xs font-semibold">85%</span>
        </div>
        <div className="flex items-center gap-2 text-neon-cyan">
          <Battery className="w-5 h-5" />
          <span className="text-xs font-semibold">92%</span>
        </div>
      </div>
    </header>
  );
};
