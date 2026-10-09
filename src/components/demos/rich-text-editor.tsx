"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { Bold, Code, Heading2, Italic, List, Pilcrow, Quote, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type BlockType = "p" | "h2" | "ul" | "quote" | "code";
type Block = { id: number; type: BlockType; init: string };

const blockTypes: { type: BlockType; label: string; hint: string; icon: LucideIcon; keys: string }[] = [
  { type: "p", label: "テキスト", hint: "通常の段落", icon: Pilcrow, keys: "text p tekisuto" },
  { type: "h2", label: "見出し", hint: "セクションの見出し", icon: Heading2, keys: "heading h2 midashi" },
  { type: "ul", label: "箇条書き", hint: "シンプルなリスト", icon: List, keys: "list ul bullet risuto" },
  { type: "quote", label: "引用", hint: "引用ブロック", icon: Quote, keys: "quote inyou" },
  { type: "code", label: "コード", hint: "等幅のコード", icon: Code, keys: "code kodo" },
];

const styles: Record<BlockType, string> = {
  p: "text-sm",
  h2: "text-lg font-semibold tracking-tight",
  ul: "text-sm pl-5 relative before:absolute before:left-1.5 before:top-[0.6em] before:size-1.5 before:rounded-full before:bg-foreground/60",
  quote: "text-sm border-l-2 border-foreground/30 pl-3 text-muted-foreground",
  code: "font-mono text-xs rounded-md bg-muted px-3 py-2",
};

const initial: Block[] = [
  { id: 1, type: "h2", init: "週次ミーティング" },
  { id: 2, type: "p", init: "空の行で「/」を入力するとブロックを挿入できます。" },
  { id: 3, type: "ul", init: "リリース日を 10/15 に確定" },
  { id: 4, type: "p", init: "" },
];

