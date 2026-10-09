"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const templates = ["依頼メール", "お詫び", "リリース告知", "面接のお礼"] as const;
type T = (typeof templates)[number];
const sample: Record<T, string> = {
  依頼メール: "お世話になっております。\n標題の件につきまして、来週 10 月 8 日までに見積書をご送付いただけますでしょうか。\nお忙しいところ恐縮ですが、よろしくお願いいたします。",
  お詫び: "先日は配送の遅延によりご迷惑をおかけし、誠に申し訳ございませんでした。\n原因を確認のうえ、再発防止に努めてまいります。",
  リリース告知: "本日、バージョン 2.4 をリリースしました。\n検索の高速化とダークモードに対応しています。ぜひお試しください。",
  面接のお礼: "本日はお時間をいただき、ありがとうございました。\nお話を伺い、貴社で働きたい気持ちがいっそう強くなりました。",
};

export default function AiCompose() {
  const reduce = useReducedMotion();
  const [text, setText] = useState("");
  const [pending, setPending] = useState<T | null>(null);
  const [streaming, setStreaming] = useState(false);
  const [status, setStatus] = useState("");
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const stop = () => {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
  };
  useEffect(() => stop, []);

  const generate = (t: T, mode: "replace" | "append") => {
    stop();
    setPending(null);
    const base = mode === "append" && text ? text.replace(/\s*$/, "") + "\n\n" : "";
    const out = sample[t];
    if (reduce) {
      setText(base + out);
      setStatus(`「${t}」の下書きを挿入しました`);
      return;
    }
    let i = 0;
    setStreaming(true);
    setStatus(`「${t}」を生成中`);
    timer.current = setInterval(() => {
      i = Math.min(out.length, i + 3);
      setText(base + out.slice(0, i));
      if (i >= out.length) {
        stop();
        setStreaming(false);
        setStatus(`「${t}」の下書きを挿入しました`);
      }
    }, 30);
  };

  const choose = (t: T) => {
    if (streaming) return;
    if (text.trim()) setPending(t);
    else generate(t, "replace");
  };

  return (
    <div className="mx-auto w-full max-w-md space-y-3">
      <div>
        <p className="mb-1.5 text-xs text-muted-foreground">テンプレートから書き出す</p>
        <div className="flex flex-wrap gap-1.5">
          {templates.map((t) => (
            <Button key={t} size="xs" variant="outline" onClick={() => choose(t)} disabled={streaming} aria-pressed={pending === t}>
              <Sparkles className="size-3 text-violet-500 dark:text-violet-400" aria-hidden />
              {t}
            </Button>
          ))}
        </div>
      </div>

      {pending && (
        <div role="alertdialog" aria-label="内容の置き換え確認" className="rounded-md border bg-muted/50 p-3">
          <p className="text-xs">入力中の文章があります。「{pending}」の下書きをどう反映しますか？</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            <Button size="xs" onClick={() => generate(pending, "replace")}>置き換える</Button>
            <Button size="xs" variant="outline" onClick={() => generate(pending, "append")}>末尾に追加</Button>
            <Button size="xs" variant="ghost" onClick={() => setPending(null)}>キャンセル</Button>
          </div>
        </div>
      )}

      <div className="space-y-1.5">
        <label htmlFor="ai-compose-body" className="text-sm font-medium">
          本文
        </label>
        <Textarea
          id="ai-compose-body"
          rows={6}
          value={text}
          onChange={(e) => setText(e.target.value)}
          readOnly={streaming}
          placeholder="自由に入力するか、テンプレートを選んでください"
          className={cn("text-sm leading-relaxed", streaming && "caret-transparent")}
        />
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span aria-live="polite">{status}</span>
          <span className="tabular-nums">{text.length} 文字</span>
        </div>
      </div>
    </div>
  );
}
