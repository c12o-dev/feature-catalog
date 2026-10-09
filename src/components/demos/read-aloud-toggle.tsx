"use client";

import { useEffect, useRef, useState } from "react";
import { SkipBack, SkipForward, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";

const PARAS = [
  "秋の連休、静かな山あいの温泉地を訪ねました。",
  "駅から歩いて十分ほどの宿は、木の香りがする小さな建物です。",
  "夕食には地元でとれたきのこと川魚が並び、どれも素朴でやさしい味でした。",
  "翌朝は霧が晴れるのを待って、紅葉の始まった遊歩道を一時間ほど歩きました。",
];

export default function ReadAloudToggle() {
  const [on, setOn] = useState(false);
  const [idx, setIdx] = useState<number | null>(null);
  const [engine, setEngine] = useState<"voice" | "sim" | null>(null);
  const token = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stopAll = () => {
    token.current++;
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
  };

  useEffect(() => stopAll, []);

  const readFrom = (i: number) => {
    stopAll();
    const my = token.current;
    if (i < 0 || i >= PARAS.length) {
      setIdx(null);
      return;
    }
    setIdx(i);
    const next = () => {
      if (token.current === my) readFrom(i + 1);
    };
    if ("speechSynthesis" in window) {
      setEngine("voice");
      const u = new SpeechSynthesisUtterance(PARAS[i]);
      u.lang = "ja-JP";
      u.rate = 1.05;
      u.onend = next;
      u.onerror = () => {
        // Fall back to a timed highlight if the voice fails (e.g. no Japanese voice)
        if (token.current !== my) return;
        setEngine("sim");
        timer.current = setTimeout(next, PARAS[i].length * 110);
      };
      window.speechSynthesis.speak(u);
    } else {
      setEngine("sim");
      timer.current = setTimeout(next, PARAS[i].length * 110);
    }
  };

  const toggle = () => {
    if (on) {
      stopAll();
      setIdx(null);
      setOn(false);
    } else {
      setOn(true);
      readFrom(0);
    }
  };

  return (
    <div className="mx-auto w-full max-w-lg overflow-hidden rounded-lg border bg-card text-card-foreground">
      <div className="flex flex-wrap items-center gap-3 border-b px-4 py-2.5">
        <Volume2 className="size-4 text-muted-foreground" aria-hidden />
        <span id="ra-label" className="text-sm font-medium">読み上げモード</span>
        <button
          type="button"
          role="switch"
          aria-checked={on}
          aria-labelledby="ra-label"
          onClick={toggle}
          className={cn(
            "relative ml-auto h-5 w-9 shrink-0 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            on ? "bg-primary" : "bg-input",
          )}
        >
          <span className={cn("absolute top-0.5 left-0.5 size-4 rounded-full bg-background shadow transition-transform", on && "translate-x-4")} />
        </button>
      </div>

      {on && (
        <div className="flex items-center gap-1 border-b bg-muted/40 px-3 py-1.5">
          <button type="button" aria-label="前の段落" onClick={() => readFrom(Math.max(0, (idx ?? 0) - 1))} className="grid size-7 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground">
            <SkipBack className="size-3.5" />
          </button>
          <button type="button" aria-label="次の段落" onClick={() => readFrom(Math.min(PARAS.length - 1, (idx ?? -1) + 1))} className="grid size-7 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground">
            <SkipForward className="size-3.5" />
          </button>
          <span className="ml-auto text-xs text-muted-foreground tabular-nums" aria-live="polite">
            {idx === null ? "読み上げ完了" : `${idx + 1} / ${PARAS.length} 段落`}
            {engine === "sim" && idx !== null && "（音声なし）"}
          </span>
        </div>
      )}

      <article className={cn("space-y-2 p-4 transition-[font-size]", on ? "text-base leading-loose" : "text-sm leading-relaxed")}>
        <h3 className="text-sm font-semibold">山あいの宿で過ごす二日間</h3>
        {PARAS.map((p, i) =>
          on ? (
            <p key={i}>
              <button
                type="button"
                onClick={() => readFrom(i)}
                aria-current={idx === i ? "true" : undefined}
                className={cn(
                  "-mx-1.5 w-[calc(100%+0.75rem)] rounded-md px-1.5 text-left transition-colors",
                  idx === i ? "bg-primary/10 text-foreground ring-1 ring-primary/40" : "text-muted-foreground hover:bg-muted",
                )}
              >
                {p}
              </button>
            </p>
          ) : (
            <p key={i} className="text-muted-foreground">{p}</p>
          ),
        )}
      </article>
    </div>
  );
}
