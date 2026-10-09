"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, BookOpen, ChevronRight, MessageCircle, Send, X } from "lucide-react";

type View = "home" | "faq" | "chat";

const FAQ = [
  { q: "請求書はどこからダウンロードできますか？", a: "設定 → 請求 → 請求履歴から、月ごとの PDF をダウンロードできます。" },
  { q: "チームメンバーを招待するには？", a: "メンバー画面の「招待」からメールアドレスを入力してください。招待リンクは 7 日間有効です。" },
  { q: "プランの変更はすぐに反映されますか？", a: "アップグレードは即時、ダウングレードは次回更新日から反映されます。" },
];

export default function HelpWidget() {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<View>("home");
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [messages, setMessages] = useState<{ from: "me" | "agent"; text: string }[]>([
    { from: "agent", text: "こんにちは、サポートの佐藤です。何かお困りですか？" },
  ]);
  const [draft, setDraft] = useState("");
  const launcherRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const replyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (replyTimer.current) clearTimeout(replyTimer.current);
  }, []);

  useEffect(() => {
    if (open) panelRef.current?.focus();
  }, [open]);

  const close = () => {
    setOpen(false);
    setView("home");
    requestAnimationFrame(() => launcherRef.current?.focus());
  };

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    setMessages((m) => [...m, { from: "me", text }]);
    setDraft("");
    if (replyTimer.current) clearTimeout(replyTimer.current);
    replyTimer.current = setTimeout(() => {
      setMessages((m) => [...m, { from: "agent", text: "確認しますので少々お待ちください。" }]);
    }, 900);
  };

  return (
    <div className="relative h-[420px] overflow-hidden rounded-lg border bg-muted/30">
      {/* mock app behind */}
      <div className="space-y-3 p-4" aria-hidden>
        <div className="h-4 w-32 rounded bg-muted" />
        <div className="grid grid-cols-2 gap-3">
          <div className="h-20 rounded-md border bg-background" />
          <div className="h-20 rounded-md border bg-background" />
        </div>
        <div className="h-3 w-3/4 rounded bg-muted" />
        <div className="h-3 w-1/2 rounded bg-muted" />
      </div>

      {open && (
        <div
          ref={panelRef}
          tabIndex={-1}
          role="dialog"
          aria-label="サポート"
          onKeyDown={(e) => e.key === "Escape" && close()}
          className="absolute inset-x-3 bottom-3 top-3 flex flex-col overflow-hidden rounded-lg border bg-popover text-popover-foreground shadow-xl outline-none sm:left-auto sm:w-80 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2"
        >
          <div className="flex items-center gap-2 border-b px-3 py-2.5">
            {view !== "home" && (
              <button
                type="button"
                onClick={() => setView("home")}
                aria-label="戻る"
                className="grid size-7 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <ArrowLeft className="size-4" />
              </button>
            )}
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium">{view === "faq" ? "よくある質問" : view === "chat" ? "チャット" : "サポート"}</div>
              {view === "home" && <div className="text-xs text-muted-foreground">通常 5 分以内に返信します</div>}
            </div>
            <button
              type="button"
              onClick={close}
              aria-label="サポートを閉じる"
              className="grid size-7 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          </div>

          {view === "home" && (
            <div className="space-y-2 p-3">
              <button
                type="button"
                onClick={() => setView("faq")}
                className="flex w-full items-center gap-3 rounded-md border p-3 text-left text-sm hover:bg-muted"
              >
                <BookOpen className="size-4 shrink-0 text-muted-foreground" />
                <span className="flex-1">FAQ を見る</span>
                <ChevronRight className="size-4 text-muted-foreground" />
              </button>
              <button
                type="button"
                onClick={() => setView("chat")}
                className="flex w-full items-center gap-3 rounded-md border p-3 text-left text-sm hover:bg-muted"
              >
                <MessageCircle className="size-4 shrink-0 text-muted-foreground" />
                <span className="flex-1">チャットを開始</span>
                <ChevronRight className="size-4 text-muted-foreground" />
              </button>
            </div>
          )}

          {view === "faq" && (
            <ul className="flex-1 divide-y overflow-y-auto">
              {FAQ.map((f, i) => (
                <li key={f.q}>
                  <button
                    type="button"
                    aria-expanded={faqOpen === i}
                    onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                    className="flex w-full items-start gap-2 px-3 py-2.5 text-left text-sm hover:bg-muted"
                  >
                    <ChevronRight className={`mt-0.5 size-4 shrink-0 text-muted-foreground transition-transform ${faqOpen === i ? "rotate-90" : ""}`} />
                    <span>{f.q}</span>
                  </button>
                  {faqOpen === i && <p className="px-9 pb-3 text-xs leading-relaxed text-muted-foreground">{f.a}</p>}
                </li>
              ))}
            </ul>
          )}

          {view === "chat" && (
            <>
              <div className="flex-1 space-y-2 overflow-y-auto p-3" aria-live="polite">
                {messages.map((m, i) => (
                  <div key={i} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                        m.from === "me" ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}
                    >
                      {m.text}
                    </div>
                  </div>
                ))}
              </div>
              <form
                className="flex items-center gap-2 border-t p-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  send();
                }}
              >
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.nativeEvent.isComposing) e.preventDefault();
                  }}
                  aria-label="メッセージ"
                  placeholder="メッセージを入力"
                  className="h-8 min-w-0 flex-1 rounded-md border bg-background px-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
                <button
                  type="submit"
                  aria-label="送信"
                  disabled={!draft.trim()}
                  className="grid size-8 place-items-center rounded-md bg-primary text-primary-foreground disabled:opacity-50"
                >
                  <Send className="size-4" />
                </button>
              </form>
            </>
          )}
        </div>
      )}

      {!open && (
        <button
          ref={launcherRef}
          type="button"
          onClick={() => setOpen(true)}
          aria-label="サポートを開く"
          aria-haspopup="dialog"
          className="absolute bottom-3 right-3 grid size-12 place-items-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <MessageCircle className="size-5" />
          <span className="absolute right-0.5 top-0.5 size-2.5 rounded-full border-2 border-primary bg-emerald-400" aria-hidden />
        </button>
      )}
    </div>
  );
}
