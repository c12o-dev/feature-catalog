"use client";

import { useRef, useState } from "react";
import { ChevronRight, FileCode2, FileText, Folder, FolderOpen } from "lucide-react";
import { cn } from "@/lib/utils";

type Node = { id: string; name: string; children?: Node[] };

const tree: Node[] = [
  {
    id: "src",
    name: "src",
    children: [
      {
        id: "app",
        name: "app",
        children: [
          { id: "layout", name: "layout.tsx" },
          { id: "page", name: "page.tsx" },
        ],
      },
      {
        id: "components",
        name: "components",
        children: [
          { id: "button", name: "button.tsx" },
          {
            id: "forms",
            name: "forms",
            children: [
              { id: "input", name: "input.tsx" },
              { id: "select", name: "select.tsx" },
            ],
          },
        ],
      },
      { id: "utils", name: "utils.ts" },
    ],
  },
  { id: "docs", name: "docs", children: [{ id: "guide", name: "guide.md" }] },
  { id: "readme", name: "README.md" },
];

type Flat = { node: Node; level: number; parent: string | null };

function flatten(nodes: Node[], expanded: Set<string>, level = 1, parent: string | null = null): Flat[] {
  return nodes.flatMap((n) => [
    { node: n, level, parent },
    ...(n.children && expanded.has(n.id) ? flatten(n.children, expanded, level + 1, n.id) : []),
  ]);
}

const collect = (nodes: Node[]): string[] => nodes.flatMap((n) => [n.id, ...(n.children ? collect(n.children) : [])]);
const allIds = new Set(collect(tree));

export default function TreeView() {
  const [expanded, setExpanded] = useState(() => new Set(["src", "components"]));
  const [focused, setFocused] = useState("src");
  const [selected, setSelected] = useState("button");
  const refs = useRef(new Map<string, HTMLLIElement>());

  const visible = flatten(tree, expanded);
  const focusItem = (id: string) => {
    setFocused(id);
    refs.current.get(id)?.focus();
  };
  const toggle = (id: string, open?: boolean) =>
    setExpanded((s) => {
      const next = new Set(s);
      if (open ?? !next.has(id)) next.add(id);
      else next.delete(id);
      return next;
    });

  const onKeyDown = (e: React.KeyboardEvent, f: Flat, idx: number) => {
    const isFolder = !!f.node.children;
    const open = expanded.has(f.node.id);
    switch (e.key) {
      case "ArrowDown":
        if (visible[idx + 1]) focusItem(visible[idx + 1].node.id);
        break;
      case "ArrowUp":
        if (visible[idx - 1]) focusItem(visible[idx - 1].node.id);
        break;
      case "ArrowRight":
        if (isFolder && !open) toggle(f.node.id, true);
        else if (isFolder && open && f.node.children?.[0]) focusItem(f.node.children[0].id);
        break;
      case "ArrowLeft":
        if (isFolder && open) toggle(f.node.id, false);
        else if (f.parent) focusItem(f.parent);
        break;
      case "Home":
        focusItem(visible[0].node.id);
        break;
      case "End":
        focusItem(visible[visible.length - 1].node.id);
        break;
      case "Enter":
      case " ":
        if (isFolder) toggle(f.node.id);
        else setSelected(f.node.id);
        break;
      default:
        return;
    }
    e.preventDefault();
    e.stopPropagation();
  };

  const selectedName = flatten(tree, allIds).find((v) => v.node.id === selected)?.node.name ?? selected;

  const render = (nodes: Node[], level: number, parent: string | null): React.ReactNode =>
    nodes.map((n) => {
      const isFolder = !!n.children;
      const open = expanded.has(n.id);
      const idx = visible.findIndex((v) => v.node.id === n.id);
      const f: Flat = { node: n, level, parent };
      const Icon = isFolder ? (open ? FolderOpen : Folder) : n.name.endsWith(".md") ? FileText : FileCode2;
      return (
        <li
          key={n.id}
          ref={(el) => {
            if (el) refs.current.set(n.id, el);
            else refs.current.delete(n.id);
          }}
          role="treeitem"
          aria-level={level}
          aria-expanded={isFolder ? open : undefined}
          aria-selected={isFolder ? undefined : selected === n.id}
          tabIndex={focused === n.id ? 0 : -1}
          onKeyDown={(e) => onKeyDown(e, f, idx)}
          onFocus={(e) => {
            if (e.target === e.currentTarget) setFocused(n.id);
          }}
          className="outline-none [&:focus-visible>div]:ring-2 [&:focus-visible>div]:ring-ring"
        >
          <div
            onClick={(e) => {
              e.stopPropagation();
              focusItem(n.id);
              if (isFolder) toggle(n.id);
              else setSelected(n.id);
            }}
            className={cn(
              "flex cursor-pointer items-center gap-1.5 rounded-md py-1 pr-2 text-sm hover:bg-muted",
              !isFolder && selected === n.id && "bg-primary/10 font-medium text-foreground hover:bg-primary/15",
            )}
            style={{ paddingLeft: `${(level - 1) * 14 + 4}px` }}
          >
            <ChevronRight
              aria-hidden
              className={cn("size-3.5 shrink-0 text-muted-foreground transition-transform", open && "rotate-90", !isFolder && "invisible")}
            />
            <Icon aria-hidden className={cn("size-4 shrink-0", isFolder ? "text-amber-500 dark:text-amber-400" : "text-muted-foreground")} />
            <span className="truncate">{n.name}</span>
          </div>
          {isFolder && open && (
            <ul role="group">{render(n.children!, level + 1, n.id)}</ul>
          )}
        </li>
      );
    });

  return (
    <div className="mx-auto w-full max-w-sm overflow-hidden rounded-lg border bg-background">
      <div className="flex items-center justify-between border-b px-3 py-2">
        <span className="text-xs font-medium text-muted-foreground">エクスプローラー</span>
        <span className="truncate pl-2 text-xs text-muted-foreground" aria-live="polite">
          選択中: <span className="font-mono text-foreground">{selectedName}</span>
        </span>
      </div>
      <ul role="tree" aria-label="プロジェクトのファイル" className="p-1.5">
        {render(tree, 1, null)}
      </ul>
      <p className="border-t px-3 py-2 text-xs text-muted-foreground">↑↓ で移動 · → ← で開閉 · Enter で選択</p>
    </div>
  );
}
