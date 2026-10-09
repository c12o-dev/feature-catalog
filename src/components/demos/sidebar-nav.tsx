"use client";

import { useMemo, useRef, useState, type KeyboardEvent } from "react";
import { ChevronRight, FolderOpen, Folder, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

type Node = { id: string; name: string; children?: Node[] };
const tree: Node[] = [
  {
    id: "src",
    name: "src",
    children: [
      { id: "src/components", name: "components", children: [{ id: "src/components/Button.tsx", name: "Button.tsx" }, { id: "src/components/Card.tsx", name: "Card.tsx" }] },
      { id: "src/lib", name: "lib", children: [{ id: "src/lib/utils.ts", name: "utils.ts" }] },
      { id: "src/app.tsx", name: "app.tsx" },
    ],
  },
  { id: "public", name: "public", children: [{ id: "public/favicon.ico", name: "favicon.ico" }] },
  { id: "package.json", name: "package.json" },
];

type Row = { node: Node; depth: number; parent: string | null; posinset: number; setsize: number };

function flatten(nodes: Node[], open: Set<string>, depth = 0, parent: string | null = null, out: Row[] = []) {
  nodes.forEach((n, i) => {
    out.push({ node: n, depth, parent, posinset: i + 1, setsize: nodes.length });
    if (n.children && open.has(n.id)) flatten(n.children, open, depth + 1, n.id, out);
  });
  return out;
}

export default function SidebarNav() {
  const [open, setOpen] = useState<Set<string>>(() => new Set(["src", "src/components"]));
  const [active, setActive] = useState("src/components/Button.tsx");
  const [focusId, setFocusId] = useState("src/components/Button.tsx");
  const refs = useRef(new Map<string, HTMLDivElement>());

  const rows = useMemo(() => flatten(tree, open), [open]);

  const focus = (id: string) => {
    setFocusId(id);
    refs.current.get(id)?.focus();
  };
  const toggle = (id: string, to?: boolean) =>
    setOpen((s) => {
      const next = new Set(s);
      const want = to ?? !next.has(id);
      if (want) next.add(id);
      else next.delete(id);
      return next;
    });

  const onKey = (e: KeyboardEvent, i: number) => {
    const row = rows[i];
    const id = row.node.id;
    const isFolder = !!row.node.children;
    const isOpen = open.has(id);
    switch (e.key) {
      case "ArrowDown":
        if (rows[i + 1]) focus(rows[i + 1].node.id);
        break;
      case "ArrowUp":
        if (rows[i - 1]) focus(rows[i - 1].node.id);
        break;
      case "Home":
        focus(rows[0].node.id);
        break;
      case "End":
        focus(rows[rows.length - 1].node.id);
        break;
      case "ArrowRight":
        if (isFolder && !isOpen) toggle(id, true);
        else if (isFolder && rows[i + 1]) focus(rows[i + 1].node.id);
        break;
      case "ArrowLeft":
        if (isFolder && isOpen) toggle(id, false);
        else if (row.parent) focus(row.parent);
        break;
      case "Enter":
      case " ":
        if (isFolder) toggle(id);
        else setActive(id);
        break;
      default:
        return;
    }
    e.preventDefault();
  };

  // Make sure the roving tabindex target is visible after a collapse.
  const tabTarget = rows.some((r) => r.node.id === focusId) ? focusId : rows[0].node.id;

  return (
    <nav aria-label="ファイル" className="w-full max-w-xs rounded-md border bg-card p-1.5">
      <div role="tree" aria-label="プロジェクト" className="font-mono text-sm">
        {rows.map((row, i) => {
          const { node, depth } = row;
          const isFolder = !!node.children;
          const isOpen = open.has(node.id);
          const selected = active === node.id;
          return (
            <div
              key={node.id}
              ref={(el) => {
                if (el) refs.current.set(node.id, el);
                else refs.current.delete(node.id);
              }}
              role="treeitem"
              aria-level={depth + 1}
              aria-posinset={row.posinset}
              aria-setsize={row.setsize}
              aria-expanded={isFolder ? isOpen : undefined}
              aria-selected={isFolder ? undefined : selected}
              tabIndex={tabTarget === node.id ? 0 : -1}
              onKeyDown={(e) => onKey(e, i)}
              onFocus={() => setFocusId(node.id)}
              onClick={() => (isFolder ? toggle(node.id) : setActive(node.id))}
              className={cn(
                "flex w-full cursor-pointer items-center gap-1.5 rounded px-1.5 py-1 outline-none select-none focus-visible:ring-2 focus-visible:ring-ring/60",
                selected ? "bg-primary/10 text-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
              style={{ paddingLeft: depth * 14 + 6 }}
            >
              {isFolder ? (
                <ChevronRight className={cn("size-3.5 shrink-0 transition-transform", isOpen && "rotate-90")} aria-hidden />
              ) : (
                <span className="size-3.5 shrink-0" aria-hidden />
              )}
              {isFolder ? (
                isOpen ? <FolderOpen className="size-3.5 shrink-0 text-sky-600 dark:text-sky-400" aria-hidden /> : <Folder className="size-3.5 shrink-0 text-sky-600 dark:text-sky-400" aria-hidden />
              ) : (
                <FileText className="size-3.5 shrink-0" aria-hidden />
              )}
              <span className="truncate">{node.name}</span>
            </div>
          );
        })}
      </div>
    </nav>
  );
}
