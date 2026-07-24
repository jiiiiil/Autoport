"use client";

import { motion, AnimatePresence } from "framer-motion";
import { File, Folder } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore, type FileNode } from "@/lib/store";

interface FileTreeProps {
  className?: string;
}

function FileNodeItem({ node, depth = 0 }: { node: FileNode; depth?: number }) {
  return (
    <div>
      <motion.div
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2 }}
        className="flex items-center gap-2 py-0.5"
        style={{ paddingLeft: `${depth * 12}px` }}
      >
        {node.type === "folder" ? (
          <Folder className="w-3 h-3 text-blue-400 shrink-0" />
        ) : (
          <File className="w-3 h-3 text-text-muted/60 shrink-0" />
        )}
        <span
          className={cn(
            "text-[10px] font-mono",
            node.type === "folder" ? "text-blue-400 font-medium" : "text-text-muted"
          )}
        >
          {node.name}
        </span>
      </motion.div>
      {node.children?.map((child) => (
        <FileNodeItem key={child.name} node={child} depth={depth + 1} />
      ))}
    </div>
  );
}

export function FileTree({ className }: FileTreeProps) {
  const files = useAppStore((s) => s.files);

  return (
    <div
      className={cn(
        "rounded-xl bg-bg-card border border-white/[0.06] overflow-hidden",
        className
      )}
    >
      <div className="px-3.5 py-2.5 border-b border-white/[0.06]">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
          Files Generated
        </span>
      </div>
      <div className="p-3 space-y-0.5 max-h-48 overflow-y-auto">
        <AnimatePresence>
          {files.map((node) => (
            <FileNodeItem key={node.name} node={node} />
          ))}
        </AnimatePresence>
        {files.length === 0 && (
          <p className="text-[10px] text-text-muted/40 py-2">Waiting...</p>
        )}
      </div>
    </div>
  );
}
