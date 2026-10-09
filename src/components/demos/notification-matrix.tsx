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
      <table className="w-full text-sm">
        <thead className="bg-muted/30">
          <tr><th className="text-left p-2 text-xs">イベント</th>{channels.map((c) => <th key={c} className="p-2 text-xs">{c}</th>)}</tr>
        </thead>
        <tbody className="divide-y">
          {events.map((e) => (
            <tr key={e}>
              <td className="px-2 py-2">{e}</td>
              {channels.map((c) => {
                const k = `${e}|${c}`;
                return (
                  <td key={c} className="text-center p-1">
                    <Switch checked={m[k]} onCheckedChange={(v) => setM((m) => ({ ...m, [k]: v }))} />
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
