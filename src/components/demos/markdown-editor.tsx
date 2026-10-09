"use client";

import { Fragment, useState } from "react";

const initial = "# リリースノート\n\n**v2.4** では検索が *より速く* なりました。\n\n## 変更点\n\n- `⌘K` で全体検索\n- ダークモードの改善\n\n```ts\nconst x = 1;\n```\n\n<script>alert(1)</script> はそのまま文字として表示されます。";

type Mode = "edit" | "split" | "preview";
const modes: { v: Mode; l: string }[] = [{ v: "edit", l: "編集" }, { v: "split", l: "分割" }, { v: "preview", l: "プレビュー" }];

/** Inline: **bold**, *italic*, `code`. Returns React nodes, so text is always escaped. */
function inline(text: string, key: string) {
  const out: React.ReactNode[] = [];
  const re = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;
  let last = 0, i = 0;
  for (const m of text.matchAll(re)) {
    if (m.index! > last) out.push(text.slice(last, m.index));
    const t = m[0];
    const k = `${key}-${i++}`;
    if (t.startsWith("**")) out.push(<strong key={k}>{t.slice(2, -2)}</strong>);
    else if (t.startsWith("`")) out.push(<code key={k} className="rounded bg-muted px-1 py-0.5 font-mono text-[0.85em]">{t.slice(1, -1)}</code>);
    else out.push(<em key={k}>{t.slice(1, -1)}</em>);
    last = m.index! + t.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

function render(src: string) {
  const lines = src.split("\n");
  const blocks: React.ReactNode[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const k = `b${i}`;
    if (line.startsWith("```")) {
      const body: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) body.push(lines[i++]);
      i++;
      blocks.push(<pre key={k} className="overflow-x-auto rounded-md bg-muted p-2 font-mono text-xs">{body.join("\n")}</pre>);
    } else if (/^#{1,3} /.test(line)) {
      const level = line.indexOf(" ");
      const text = line.slice(level + 1);
      blocks.push(level === 1
        ? <h1 key={k} className="text-lg font-semibold">{inline(text, k)}</h1>
        : <h2 key={k} className="text-base font-semibold">{inline(text, k)}</h2>);
      i++;
    } else if (/^- /.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^- /.test(lines[i])) items.push(lines[i++].slice(2));
      blocks.push(<ul key={k} className="list-disc space-y-0.5 pl-5">{items.map((t, j) => <li key={j}>{inline(t, `${k}-${j}`)}</li>)}</ul>);
    } else if (line.trim() === "") {
      i++;
    } else {
      const para: string[] = [];
      while (i < lines.length && lines[i].trim() !== "" && !/^(#{1,3} |- |```)/.test(lines[i])) para.push(lines[i++]);
      blocks.push(<p key={k}>{para.map((p, j) => <Fragment key={j}>{j > 0 && <br />}{inline(p, `${k}-${j}`)}</Fragment>)}</p>);
    }
  }
  return blocks;
}

export default function MarkdownEditor() {
  const [v, setV] = useState(initial);
  const [mode, setMode] = useState<Mode>("split");
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <div role="group" aria-label="表示モード" className="inline-flex rounded-md border p-0.5">
          {modes.map((m) => (
            <button
              key={m.v}
              aria-pressed={mode === m.v}
              onClick={() => setMode(m.v)}
              className={`rounded px-2.5 py-1 text-xs transition-colors ${mode === m.v ? "bg-muted font-medium" : "text-muted-foreground hover:text-foreground"}`}
            >
              {m.l}
            </button>
          ))}
        </div>
        <span className="text-xs text-muted-foreground tabular-nums">{v.length} 文字</span>
      </div>
      <div className={`grid gap-2 ${mode === "split" ? "sm:grid-cols-2" : ""}`}>
        {mode !== "preview" && (
          <textarea
            aria-label="Markdown 入力"
            value={v}
            onChange={(e) => setV(e.target.value)}
            spellCheck={false}
            className="h-56 w-full resize-none rounded-md border bg-background p-3 font-mono text-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        )}
        {mode !== "edit" && (
          <div aria-label="プレビュー" role="region" className="h-56 space-y-2 overflow-y-auto rounded-md border bg-card p-3 text-sm break-words">
            {render(v)}
          </div>
        )}
      </div>
    </div>
  );
}
