"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";

const channels = ["メール", "Push", "アプリ内"];
const events = ["コメント", "メンション", "リリース", "アラート", "週次まとめ"];

export default function NotificationMatrix() {
  const [m, setM] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    events.forEach((e, i) => channels.forEach((c, j) => { init[`${e}|${c}`] = (i + j) % 2 === 0; }));
    return init;
  });
  return (
    <div className="overflow-x-auto rounded-md border bg-background">
      <table className="w-full min-w-[260px] text-sm">
        <caption className="sr-only">通知設定: イベントごとのチャネル ON/OFF</caption>
        <thead className="bg-muted/30">
          <tr><th scope="col" className="text-left p-2 text-xs font-medium">イベント</th>{channels.map((c) => <th key={c} scope="col" className="p-2 text-xs font-medium whitespace-nowrap">{c}</th>)}</tr>
        </thead>
        <tbody className="divide-y">
          {events.map((e) => (
            <tr key={e}>
              <th scope="row" className="px-2 py-2 text-left font-normal whitespace-nowrap">{e}</th>
              {channels.map((c) => {
                const k = `${e}|${c}`;
                return (
                  <td key={c} className="text-center p-1">
                    <Switch checked={m[k]} aria-label={`${e}を${c}で通知`} onCheckedChange={(v) => setM((m) => ({ ...m, [k]: v }))} />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
