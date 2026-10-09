"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const KEY = "demo-form-restore";

function read() {
  try { return localStorage.getItem(KEY) ?? ""; } catch { return ""; }
}
function write(v: string) {
  try { if (v) localStorage.setItem(KEY, v); else localStorage.removeItem(KEY); } catch {}
}

export default function FormRestore() {
  const [initial] = useState(() => read());
  const [v, setV] = useState(initial);
  const [restored, setRestored] = useState(initial !== "");
  useEffect(() => { write(v); }, [v]);
  return (
    <div className="space-y-2 max-w-md">
      {restored && (
        <div className="text-xs rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 px-2 py-1.5">
          ✓ 前回の入力を localStorage から復元しました
        </div>
      )}
      <Textarea value={v} onChange={(e) => setV(e.target.value)} placeholder="ここに何か入力してページをリロード..." rows={3} />
      <Button size="sm" variant="ghost" onClick={() => { setV(""); write(""); setRestored(false); }}>クリア</Button>
    </div>
  );
}
