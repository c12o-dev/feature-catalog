"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { CheckCircle2, Info, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Toast = { id: number; title: string; body: string; kind: "success" | "info" };

const MESSAGES: Omit<Toast, "id">[] = [
  { title: "保存しました", body: "「10月の企画書」を更新しました", kind: "success" },
  { title: "共有しました", body: "佐藤さんに編集権限を付与しました", kind: "info" },
  { title: "コピーしました", body: "リンクをクリップボードにコピー", kind: "success" },
  { title: "アップロード完了", body: "3 件のファイルを追加しました", kind: "info" },
];

const H = 60; // toast height
const GAP = 8;
const MAX = 3;
const LIFETIME = 5000;

export default function ToastSlide() {
  const reduce = useReducedMotion();
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [expanded, setExpanded] = useState(false);
  const seq = useRef(0);
  const timers = useRef(new Map<number, ReturnType<typeof setTimeout>>());

  useEffect(() => {
    const map = timers.current;
    return () => map.forEach(clearTimeout);
  }, []);

  const dismiss = (id: number) => {
    const t = timers.current.get(id);
    if (t) clearTimeout(t);
    timers.current.delete(id);
    setToasts((ts) => ts.filter((x) => x.id !== id));
  };

  const push = () => {
    const id = ++seq.current;
    const m = MESSAGES[(id - 1) % MESSAGES.length];
    setToasts((ts) => [...ts, { id, ...m }].slice(-MAX));
    timers.current.set(
      id,
      setTimeout(() => dismiss(id), LIFETIME),
    );
  };

  // newest last; index 0 = front (newest)
  const ordered = [...toasts].reverse();

  return (
    <div className="@container relative h-80 w-full overflow-hidden rounded-lg border bg-background">
      <div className="space-y-2 p-4">
        <div className="text-sm font-medium">トースト通知</div>
        <p className="text-xs text-muted-foreground">下から滑り込み、右へスワイプ（または ×）で閉じます。重なったトーストはホバー・フォーカスで展開します。</p>
        <Button size="sm" onClick={push}>
          通知を出す
        </Button>
      </div>

      <section
        aria-label="通知"
        aria-live="polite"
        className={cn("absolute inset-x-3 bottom-3 @md:left-auto @md:w-72", toasts.length === 0 && "pointer-events-none")}
        style={{ height: expanded ? MAX * (H + GAP) : H + 2 * 10 }}
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
        onFocus={() => setExpanded(true)}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) setExpanded(false);
        }}
      >
        <AnimatePresence initial={false}>
          {ordered.map((t, i) => {
            const y = expanded ? -i * (H + GAP) : -i * 10;
            const scale = expanded ? 1 : 1 - i * 0.05;
            return (
              <motion.div
                key={t.id}
                className="absolute inset-x-0 bottom-0 flex cursor-grab touch-pan-y items-start gap-2.5 rounded-lg border bg-popover p-3 text-popover-foreground shadow-lg active:cursor-grabbing"
                style={{ height: H, zIndex: MAX - i, transformOrigin: "bottom center" }}
                initial={reduce ? { opacity: 0 } : { y: H + 24, opacity: 0 }}
                animate={{ y: reduce ? 0 : y, scale: reduce ? 1 : scale, opacity: i >= MAX ? 0 : 1, x: 0 }}
                exit={reduce ? { opacity: 0, transition: { duration: 0 } } : { x: "110%", opacity: 0, transition: { duration: 0.2 } }}
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
                drag={reduce ? false : "x"}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={{ left: 0.05, right: 0.9 }}
                onDragEnd={(_, info) => {
                  if (info.offset.x > 80 || info.velocity.x > 500) dismiss(t.id);
                }}
              >
                {t.kind === "success" ? (
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden />
                ) : (
                  <Info className="mt-0.5 size-4 shrink-0 text-sky-600 dark:text-sky-400" aria-hidden />
                )}
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{t.title}</div>
                  <div className="truncate text-xs text-muted-foreground">{t.body}</div>
                </div>
                <button
                  type="button"
                  onClick={() => dismiss(t.id)}
                  onPointerDown={(e) => e.stopPropagation()}
                  aria-label={`「${t.title}」を閉じる`}
                  className="grid size-6 shrink-0 place-items-center rounded text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <X className="size-3.5" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </section>
    </div>
  );
}
