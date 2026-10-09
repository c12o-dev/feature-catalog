"use client";

import { useId, useState } from "react";
import { Cookie, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

type Prefs = { analytics: boolean; marketing: boolean };
type Saved = Prefs & { at: string; via: string };

const CATEGORIES = [
  { key: "necessary", label: "必須", desc: "ログイン状態やカートの保持に使います。無効にできません。" },
  { key: "analytics", label: "分析", desc: "ページの閲覧状況を匿名で計測します。" },
  { key: "marketing", label: "広告", desc: "興味に合わせた広告の表示に使います。" },
] as const;

export default function CookieBanner() {
  const [mode, setMode] = useState<"banner" | "custom" | "closed">("banner");
  const [prefs, setPrefs] = useState<Prefs>({ analytics: false, marketing: false });
  const [saved, setSaved] = useState<Saved | null>(null);
  const titleId = useId();

  const save = (p: Prefs, via: string) => {
    setPrefs(p);
    // A real site would persist this (cookie / server) with a timestamp and policy version.
    setSaved({ ...p, at: "2026-10-01 09:00", via });
    setMode("closed");
  };

  return (
    <div className="relative min-h-[22rem] w-full overflow-hidden rounded-lg border bg-background">
      {/* mock page */}
      <div className="space-y-2 p-4" aria-hidden={mode !== "closed"}>
        <div className="h-3 w-24 rounded bg-muted" />
        <div className="h-2 w-full rounded bg-muted/70" />
        <div className="h-2 w-5/6 rounded bg-muted/70" />
        <div className="h-2 w-2/3 rounded bg-muted/70" />
      </div>

      <div className="px-4" aria-live="polite">
        {mode === "closed" && saved && (
          <div className="space-y-2 rounded-md border bg-card p-3 text-xs">
            <div className="font-medium">同意設定を保存しました</div>
            <ul className="flex flex-wrap gap-1.5">
              <li className="rounded bg-muted px-1.5 py-0.5">必須: 有効</li>
              <li className="rounded bg-muted px-1.5 py-0.5">分析: {saved.analytics ? "有効" : "無効"}</li>
              <li className="rounded bg-muted px-1.5 py-0.5">広告: {saved.marketing ? "有効" : "無効"}</li>
            </ul>
            <div className="text-muted-foreground">
              {saved.at} · {saved.via}
            </div>
            <Button variant="link" size="sm" className="h-auto px-0" onClick={() => setMode("custom")}>
              <Settings2 className="size-3.5" />
              Cookie 設定を変更
            </Button>
          </div>
        )}
      </div>

      {mode === "banner" && (
        <section aria-labelledby={titleId} className="absolute inset-x-3 bottom-3 rounded-lg border bg-popover p-4 text-popover-foreground shadow-lg">
          <div className="flex items-start gap-3">
            <Cookie className="mt-0.5 size-5 shrink-0 text-amber-600 dark:text-amber-400" aria-hidden />
            <div className="text-sm">
              <h3 id={titleId} className="font-medium">Cookie の使用について</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                サイトの改善と広告の最適化のため Cookie を使用します。必須以外は選択できます。
              </p>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap justify-end gap-2">
            <Button size="sm" variant="ghost" onClick={() => setMode("custom")}>
              カスタマイズ
            </Button>
            {/* Reject and accept are given equal visual weight. */}
            <Button size="sm" variant="outline" onClick={() => save({ analytics: false, marketing: false }, "必須のみ")}>
              必須のみ
            </Button>
            <Button size="sm" variant="outline" onClick={() => save({ analytics: true, marketing: true }, "すべて許可")}>
              すべて許可
            </Button>
          </div>
        </section>
      )}

      {mode === "custom" && (
        <div className="absolute inset-0 grid place-items-end bg-black/30 p-3 sm:place-items-center">
          <section role="dialog" aria-modal="true" aria-labelledby={titleId} className="w-full max-w-md rounded-lg border bg-popover p-4 text-popover-foreground shadow-lg">
            <h3 id={titleId} className="text-sm font-medium">Cookie 設定</h3>
            <ul className="mt-3 divide-y">
              {CATEGORIES.map((c) => {
                const fixed = c.key === "necessary";
                const checked = fixed ? true : prefs[c.key];
                return (
                  <li key={c.key} className="flex items-start justify-between gap-3 py-2.5">
                    <div>
                      <div id={`${titleId}-${c.key}`} className="text-sm">{c.label}</div>
                      <p className="text-xs text-muted-foreground">{c.desc}</p>
                    </div>
                    <Switch
                      className="mt-0.5"
                      aria-labelledby={`${titleId}-${c.key}`}
                      checked={checked}
                      disabled={fixed}
                      onCheckedChange={(v) => !fixed && setPrefs((p) => ({ ...p, [c.key]: v }))}
                    />
                  </li>
                );
              })}
            </ul>
            <div className="mt-3 flex flex-wrap justify-end gap-2">
              <Button size="sm" variant="ghost" onClick={() => setMode(saved ? "closed" : "banner")}>
                戻る
              </Button>
              <Button size="sm" onClick={() => save(prefs, "カスタマイズ")}>
                選択内容を保存
              </Button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
