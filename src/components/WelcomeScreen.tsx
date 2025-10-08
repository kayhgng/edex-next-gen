import { useState, useEffect } from "react";
import { Terminal as TerminalIcon, Zap } from "lucide-react";

interface WelcomeScreenProps {
  username?: string;
  onComplete?: () => void;
}

export const WelcomeScreen = ({ username = "Alikay_h", onComplete }: WelcomeScreenProps) => {
  const [visible, setVisible] = useState(true);
  const [textIndex, setTextIndex] = useState(0);

  const welcomeTexts = [
    "BOOTING NEXA-OS...",
    "LOADING SYSTEM MODULES...",
    "INITIALIZING NEURAL CORE...",
    `WELCOME BACK, ${username.toUpperCase()}`,
    "SYSTEM READY",
  ];

  useEffect(() => {
    if (textIndex < welcomeTexts.length) {
      const timer = setTimeout(() => {
        setTextIndex((prev) => prev + 1);
      }, 800);
      return () => clearTimeout(timer);
    } else {
      const fadeTimer = setTimeout(() => {
        setVisible(false);
        onComplete?.();
      }, 1500);
      return () => clearTimeout(fadeTimer);
    }
  }, [textIndex, welcomeTexts.length, onComplete]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm animate-in fade-in">
      <div className="text-center space-y-8">
        {/* Logo with pulse effect */}
        <div className="relative inline-block">
          <Zap className="w-24 h-24 text-neon-cyan animate-pulse-glow" />
          <div className="absolute inset-0 blur-2xl bg-neon-cyan/50 animate-pulse" />
        </div>

        {/* Welcome text */}
        <div className="space-y-4">
          <h1 className="text-5xl font-bold text-neon-cyan animate-pulse-glow">
            NEXA-OS
          </h1>
          <p className="text-sm text-neon-purple">Advanced System Interface</p>
          
          <div className="h-8 flex items-center justify-center">
            {welcomeTexts.slice(0, textIndex + 1).map((text, idx) => (
              idx === textIndex && (
                <p
                  key={idx}
                  className="text-xl text-neon-green animate-in fade-in slide-in-from-bottom-4"
                >
                  {text}
                  <span className="animate-pulse">_</span>
                </p>
              )
            ))}
          </div>
        </div>

        {/* Loading bar */}
        <div className="w-64 h-1 mx-auto bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-green animate-pulse-glow transition-all duration-1000"
            style={{ width: `${((textIndex + 1) / welcomeTexts.length) * 100}%` }}
          />
        </div>

        {/* Particles */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 20 }).map((_, idx) => (
            <div
              key={idx}
              className="absolute w-1 h-1 bg-neon-cyan rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
