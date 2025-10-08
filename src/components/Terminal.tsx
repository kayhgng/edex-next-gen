import { useState, useEffect, useRef } from "react";
import { ChevronRight } from "lucide-react";

interface TerminalLine {
  type: "command" | "output" | "error";
  text: string;
}

const mockCommands = [
  { cmd: "system.status", output: "All systems operational" },
  { cmd: "network.scan", output: "Scanning network... 3 devices found" },
  { cmd: "cpu.monitor --verbose", output: "CPU: 4 cores @ 3.2GHz | Load: 45%" },
  { cmd: "memory.check", output: "RAM: 8.4GB / 16GB (52.5%)" },
  { cmd: "disk.analyze /home", output: "Analyzing filesystem... 142GB free" },
];

export const Terminal = () => {
  const [lines, setLines] = useState<TerminalLine[]>([
    { type: "output", text: "SYSTEM INITIALIZED" },
    { type: "output", text: "edex-ui v2.0 - Enhanced Terminal Interface" },
    { type: "output", text: "Type 'help' for available commands" },
    { type: "output", text: "" },
  ]);
  const [currentInput, setCurrentInput] = useState("");
  const [commandIndex, setCommandIndex] = useState(0);
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Auto-run commands demo
    const interval = setInterval(() => {
      if (commandIndex < mockCommands.length) {
        const { cmd, output } = mockCommands[commandIndex];
        setLines((prev) => [
          ...prev,
          { type: "command", text: `$ ${cmd}` },
          { type: "output", text: output },
        ]);
        setCommandIndex((prev) => prev + 1);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [commandIndex]);

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
      newLines.push({
        type: "output",
        text: "Available commands: system.status, network.scan, cpu.monitor, memory.check, disk.analyze, clear",
      });
    } else if (currentInput.toLowerCase() === "clear") {
      setLines([]);
      setCurrentInput("");
      return;
    } else {
      newLines.push({
        type: "output",
        text: `Command '${currentInput}' executed successfully`,
      });
    }

    setLines((prev) => [...prev, ...newLines]);
    setCurrentInput("");
  };

  return (
    <div className="glass-panel h-full flex flex-col overflow-hidden relative">
      {/* Scanline effect */}
      <div className="absolute inset-0 scanline pointer-events-none" />
      
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
                ? "text-neon-cyan"
                : line.type === "error"
                ? "text-destructive"
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
