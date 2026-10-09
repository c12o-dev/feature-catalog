"use client";

import { useRef, useState } from "react";

export default function OtpInput() {
  const [v, setV] = useState(["", "", "", "", "", ""]);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const onChange = (i: number, ch: string) => {
    const c = ch.replace(/\D/g, "").slice(-1);
    setV((v) => v.map((x, j) => (j === i ? c : x)));
    if (c && i < 5) refs.current[i + 1]?.focus();
  };

  const onKey = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !v[i] && i > 0) refs.current[i - 1]?.focus();
  };

  const filled = v.every(Boolean);

  return (
    <div className="space-y-3">
      <div className="text-sm font-medium">確認コードを入力</div>
      <div className="flex gap-2">
        {v.map((ch, i) => (
          <input
            key={i}
            ref={(el) => { refs.current[i] = el; }}
            value={ch}
            onChange={(e) => onChange(i, e.target.value)}
            onKeyDown={(e) => onKey(i, e)}
            inputMode="numeric"
            maxLength={1}
            className="size-12 text-center text-lg font-mono rounded-md border bg-background focus:outline-none focus:ring-2 focus:ring-foreground/30"
          />
        ))}
      </div>
      {filled && <div className="text-xs text-emerald-600">✓ コード入力完了</div>}
    </div>
  );
}
