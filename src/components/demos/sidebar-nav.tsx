"use client";

import { useState } from "react";
import { ChevronRight, FolderOpen, Folder, FileText } from "lucide-react";

type Node = { name: string; children?: Node[] };
const tree: Node[] = [
  { name: "src", children: [
    { name: "components", children: [{ name: "Button.tsx" }, { name: "Card.tsx" }] },
    { name: "lib", children: [{ name: "utils.ts" }] },
  ]},
  { name: "public", children: [{ name: "favicon.ico" }] },
  { name: "package.json" },
];

function NodeView({ node, depth = 0 }: { node: Node; depth?: number }) {
  const [open, setOpen] = useState(depth < 1);
  const hasChildren = !!node.children?.length;
  return (
    <div>
      <button onClick={() => hasChildren && setOpen((o) => !o)} className="flex items-center gap-1 hover:bg-accent rounded px-1 py-0.5 w-full text-left text-sm" style={{ paddingLeft: depth * 12 + 4 }}>
        {hasChildren ? <ChevronRight className={`size-3 transition-transform ${open ? "rotate-90" : ""}`} /> : <span className="size-3" />}
        {hasChildren ? (open ? <FolderOpen className="size-3.5 text-blue-500" /> : <Folder className="size-3.5 text-blue-500" />) : <FileText className="size-3.5 text-muted-foreground" />}
        {node.name}
      </button>
      {open && node.children?.map((c) => <NodeView key={c.name} node={c} depth={depth + 1} />)}
    </div>
  );
}

export default function SidebarNav() {
  return <div className="rounded-md border bg-background p-2 max-w-xs font-mono">{tree.map((n) => <NodeView key={n.name} node={n} />)}</div>;
}
