export const ParticleBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {/* Floating particles */}
      {Array.from({ length: 30 }).map((_, idx) => (
        <div
          key={idx}
          className="absolute rounded-full animate-float"
          style={{
            width: `${Math.random() * 4 + 2}px`,
            height: `${Math.random() * 4 + 2}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: `hsl(${180 + Math.random() * 90} 100% ${50 + Math.random() * 30}%)`,
            animationDelay: `${Math.random() * 10}s`,
            animationDuration: `${10 + Math.random() * 20}s`,
            boxShadow: `0 0 ${10 + Math.random() * 20}px currentColor`,
          }}
        />
      ))}

      {/* Corner gradients */}
      <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-gradient-radial from-neon-cyan/10 to-transparent blur-3xl" />
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-radial from-neon-purple/10 to-transparent blur-3xl" />
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-radial from-neon-green/10 to-transparent blur-3xl" />
      <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-gradient-radial from-neon-pink/10 to-transparent blur-3xl" />
    </div>
  );
};
