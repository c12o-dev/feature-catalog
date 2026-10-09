"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight, CalendarClock, Command, FolderKanban, MoonStar, Sparkles, X, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const slides = [
  { icon: Sparkles, title: "Tsumiki 3.0 へようこそ", body: "ナビゲーションを一新し、よく使う操作が 2 クリック少なくなりました。" },
  { icon: Command, title: "⌘K でどこへでも", body: "ページ・メンバー・設定をコマンドパレットから横断して検索できます。" },
  { icon: MoonStar, title: "ダークモードに対応", body: "OS の設定に追従します。表示設定から手動でも切り替えられます。" },
];

export default function WhatsNew() {
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(true);
  const [i, setI] = useState(0);
  const [banner, setBanner] = useState(true);
  const last = i === slides.length - 1;
  const S = slides[i];

  const close = () => setOpen(false);
  const reopen = () => {
    setI(0);
    setOpen(true);
  };

  return (
    <div className="relative min-h-80 overflow-hidden rounded-lg border bg-background text-sm">
      {/* app behind the splash */}
      <header className="flex items-center gap-2 border-b px-3 py-2">
        <FolderKanban className="size-4 text-primary" />
        <span className="font-semibold">Tsumiki</span>
        <button
          type="button"
          onClick={reopen}
          className="ml-auto inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs text-muted-foreground hover:text-foreground"
        >
          <Zap className="size-3" /> v3.0 の新機能
        </button>
      </header>
      {banner && (
        <div className="flex items-start gap-2 border-b bg-muted/50 px-3 py-2 text-xs">
          <CalendarClock className="mt-0.5 size-3.5 shrink-0 text-primary" />
          <p className="flex-1">
            <span className="font-medium">10/15 に旧エディタの提供を終了します。</span>
            <span className="text-muted-foreground"> 新エディタは今すぐ試せます。</span>
          </p>
          <button type="button" aria-label="お知らせを閉じる" onClick={() => setBanner(false)} className="rounded p-0.5 text-muted-foreground hover:text-foreground">
            <X className="size-3.5" />
          </button>
        </div>
      )}
      <div className="space-y-2 p-3">
        {["秋のキャンペーン LP", "請求フロー改修", "社内ポータル v3"].map((n) => (
          <div key={n} className="rounded-md border bg-card px-3 py-2">{n}</div>
        ))}
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            key="splash"
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduced ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0 }}
            className="absolute inset-0 z-10 grid place-items-center bg-black/50 p-4"
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="wn-title"
              initial={reduced ? false : { opacity: 0, scale: 0.94, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={reduced ? undefined : { opacity: 0, scale: 0.97 }}
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
              onKeyDown={(e) => e.key === "Escape" && close()}
              className="w-full max-w-xs rounded-xl border bg-popover p-5 text-popover-foreground shadow-xl"
            >
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary tabular-nums">v3.0.0</span>
                <button type="button" onClick={close} className="text-xs text-muted-foreground hover:text-foreground">
                  スキップ
                </button>
              </div>
              <div className="relative mt-4 h-32" aria-live="polite">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={i}
                    initial={reduced ? false : { opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={reduced ? undefined : { opacity: 0, x: -16 }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0"
                  >
                    <div className="grid size-10 place-items-center rounded-lg bg-primary text-primary-foreground">
                      <S.icon className="size-5" />
                    </div>
                    <h3 id="wn-title" className="mt-3 font-semibold">{S.title}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{S.body}</p>
                  </motion.div>
                </AnimatePresence>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex gap-1.5">
                  {slides.map((s, n) => (
                    <button
                      key={s.title}
                      type="button"
                      aria-label={`${n + 1} 枚目`}
                      aria-current={n === i ? "step" : undefined}
                      onClick={() => setI(n)}
                      className={`h-1.5 rounded-full transition-all ${n === i ? "w-5 bg-primary" : "w-1.5 bg-muted-foreground/30"}`}
                    />
                  ))}
                </div>
                <Button size="sm" onClick={() => (last ? close() : setI(i + 1))}>
                  {last ? "はじめる" : <>次へ <ArrowRight /></>}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
