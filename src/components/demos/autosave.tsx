"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

type Status = "idle" | "typing" | "saving" | "saved";

export default function Autosave() {
  const [text, setText] = useState("ここに入力してみてください...");
  const [status, setStatus] = useState<Status>("saved");
  const t1 = useRef<NodeJS.Timeout | null>(null);
  const t2 = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => () => {
    if (t1.current) clearTimeout(t1.current);
    if (t2.current) clearTimeout(t2.current);
  }, []);

  const onChange = (v: string) => {
    setText(v);
    setStatus("typing");
    if (t1.current) clearTimeout(t1.current);
    if (t2.current) clearTimeout(t2.current);
    t1.current = setTimeout(() => {
      setStatus("saving");
      t2.current = setTimeout(() => setStatus("saved"), 700);
    }, 500);
  };

  return (
    <div className="space-y-2">
      <Textarea aria-label="メモ" value={text} onChange={(e) => onChange(e.target.value)} className="resize-none" rows={3} />
      <div role="status" aria-live="polite" className="flex items-center justify-end gap-1.5 text-xs text-muted-foreground h-5">
        {status === "typing" && <span>未保存の変更</span>}
        {status === "saving" && (<><Loader2 aria-hidden className="size-3 motion-safe:animate-spin" />保存中...</>)}
        {status === "saved" && (<><Check aria-hidden className="size-3 text-emerald-600 dark:text-emerald-400" />保存しました</>)}
      </div>
    </div>
  );
}
