import { useState, useEffect, useRef } from "react";
import { ChevronRight } from "lucide-react";
import { useSystemInfo } from "@/hooks/useSystemInfo";
import { useFileSystem } from "@/hooks/useFileSystem";

interface TerminalLine {
  type: "command" | "output" | "error" | "success" | "header";
  text: string;
}

export const WindowsTerminal = () => {
  const systemInfo = useSystemInfo();
  const { currentPath, getCurrentDirectory, changeDirectory, formatFileSize } = useFileSystem();
  const [lines, setLines] = useState<TerminalLine[]>([
    { type: "header", text: "Microsoft Windows [Version 10.0.19045.3570]" },
    { type: "output", text: "(c) NEXA Corporation. All rights reserved." },
    { type: "output", text: "" },
  ]);
  const [currentInput, setCurrentInput] = useState("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  const executeCommand = (input: string) => {
    const [cmd, ...args] = input.trim().toLowerCase().split(/\s+/);
    const argStr = args.join(" ");

    const newLines: TerminalLine[] = [];

    switch (cmd) {
      case "help":
        newLines.push(
          { type: "output", text: "For more information on a specific command, type HELP command-name" },
          { type: "output", text: "" },
          { type: "success", text: "DIR       - Displays a list of files and subdirectories" },
          { type: "success", text: "CD        - Displays the name of or changes the current directory" },
          { type: "success", text: "CLS       - Clears the screen" },
          { type: "success", text: "IPCONFIG  - Displays network configuration" },
          { type: "success", text: "SYSTEMINFO - Displays detailed system configuration" },
          { type: "success", text: "TASKLIST  - Displays currently running processes" },
          { type: "success", text: "DATE      - Displays or sets the date" },
          { type: "success", text: "TIME      - Displays or sets the system time" },
          { type: "success", text: "VER       - Displays the Windows version" },
          { type: "success", text: "WHOAMI    - Displays user information" },
          { type: "success", text: "TREE      - Graphically displays the directory structure" },
          { type: "output", text: "" }
        );
        break;

      case "dir":
        const items = getCurrentDirectory();
        const now = new Date();
        newLines.push(
          { type: "output", text: ` Directory of ${currentPath}` },
          { type: "output", text: "" },
          { type: "output", text: `${now.toLocaleDateString()} ${now.toLocaleTimeString()}    <DIR>          .` },
          { type: "output", text: `${now.toLocaleDateString()} ${now.toLocaleTimeString()}    <DIR>          ..` }
        );
        items.forEach(item => {
          const date = item.modified?.toLocaleDateString() || now.toLocaleDateString();
          const time = item.modified?.toLocaleTimeString() || now.toLocaleTimeString();
          if (item.type === "directory") {
            newLines.push({ type: "output", text: `${date} ${time}    <DIR>          ${item.name}` });
          } else {
            const size = item.size ? item.size.toString().padStart(19) : "0".padStart(19);
            newLines.push({ type: "output", text: `${date} ${time} ${size} ${item.name}` });
          }
        });
        const fileCount = items.filter(i => i.type === "file").length;
        const dirCount = items.filter(i => i.type === "directory").length;
        const totalSize = items.reduce((sum, i) => sum + (i.size || 0), 0);
        newLines.push(
          { type: "output", text: `               ${fileCount} File(s) ${formatFileSize(totalSize)}` },
          { type: "output", text: `               ${dirCount} Dir(s)` },
          { type: "output", text: "" }
        );
        break;

      case "cd":
        if (!argStr) {
          newLines.push({ type: "output", text: currentPath }, { type: "output", text: "" });
        } else {
          if (changeDirectory(argStr)) {
            // Success - no output in CMD
          } else {
            newLines.push(
              { type: "error", text: "The system cannot find the path specified." },
              { type: "output", text: "" }
            );
          }
        }
        break;

      case "cls":
        setLines([]);
        return;

      case "ipconfig":
        newLines.push(
          { type: "output", text: "" },
          { type: "output", text: "Windows IP Configuration" },
          { type: "output", text: "" },
          { type: "output", text: "Ethernet adapter Ethernet:" },
          { type: "output", text: "" },
          { type: "output", text: `   Connection-specific DNS Suffix  . : ${systemInfo.connection}` },
          { type: "output", text: "   IPv4 Address. . . . . . . . . . . : 192.168.1.101" },
          { type: "output", text: "   Subnet Mask . . . . . . . . . . . : 255.255.255.0" },
          { type: "output", text: "   Default Gateway . . . . . . . . . : 192.168.1.1" },
          { type: "output", text: "" }
        );
        break;

      case "systeminfo":
        newLines.push(
          { type: "output", text: "" },
          { type: "output", text: "Host Name:                 NEXA-SYSTEM" },
          { type: "output", text: `OS Name:                   ${systemInfo.platform}` },
          { type: "output", text: "OS Version:                10.0.19045 Build 19045" },
          { type: "output", text: "System Manufacturer:       NEXA Corporation" },
          { type: "output", text: "System Model:              NEXA-OS" },
          { type: "output", text: `Processor(s):              ${systemInfo.cores} Processor(s) Installed.` },
          { type: "output", text: `Total Physical Memory:     ${systemInfo.memory * 1024} MB` },
          { type: "output", text: `Available Physical Memory: ${Math.floor(systemInfo.memory * 1024 * (1 - systemInfo.memoryUsed / 100))} MB` },
          { type: "output", text: "" }
        );
        break;

      case "tasklist":
        newLines.push(
          { type: "output", text: "" },
          { type: "output", text: "Image Name                     PID Session Name        Session#    Mem Usage" },
          { type: "output", text: "========================= ======== ================ =========== ============" },
          { type: "output", text: "System Idle Process              0 Services                   0         8 K" },
          { type: "output", text: "System                           4 Services                   0     2,048 K" },
          { type: "output", text: "nexa-os.exe                   1234 Console                    1    45,632 K" },
          { type: "output", text: "chrome.exe                    5678 Console                    1   256,789 K" },
          { type: "output", text: "explorer.exe                  9012 Console                    1    32,456 K" },
          { type: "output", text: "" }
        );
        break;

      case "date":
        newLines.push(
          { type: "output", text: `The current date is: ${new Date().toLocaleDateString()}` },
          { type: "output", text: "" }
        );
        break;

      case "time":
        newLines.push(
          { type: "output", text: `The current time is: ${new Date().toLocaleTimeString()}` },
          { type: "output", text: "" }
        );
        break;

      case "ver":
        newLines.push(
          { type: "output", text: "" },
          { type: "output", text: "NEXA-OS [Version 10.0.19045.3570]" },
          { type: "output", text: "" }
        );
        break;

      case "whoami":
        newLines.push(
          { type: "output", text: "nexa-system\\alikay_h" },
          { type: "output", text: "" }
        );
        break;

      case "tree":
        newLines.push(
          { type: "output", text: `Folder PATH listing for volume NEXA` },
          { type: "output", text: `Volume serial number is NEXA-${Date.now().toString(16).toUpperCase()}` },
          { type: "output", text: currentPath },
          { type: "output", text: "│" }
        );
        getCurrentDirectory().forEach((item, idx, arr) => {
          const isLast = idx === arr.length - 1;
          const prefix = isLast ? "└───" : "├───";
          newLines.push({ type: "output", text: `${prefix} ${item.name}` });
        });
        newLines.push({ type: "output", text: "" });
        break;

      case "":
        // Empty command, just new line
        break;

      default:
        newLines.push(
          { type: "error", text: `'${cmd}' is not recognized as an internal or external command,` },
          { type: "error", text: "operable program or batch file." },
          { type: "output", text: "" }
        );
    }

    return newLines;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentInput.trim()) {
      setLines((prev) => [...prev, { type: "output", text: "" }]);
      return;
    }

    const commandLine: TerminalLine = {
      type: "command",
      text: `${currentPath}>${currentInput}`,
    };

    const output = executeCommand(currentInput);
    
    setLines((prev) => [...prev, commandLine, ...(output || [])]);
    setCommandHistory((prev) => [...prev, currentInput]);
    setHistoryIndex(-1);
    setCurrentInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = Math.min(commandHistory.length - 1, historyIndex + 1);
        if (newIndex === commandHistory.length - 1 && historyIndex === newIndex) {
          setHistoryIndex(-1);
          setCurrentInput("");
        } else {
          setHistoryIndex(newIndex);
          setCurrentInput(commandHistory[newIndex]);
        }
      }
    }
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
          <span className="text-neon-cyan font-semibold">CMD.EXE</span>
        </div>
        <div className="text-xs text-muted-foreground">Windows Command Processor</div>
      </div>

      {/* Terminal Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-0 text-sm font-mono">
        {lines.map((line, idx) => (
          <div
            key={idx}
            className={`${
              line.type === "command"
                ? "text-foreground font-semibold"
                : line.type === "error"
                ? "text-destructive"
                : line.type === "success"
                ? "text-neon-green"
                : line.type === "header"
                ? "text-neon-cyan"
                : "text-foreground opacity-90"
            }`}
          >
            {line.text}
          </div>
        ))}
        <div ref={terminalEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="px-4 py-3 border-t border-neon flex items-center gap-2">
        <span className="text-foreground font-mono text-sm">{currentPath}&gt;</span>
        <input
          ref={inputRef}
          type="text"
          value={currentInput}
          onChange={(e) => setCurrentInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground font-mono"
          placeholder="Type 'help' for commands..."
          autoFocus
        />
      </form>
    </div>
  );
};
