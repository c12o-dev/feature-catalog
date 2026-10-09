"use client";

import { useEffect, useId, useState } from "react";
import { Check, Copy, AlertCircle, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

type Opt<T extends string> = { value: T; label: string };

function Segmented<T extends string>({
  legend,
  name,
  value,
  options,
  onChange,
}: {
  legend: string;
  name: string;
  value: T;
  options: Opt<T>[];
  onChange: (v: T) => void;
}) {
  return (
    <fieldset className="min-w-0">
      <legend className="mb-1 text-xs text-muted-foreground">{legend}</legend>
      <div className="inline-flex rounded-md border bg-muted/50 p-0.5">
        {options.map((o) => (
          <label
            key={o.value}
            className="cursor-pointer rounded px-2.5 py-1 text-xs font-medium text-muted-foreground has-checked:bg-background has-checked:text-foreground has-checked:shadow-sm has-focus-visible:ring-2 has-focus-visible:ring-ring/50"
          >
            <input
              type="radio"
              name={name}
              value={o.value}
              checked={value === o.value}
              onChange={() => onChange(o.value)}
              className="sr-only"
            />
            {o.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

const SRC = "https://player.example.com/v/ep42";

export default function EmbedCode() {
  const id = useId();
  const [kind, setKind] = useState<"iframe" | "script">("iframe");
  const [size, setSize] = useState<"responsive" | "fixed">("responsive");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [autoplay, setAutoplay] = useState(false);
  const [copy, setCopy] = useState<"idle" | "ok" | "error">("idle");

  useEffect(() => {
    if (copy === "idle") return;
    const t = setTimeout(() => setCopy("idle"), 1800);
    return () => clearTimeout(t);
  }, [copy]);

  const params = [`theme=${theme}`, autoplay && "autoplay=1"].filter(Boolean).join("&");
  const url = `${SRC}?${params}`;
  const dims = size === "fixed" ? `width="560" height="315"` : `style="width:100%;aspect-ratio:16/9"`;

  const snippet =
    kind === "iframe"
      ? `<iframe src="${url}"\n  ${dims}\n  title="第 42 回 週次ふりかえり"\n  loading="lazy" allowfullscreen></iframe>`
      : `<div class="ex-player" data-id="ep42"\n  data-theme="${theme}"${autoplay ? ` data-autoplay` : ""}${size === "fixed" ? ` data-width="560"` : ""}></div>\n<script async src="https://player.example.com/embed.js"></script>`;

  const doCopy = async () => {
    try {
      await navigator.clipboard.writeText(snippet);
      setCopy("ok");
    } catch {
      setCopy("error");
    }
  };

  const dark = theme === "dark";

  return (
    <div className="mx-auto grid w-full max-w-2xl gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      <div className="space-y-3">
        <Segmented legend="形式" name={`${id}-kind`} value={kind} onChange={setKind} options={[{ value: "iframe", label: "iframe" }, { value: "script", label: "script" }]} />
        <Segmented legend="サイズ" name={`${id}-size`} value={size} onChange={setSize} options={[{ value: "responsive", label: "レスポンシブ" }, { value: "fixed", label: "560×315" }]} />
        <Segmented legend="テーマ" name={`${id}-theme`} value={theme} onChange={setTheme} options={[{ value: "light", label: "ライト" }, { value: "dark", label: "ダーク" }]} />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={autoplay} onChange={(e) => setAutoplay(e.target.checked)} className="size-4 accent-primary" />
          自動再生
        </label>
        <div
          aria-hidden
          className={`flex aspect-video items-center justify-center rounded-md border ${dark ? "border-zinc-800 bg-zinc-900 text-zinc-100" : "bg-white text-zinc-900"} ${size === "fixed" ? "max-w-[200px]" : "w-full"}`}
        >
          <div className="flex flex-col items-center gap-1.5">
            <span className={`grid size-8 place-items-center rounded-full ${dark ? "bg-white text-black" : "bg-black text-white"}`}>
              <Play className="size-3.5 translate-x-px" />
            </span>
            <span className="text-[10px] opacity-70">{autoplay ? "自動再生オン" : "プレビュー"}</span>
          </div>
        </div>
      </div>

      <div className="min-w-0 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">埋め込みコード</span>
          <Button size="sm" variant="outline" onClick={doCopy}>
            {copy === "ok" ? <Check /> : copy === "error" ? <AlertCircle /> : <Copy />}
            {copy === "ok" ? "コピーしました" : "コピー"}
          </Button>
        </div>
        <pre className="max-h-56 overflow-auto rounded-md border bg-muted/60 p-3 font-mono text-xs leading-relaxed whitespace-pre">
          <code>{snippet}</code>
        </pre>
        <p aria-live="polite" className={`text-xs ${copy === "error" ? "text-destructive" : "text-muted-foreground"}`}>
          {copy === "error" ? "コピーできませんでした。コードを選択して手動でコピーしてください。" : copy === "ok" ? "クリップボードにコピーしました" : ""}
        </p>
      </div>
    </div>
  );
}
