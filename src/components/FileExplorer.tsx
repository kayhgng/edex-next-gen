import { useState } from "react";
import { Folder, File, ChevronRight, ChevronDown } from "lucide-react";

interface FileNode {
  name: string;
  type: "file" | "folder";
  children?: FileNode[];
  expanded?: boolean;
}

const mockFileSystem: FileNode[] = [
  {
    name: "root",
    type: "folder",
    expanded: true,
    children: [
      {
        name: "home",
        type: "folder",
        expanded: true,
        children: [
          { name: "documents", type: "folder", children: [] },
          { name: "downloads", type: "folder", children: [] },
          { name: "config.json", type: "file" },
          { name: "data.db", type: "file" },
        ],
      },
      {
        name: "system",
        type: "folder",
        children: [
          { name: "kernel.sys", type: "file" },
          { name: "boot.img", type: "file" },
        ],
      },
      {
        name: "var",
        type: "folder",
        children: [
          { name: "logs", type: "folder", children: [] },
          { name: "cache", type: "folder", children: [] },
        ],
      },
    ],
  },
];

export const FileExplorer = () => {
  const [files, setFiles] = useState<FileNode[]>(mockFileSystem);

  const toggleFolder = (path: number[]) => {
    const newFiles = [...files];
    let current: FileNode[] = newFiles;
    
    for (let i = 0; i < path.length - 1; i++) {
      current = current[path[i]].children || [];
    }
    
    const target = current[path[path.length - 1]];
    if (target.type === "folder") {
      target.expanded = !target.expanded;
    }
    
    setFiles(newFiles);
  };

  const renderNode = (node: FileNode, path: number[] = [], depth: number = 0) => {
    return (
      <div key={path.join("-")}>
        <div
          onClick={() => node.type === "folder" && toggleFolder(path)}
          className={`flex items-center gap-2 py-1.5 px-2 rounded cursor-pointer transition-colors ${
            node.type === "folder" ? "hover:bg-neon-cyan/10" : "hover:bg-muted/50"
          }`}
          style={{ paddingLeft: `${depth * 20 + 8}px` }}
        >
          {node.type === "folder" ? (
            <>
              {node.expanded ? (
                <ChevronDown className="w-3 h-3 text-neon-cyan" />
              ) : (
                <ChevronRight className="w-3 h-3 text-neon-cyan" />
              )}
              <Folder className="w-4 h-4 text-neon-cyan" />
            </>
          ) : (
            <>
              <div className="w-3" />
              <File className="w-4 h-4 text-neon-green" />
            </>
          )}
          <span className={`text-xs ${node.type === "folder" ? "text-neon-cyan" : "text-foreground"}`}>
            {node.name}
          </span>
        </div>
        {node.type === "folder" && node.expanded && node.children && (
          <div>
            {node.children.map((child, idx) =>
              renderNode(child, [...path, idx], depth + 1)
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="glass-panel h-full flex flex-col overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-2 border-b border-neon">
        <div className="w-2 h-2 rounded-full bg-neon-purple animate-pulse" />
        <span className="text-neon-cyan font-semibold text-sm">FILE SYSTEM</span>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {files.map((node, idx) => renderNode(node, [idx]))}
      </div>

      <div className="px-4 py-2 border-t border-neon/30 text-xs text-muted-foreground">
        <div className="flex justify-between">
          <span>142 FILES</span>
          <span className="text-neon-green">2.4 GB</span>
        </div>
      </div>
    </div>
  );
};
