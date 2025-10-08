import { useState, useEffect, useRef } from "react";
import { ChevronRight } from "lucide-react";
import { useSystemInfo } from "@/hooks/useSystemInfo";

interface TerminalLine {
  type: "command" | "output" | "error" | "success";
  text: string;
}

export const Terminal = () => {
  const systemInfo = useSystemInfo();
  const [lines, setLines] = useState<TerminalLine[]>([
    { type: "success", text: "╔═══════════════════════════════════════════════════════════╗" },
    { type: "success", text: "║         EDEX-UI v2.0 - NEURAL INTERFACE ACTIVE          ║" },
    { type: "success", text: "╚═══════════════════════════════════════════════════════════╝" },
    { type: "output", text: "" },
    { type: "output", text: `User: Alikay_h | Platform: ${navigator.platform}` },
    { type: "output", text: `Cores: ${navigator.hardwareConcurrency || 4} | Language: ${navigator.language}` },
    { type: "output", text: "" },
    { type: "success", text: "Type 'help' for available commands" },
    { type: "output", text: "" },
  ]);
  const [currentInput, setCurrentInput] = useState("");
  const [commandIndex, setCommandIndex] = useState(0);
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Auto-run commands demo with real data
    const runCommand = () => {
      if (commandIndex === 0) {
        setLines((prev) => [
          ...prev,
          { type: "command", text: "$ system.status" },
          { type: "success", text: "✓ All systems operational" },
          { type: "output", text: "" },
        ]);
      } else if (commandIndex === 1) {
        setLines((prev) => [
          ...prev,
          { type: "command", text: "$ network.info" },
          { type: "output", text: `Connection: ${systemInfo.connection}` },
          { type: "output", text: `Status: ONLINE` },
          { type: "output", text: "" },
        ]);
      } else if (commandIndex === 2) {
        setLines((prev) => [
          ...prev,
          { type: "command", text: "$ hardware.specs" },
          { type: "output", text: `CPU Cores: ${systemInfo.cores}` },
          { type: "output", text: `Memory: ${systemInfo.memory}GB` },
          { type: "output", text: `Platform: ${systemInfo.platform}` },
          { type: "output", text: "" },
        ]);
      } else if (commandIndex === 3) {
        const storageGB = (systemInfo.storageUsed / (1024 ** 3)).toFixed(2);
        const totalGB = (systemInfo.storageTotal / (1024 ** 3)).toFixed(2);
        setLines((prev) => [
          ...prev,
          { type: "command", text: "$ storage.analyze" },
          { type: "output", text: `Used: ${storageGB}GB / ${totalGB}GB` },
          { type: "success", text: "✓ Storage analysis complete" },
          { type: "output", text: "" },
        ]);
      }
      setCommandIndex((prev) => prev + 1);
    };

    if (commandIndex < 4) {
      const timer = setTimeout(runCommand, 3000);
      return () => clearTimeout(timer);
    }
  }, [commandIndex, systemInfo]);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentInput.trim()) return;

    const newLines: TerminalLine[] = [
      { type: "command", text: `$ ${currentInput}` },
    ];

    if (currentInput.toLowerCase() === "help") {
      newLines.push(
        { type: "success", text: "═══════════════════════════════════════════════" },
        { type: "output", text: "AVAILABLE COMMANDS:" },
        { type: "output", text: "" },
        { type: "output", text: "  system.status    - Check system status" },
        { type: "output", text: "  network.info     - Network information" },
        { type: "output", text: "  hardware.specs   - Hardware specifications" },
        { type: "output", text: "  storage.analyze  - Storage information" },
        { type: "output", text: "  clear           - Clear terminal" },
        { type: "success", text: "═══════════════════════════════════════════════" },
        { type: "output", text: "" }
      );
    } else if (currentInput.toLowerCase() === "system.status") {
      newLines.push(
        { type: "success", text: "✓ All systems operational" },
        { type: "output", text: `Battery: ${systemInfo.batteryLevel.toFixed(0)}% ${systemInfo.batteryCharging ? '(Charging)' : ''}` }
      );
    } else if (currentInput.toLowerCase() === "network.info") {
      newLines.push(
        { type: "output", text: `Connection Type: ${systemInfo.connection}` },
        { type: "output", text: `Language: ${systemInfo.language}` },
        { type: "success", text: "✓ Network online" }
      );
    } else if (currentInput.toLowerCase() === "hardware.specs") {
      newLines.push(
        { type: "output", text: `CPU Cores: ${systemInfo.cores}` },
        { type: "output", text: `Memory: ${systemInfo.memory}GB` },
        { type: "output", text: `Platform: ${systemInfo.platform}` },
        { type: "output", text: `User Agent: ${systemInfo.userAgent.substring(0, 60)}...` }
      );
    } else if (currentInput.toLowerCase() === "storage.analyze") {
      const usedGB = (systemInfo.storageUsed / (1024 ** 3)).toFixed(2);
      const totalGB = (systemInfo.storageTotal / (1024 ** 3)).toFixed(2);
      newLines.push(
        { type: "output", text: `Storage Used: ${usedGB}GB` },
        { type: "output", text: `Total Storage: ${totalGB}GB` },
        { type: "success", text: "✓ Analysis complete" }
      );
    } else if (currentInput.toLowerCase() === "clear") {
      setLines([]);
      setCurrentInput("");
      return;
    } else {
      newLines.push({
        type: "error",
        text: `Command '${currentInput}' not found. Type 'help' for available commands.`,
      });
    }

    setLines((prev) => [...prev, ...newLines]);
    setCurrentInput("");
  };

  return (
    <div className="glass-panel h-full flex flex-col overflow-hidden relative group">
      {/* Scanline effect */}
      <div className="absolute inset-0 scanline pointer-events-none" />
      
      {/* Holographic corners */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-neon-cyan" />
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-neon-cyan" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-neon-cyan" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-neon-cyan" />
      
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-neon">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-neon-green animate-pulse-glow" />
          <span className="text-neon-cyan font-semibold">TERMINAL</span>
        </div>
        <div className="text-xs text-muted-foreground">SESSION_01</div>
      </div>

      {/* Terminal Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1 text-sm">
        {lines.map((line, idx) => (
          <div
            key={idx}
            className={`font-mono ${
              line.type === "command"
                ? "text-neon-cyan font-semibold"
                : line.type === "error"
                ? "text-destructive"
                : line.type === "success"
                ? "text-neon-green"
                : "text-foreground opacity-80"
            }`}
          >
            {line.text}
          </div>
        ))}
        <div ref={terminalEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="px-4 py-3 border-t border-neon flex items-center gap-2">
        <ChevronRight className="w-4 h-4 text-neon-cyan" />
        <input
          ref={inputRef}
          type="text"
          value={currentInput}
          onChange={(e) => setCurrentInput(e.target.value)}
          className="flex-1 bg-transparent outline-none text-neon-cyan placeholder:text-muted-foreground"
          placeholder="Enter command..."
          autoFocus
        />
      </form>
    </div>
  );
};
