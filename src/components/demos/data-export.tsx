"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Check, Download, FileArchive, Loader2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

const CATS = [
  { key: "profile", label: "プロフィール", mb: 0.2 },
  { key: "posts", label: "投稿・コメント", mb: 8.6 },
  { key: "settings", label: "設定", mb: 0.1 },
  { key: "activity", label: "アクティビティログ", mb: 3.5 },
] as const;
type Key = (typeof CATS)[number]["key"];

const FILE_NAME = "my-data-2026-10-01.zip";
const STEPS = ["データを収集中", "ファイルを圧縮中", "ダウンロードを準備中"];

/* ---- minimal ZIP (stored, no compression) ---- */
const CRC_TABLE = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
function crc32(b: Uint8Array) {
  let c = 0xffffffff;
  for (const x of b) c = CRC_TABLE[(c ^ x) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function makeZip(files: { name: string; text: string }[]) {
  const enc = new TextEncoder();
  const chunks: Uint8Array[] = [];
  const central: Uint8Array[] = [];
  let offset = 0;
  for (const f of files) {
    const name = enc.encode(f.name);
    const data = enc.encode(f.text);
    const crc = crc32(data);
    const local = new DataView(new ArrayBuffer(30));
    local.setUint32(0, 0x04034b50, true);
    local.setUint16(4, 20, true);
    local.setUint16(6, 0x0800, true); // UTF-8 names
    local.setUint32(14, crc, true);
    local.setUint32(18, data.length, true);
    local.setUint32(22, data.length, true);
    local.setUint16(26, name.length, true);
    chunks.push(new Uint8Array(local.buffer), name, data);
    const cen = new DataView(new ArrayBuffer(46));
    cen.setUint32(0, 0x02014b50, true);
    cen.setUint16(4, 20, true);
    cen.setUint16(6, 20, true);
    cen.setUint16(8, 0x0800, true);
    cen.setUint32(16, crc, true);
    cen.setUint32(20, data.length, true);
    cen.setUint32(24, data.length, true);
    cen.setUint16(28, name.length, true);
    cen.setUint32(42, offset, true);
    central.push(new Uint8Array(cen.buffer), name);
    offset += 30 + name.length + data.length;
  }
  const cenSize = central.reduce((s, c) => s + c.length, 0);
  const end = new DataView(new ArrayBuffer(22));
  end.setUint32(0, 0x06054b50, true);
  end.setUint16(8, files.length, true);
  end.setUint16(10, files.length, true);
  end.setUint32(12, cenSize, true);
  end.setUint32(16, offset, true);
  return new Blob([...chunks, ...central, new Uint8Array(end.buffer)] as BlobPart[], { type: "application/zip" });
}

const SAMPLE: Record<Key, unknown> = {
  profile: { name: "森田 美咲", handle: "misaki_design", joined: "2023-04-12" },
  posts: [{ id: 1, body: "はじめての投稿です", createdAt: "2026-09-28T10:12:00+09:00" }],
  settings: { language: "ja", theme: "system", notifications: { email: true } },
  activity: [{ at: "2026-10-01T08:41:00+09:00", event: "login", device: "iPhone" }],
};

export default function DataExport() {
  const id = useId();
  const [sel, setSel] = useState<Record<Key, boolean>>({ profile: true, posts: true, settings: true, activity: false });
  const [phase, setPhase] = useState<"idle" | "preparing" | "ready">("idle");
  const [step, setStep] = useState(0);
  const [downloaded, setDownloaded] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearInterval(timer.current);
    },
    []
  );

  const chosen = CATS.filter((c) => sel[c.key]);
  const sizeMb = chosen.reduce((s, c) => s + c.mb, 0);

  const start = () => {
    setPhase("preparing");
    setStep(0);
    setDownloaded(false);
    let i = 0;
    timer.current = setInterval(() => {
      i += 1;
      if (i >= STEPS.length) {
        if (timer.current) clearInterval(timer.current);
        timer.current = null;
        setPhase("ready");
      } else setStep(i);
    }, 700);
  };

  const download = () => {
    const files = [
      { name: "README.txt", text: "このアーカイブはデモ用に生成されたサンプルデータです。\n" },
      ...chosen.map((c) => ({ name: `${c.key}.json`, text: JSON.stringify(SAMPLE[c.key], null, 2) })),
    ];
    const url = URL.createObjectURL(makeZip(files));
    const a = document.createElement("a");
    a.href = url;
    a.download = FILE_NAME;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 0);
    setDownloaded(true);
  };

  return (
    <div className="mx-auto w-full max-w-md space-y-4 rounded-lg border bg-card p-4">
      <div className="flex gap-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-md bg-muted text-muted-foreground">
          <ShieldCheck className="size-4.5" />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-medium">データのエクスポート</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            保存されているあなたのデータを ZIP でダウンロードできます（GDPR・個人情報保護法の開示請求に対応）
          </p>
        </div>
      </div>

      <fieldset disabled={phase === "preparing"} className="space-y-1.5">
        <legend className="mb-1.5 text-xs font-medium">含めるデータ</legend>
        {CATS.map((c) => (
          <label
            key={c.key}
            htmlFor={`${id}-${c.key}`}
            className="flex cursor-pointer items-center gap-2 rounded-md px-1 py-1 text-sm hover:bg-muted/50"
          >
            <input
              id={`${id}-${c.key}`}
              type="checkbox"
              checked={sel[c.key]}
              onChange={(e) => {
                const v = e.target.checked;
                setSel((s) => ({ ...s, [c.key]: v }));
                if (phase === "ready") setPhase("idle");
              }}
              className="size-4 accent-[var(--primary)]"
            />
            <span className="flex-1">{c.label}</span>
            <span className="text-xs text-muted-foreground tabular-nums">{c.mb.toFixed(1)} MB</span>
          </label>
        ))}
      </fieldset>

      <div aria-live="polite" className="space-y-2">
        {phase === "idle" && (
          <Button size="sm" onClick={start} disabled={chosen.length === 0} className="w-full">
            エクスポートを準備（約 {sizeMb.toFixed(1)} MB）
          </Button>
        )}
        {phase === "preparing" && (
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Loader2 className="size-3.5 motion-safe:animate-spin" aria-hidden />
              {STEPS[step]}…
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full origin-left rounded-full bg-primary transition-transform duration-500"
                style={{ transform: `scaleX(${(step + 1) / (STEPS.length + 1)})` }}
              />
            </div>
          </div>
        )}
        {phase === "ready" && (
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 rounded-md border bg-muted/40 p-2.5">
              <FileArchive className="size-5 shrink-0 text-muted-foreground" aria-hidden />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{FILE_NAME}</p>
                <p className="text-xs text-muted-foreground tabular-nums">
                  {sizeMb.toFixed(1)} MB · {chosen.length} 項目 · 7 日間有効
                </p>
              </div>
            </div>
            <Button size="sm" onClick={download} className="w-full">
              {downloaded ? <Check /> : <Download />}
              {downloaded ? "ダウンロードしました（もう一度）" : "ZIP をダウンロード"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