export default function RichTextEditor() {
  const [blocks, setBlocks] = useState(initial);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [menu, setMenu] = useState<{ id: number; query: string; index: number } | null>(null);
  const els = useRef(new Map<number, HTMLDivElement>());
  const nextId = useRef(5);
  const pendingFocus = useRef<number | null>(null);

  useLayoutEffect(() => {
    if (pendingFocus.current === null) return;
    const el = els.current.get(pendingFocus.current);
    pendingFocus.current = null;
    if (!el) return;
    el.focus();
    const r = document.createRange();
    r.selectNodeContents(el);
    r.collapse(false);
    const sel = window.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(r);
  }, [blocks, menu]);

  const options = menu ? blockTypes.filter((b) => (b.label + b.keys).toLowerCase().includes(menu.query.toLowerCase())) : [];

  const apply = (id: number, type: BlockType) => {
    const el = els.current.get(id);
    if (el) el.textContent = "";
    setBlocks((bs) => bs.map((b) => (b.id === id ? { ...b, type } : b)));
    setMenu(null);
    pendingFocus.current = id;
  };

  const setType = (type: BlockType) => {
    if (activeId === null) return;
    setBlocks((bs) => bs.map((b) => (b.id === activeId ? { ...b, type } : b)));
    pendingFocus.current = activeId;
  };

  const inline = (cmd: "bold" | "italic") => {
    document.execCommand(cmd);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>, b: Block, i: number) => {
    if (e.nativeEvent.isComposing) return;
    if (menu && menu.id === b.id) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        const n = options.length || 1;
        setMenu({ ...menu, index: (menu.index + (e.key === "ArrowDown" ? 1 : -1) + n) % n });
        return;
      }
      if (e.key === "Enter") {
        e.preventDefault();
        const opt = options[menu.index];
        if (opt) apply(b.id, opt.type);
        return;
      }
      if (e.key === "Escape") {
        e.preventDefault();
        setMenu(null);
        return;
      }
    }
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const id = nextId.current++;
      const type: BlockType = b.type === "ul" ? "ul" : "p";
      setBlocks((bs) => [...bs.slice(0, i + 1), { id, type, init: "" }, ...bs.slice(i + 1)]);
      pendingFocus.current = id;
    } else if (e.key === "Backspace" && !e.currentTarget.textContent && blocks.length > 1) {
      e.preventDefault();
      if (b.type !== "p") {
        setBlocks((bs) => bs.map((x) => (x.id === b.id ? { ...x, type: "p" } : x)));
        return;
      }
      const prev = blocks[i - 1] ?? blocks[i + 1];
      setBlocks((bs) => bs.filter((x) => x.id !== b.id));
      pendingFocus.current = prev.id;
    }
  };

  const onInput = (e: React.FormEvent<HTMLDivElement>, b: Block) => {
    const text = e.currentTarget.textContent ?? "";
    if (text.startsWith("/") && !text.includes(" ")) setMenu({ id: b.id, query: text.slice(1), index: 0 });
    else if (menu) setMenu(null);
  };

  const active = blocks.find((b) => b.id === activeId);
  const tools: { label: string; icon: LucideIcon; onClick: () => void; pressed?: boolean }[] = [
    { label: "太字", icon: Bold, onClick: () => inline("bold") },
    { label: "斜体", icon: Italic, onClick: () => inline("italic") },
    ...blockTypes
      .filter((t) => t.type !== "p")
      .map((t) => ({ label: t.label, icon: t.icon, onClick: () => setType(active?.type === t.type ? "p" : t.type), pressed: active?.type === t.type })),
  ];

  return (
    <div className="relative min-h-[300px] overflow-visible rounded-lg border bg-background">
      <div role="toolbar" aria-label="書式" className="flex flex-wrap items-center gap-0.5 border-b bg-muted/40 px-2 py-1">
        {tools.map((t, i) => (
          <button
            key={t.label}
            type="button"
            aria-label={t.label}
            title={t.label}
            aria-pressed={t.pressed}
            onMouseDown={(e) => e.preventDefault()}
            onClick={t.onClick}
            className={cn(
              "grid size-7 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground aria-pressed:bg-muted aria-pressed:text-foreground",
              i === 2 && "ml-1.5",
            )}
          >
            <t.icon className="size-3.5" />
          </button>
        ))}
      </div>
      <div className="space-y-1.5 p-4">
        {blocks.map((b, i) => {
          const menuOpen = menu?.id === b.id;
          return (
            <div key={b.id} className="relative">
              <div
                ref={(el) => {
                  if (el) {
                    if (!el.dataset.init) {
                      el.textContent = b.init;
                      el.dataset.init = "1";
                    }
                    els.current.set(b.id, el);
                  } else els.current.delete(b.id);
                }}
                contentEditable
                suppressContentEditableWarning
                role="combobox"
                aria-label={`ブロック ${i + 1}`}
                aria-autocomplete="list"
                aria-expanded={menuOpen}
                aria-controls={menuOpen ? "rte-menu" : undefined}
                aria-activedescendant={menuOpen && options[menu.index] ? `rte-opt-${options[menu.index].type}` : undefined}
                data-placeholder={b.type === "p" ? "「/」でブロックを挿入" : "入力…"}
                onFocus={() => setActiveId(b.id)}
                onKeyDown={(e) => onKeyDown(e, b, i)}
                onInput={(e) => onInput(e, b)}
                onBlur={() => menuOpen && setMenu(null)}
                className={cn(
                  "min-h-[1.5em] rounded-sm leading-relaxed outline-none empty:before:text-muted-foreground/60 focus:empty:before:content-[attr(data-placeholder)]",
                  styles[b.type],
                )}
              />
              {menuOpen && (
                <ul
                  id="rte-menu"
                  role="listbox"
                  aria-label="ブロックの種類"
                  className="absolute left-0 top-full z-20 mt-1 w-56 max-w-full rounded-md border bg-popover p-1 text-popover-foreground shadow-lg"
                >
                  {options.length === 0 && <li className="px-2 py-1.5 text-xs text-muted-foreground">該当なし</li>}
                  {options.map((o, oi) => (
                    <li
                      key={o.type}
                      id={`rte-opt-${o.type}`}
                      role="option"
                      aria-selected={oi === menu.index}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        apply(b.id, o.type);
                      }}
                      className="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 aria-selected:bg-muted"
                    >
                      <span className="grid size-7 place-items-center rounded-md border bg-background">
                        <o.icon className="size-3.5" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm">{o.label}</span>
                        <span className="block text-xs text-muted-foreground">{o.hint}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
