import { useState, useEffect } from "react";

interface FileSystemItem {
  name: string;
  type: "file" | "directory";
  size?: number;
  modified?: Date;
}

export const useFileSystem = () => {
  const [currentPath, setCurrentPath] = useState("C:\\Users\\Alikay_h");
  const [fileSystem, setFileSystem] = useState<Record<string, FileSystemItem[]>>({
    "C:\\Users\\Alikay_h": [
      { name: "Desktop", type: "directory", modified: new Date() },
      { name: "Documents", type: "directory", modified: new Date() },
      { name: "Downloads", type: "directory", modified: new Date() },
      { name: "Pictures", type: "directory", modified: new Date() },
      { name: "Videos", type: "directory", modified: new Date() },
      { name: "config.json", type: "file", size: 2048, modified: new Date() },
    ],
    "C:\\Users\\Alikay_h\\Desktop": [
      { name: "project.txt", type: "file", size: 1024, modified: new Date() },
      { name: "notes.txt", type: "file", size: 512, modified: new Date() },
    ],
    "C:\\Users\\Alikay_h\\Documents": [
      { name: "report.docx", type: "file", size: 15360, modified: new Date() },
      { name: "data.xlsx", type: "file", size: 8192, modified: new Date() },
    ],
    "C:\\Users\\Alikay_h\\Downloads": [
      { name: "installer.exe", type: "file", size: 52428800, modified: new Date() },
      { name: "image.png", type: "file", size: 204800, modified: new Date() },
    ],
  });

  const getCurrentDirectory = () => {
    return fileSystem[currentPath] || [];
  };

  const changeDirectory = (path: string) => {
    // Handle relative paths
    if (path === "..") {
      const parts = currentPath.split("\\");
      if (parts.length > 1) {
        parts.pop();
        const newPath = parts.join("\\");
        if (fileSystem[newPath]) {
          setCurrentPath(newPath);
          return true;
        }
      }
      return false;
    }

    // Handle absolute paths
    if (path.includes(":\\")) {
      if (fileSystem[path]) {
        setCurrentPath(path);
        return true;
      }
      return false;
    }

    // Handle relative directory names
    const newPath = `${currentPath}\\${path}`;
    if (fileSystem[newPath]) {
      setCurrentPath(newPath);
      return true;
    }

    return false;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} bytes`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  };

  return {
    currentPath,
    getCurrentDirectory,
    changeDirectory,
    formatFileSize,
  };
};
