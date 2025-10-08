import { useState } from "react";
import { Header } from "@/components/Header";
import { Terminal } from "@/components/Terminal";
import { SystemMonitor } from "@/components/SystemMonitor";
import { FileExplorer } from "@/components/FileExplorer";
import { NetworkVisualization } from "@/components/NetworkVisualization";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { ParticleBackground } from "@/components/ParticleBackground";

const Index = () => {
  const [showWelcome, setShowWelcome] = useState(true);

  return (
    <>
      {showWelcome && <WelcomeScreen onComplete={() => setShowWelcome(false)} />}
      
      <div className="min-h-screen bg-background grid-pattern overflow-hidden relative">
        {/* Particle background */}
        <ParticleBackground />
        
        {/* Scanline effect overlay */}
        <div className="fixed inset-0 scanline pointer-events-none z-50" />
      
        {/* Header */}
        <Header />

        {/* Main content grid */}
        <div className="h-[calc(100vh-80px)] p-4 gap-4 grid grid-cols-12 grid-rows-12 relative z-10">
        {/* Terminal - Takes up most space */}
        <div className="col-span-7 row-span-8">
          <Terminal />
        </div>

        {/* System Monitor - Right side top */}
        <div className="col-span-5 row-span-6">
          <SystemMonitor />
        </div>

        {/* Network Visualization - Right side bottom */}
        <div className="col-span-5 row-span-6">
          <NetworkVisualization />
        </div>

        {/* File Explorer - Bottom left */}
        <div className="col-span-7 row-span-4">
          <FileExplorer />
        </div>
        </div>
      </div>
    </>
  );
};

export default Index;
