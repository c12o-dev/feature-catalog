"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Bug, CheckCircle2, Lightbulb, MessageSquare, MessageSquareWarning, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const KINDS = [
  { id: "bug", label: "不具合", icon: Bug },
  { id: "idea", label: "改善案", icon: Lightbulb },
  { id: "other", label: "その他", icon: MessageSquare },
] as const;

export default function FeedbackButton() {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [kind, setKind] = useState<(typeof KINDS)[number]["id"]>("bug");
  const [text, setText] = useState("");
  const [sent, setSent] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const area = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (open && !sent) area.current?.focus();
  }, [open, sent]);

  const close = () => {
    setOpen(false);
    trigger.current?.focus();
  };

  return (
    <div className="relative h-80 w-full overflow-hidden rounded-lg border bg-background">
      <div className="space-y-2 p-4" aria-hidden={open}>
        <div className="text-sm font-medium">請求書一覧</div>
        {["INV-0931", "INV-0930", "INV-0929"].map((n) => (
          <div key={n} className="flex justify-between rounded-md border bg-card px-3 py-2 text-xs">
            <span className="font-mono">{n}</span>
            <span className="text-muted-foreground">支払済み</span>
          </div>
        ))}
      </div>

      {!open && (
        <button
          ref={trigger}
          type="button"
          onClick={() => {
            setSent(false);
            setOpen(true);
          }}
          className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-2 text-xs font-medium text-primary-foreground shadow-lg"
        >
          <MessageSquareWarning className="size-4" aria-hidden />
          問題を報告
        </button>
      )}

      {open && (
        <div
          role="dialog"
          aria-labelledby={`${id}-title`}
          onKeyDown={(e) => e.key === "Escape" && close()}
          className="absolute inset-x-3 bottom-3 rounded-lg border bg-popover p-3 text-popover-foreground shadow-xl @container"
        >
          <div className="mb-2 flex items-center justify-between">
            <span id={`${id}-title`} className="text-sm font-medium">
              フィードバック
            </span>
            <button type="button" onClick={close} aria-label="閉じる" className="grid size-6 place-items-center rounded hover:bg-muted">
              <X className="size-4" />
            </button>
          </div>

          {sent ? (
            <div role="status" className="space-y-2 py-3 text-center">
              <CheckCircle2 className="mx-auto size-6 text-emerald-600 dark:text-emerald-400" aria-hidden />
              <p className="text-sm">送信しました。ありがとうございます！</p>
              <p className="text-xs text-muted-foreground">受付番号 FB-2048 · 画面情報を添付済み</p>
            </div>
          ) : (
            <form
              className="space-y-2"
              onSubmit={(e) => {
                e.preventDefault();
                if (text.trim()) {
                  setSent(true);
                  setText("");
                }
              }}
            >
              <div role="radiogroup" aria-label="種類" className="grid grid-cols-3 gap-1">
                {KINDS.map((k) => (
                  <button
                    key={k.id}
                    type="button"
                    role="radio"
                    aria-checked={kind === k.id}
                    tabIndex={kind === k.id ? 0 : -1}
                    onClick={() => setKind(k.id)}
                    onKeyDown={(e) => {
                      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
                      e.preventDefault();
                      const i = KINDS.findIndex((x) => x.id === kind);
                      const n = (i + (e.key === "ArrowRight" ? 1 : KINDS.length - 1)) % KINDS.length;
                      setKind(KINDS[n].id);
                      (e.currentTarget.parentElement?.children[n] as HTMLElement | undefined)?.focus();
                    }}
                    className={cn(
                      "flex flex-col items-center gap-0.5 rounded-md border py-1.5 text-[11px]",
                      kind === k.id ? "border-foreground bg-muted font-medium" : "text-muted-foreground hover:bg-muted",
                    )}
                  >
                    <k.icon className="size-4" aria-hidden />
                    {k.label}
                  </button>
                ))}
              </div>
              <label htmlFor={`${id}-text`} className="sr-only">
                内容
              </label>
              <Textarea
                ref={area}
                id={`${id}-text`}
                rows={2}
                required
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={kind === "bug" ? "何をしたら、どうなりましたか？" : "ご意見をお聞かせください"}
                className="min-h-14 text-sm"
              />
              <div className="flex items-center justify-between gap-2">
                <span className="truncate text-[11px] text-muted-foreground">画面 /invoices とブラウザ情報を添付</span>
                <Button type="submit" size="sm" disabled={!text.trim()}>
                  送信
                </Button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
