"use client";

import { useId, useState } from "react";
import { Switch } from "@/components/ui/switch";

const SETTINGS = [
  { key: "mail", label: "メール通知", desc: "メンションや返信があったときに送信", initial: true },
  { key: "marketing", label: "お知らせ・キャンペーン", desc: "新機能や特典の案内（月 1〜2 回）", initial: false },
  { key: "digest", label: "週間アクティビティのまとめ", desc: "毎週月曜 9:00 に配信", initial: true },
];

export default function ToggleSwitch() {
  const [values, setValues] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(SETTINGS.map((s) => [s.key, s.initial])),
  );

  return (
    <div className="mx-auto max-w-md divide-y rounded-lg border bg-card">
      {SETTINGS.map((s) => (
        <Row key={s.key} label={s.label} desc={s.desc} checked={values[s.key]} onChange={(v) => setValues((p) => ({ ...p, [s.key]: v }))} />
      ))}
    </div>
  );
}

function Row({ label, desc, checked, onChange }: { label: string; desc: string; checked: boolean; onChange: (v: boolean) => void }) {
  const id = useId();
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3">
      <label htmlFor={id} className="min-w-0 flex-1 cursor-pointer">
        <span className="block text-sm font-medium">{label}</span>
        <span id={`${id}-desc`} className="block text-xs text-muted-foreground">{desc}</span>
      </label>
      <span className="w-6 text-right text-xs text-muted-foreground tabular-nums" aria-hidden>
        {checked ? "ON" : "OFF"}
      </span>
      <Switch id={id} aria-label={label} checked={checked} onCheckedChange={onChange} aria-describedby={`${id}-desc`} />
    </div>
  );
}
