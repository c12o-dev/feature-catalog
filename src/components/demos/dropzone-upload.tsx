"use client";

import { useEffect, useRef, useState } from "react";
import { Check, FileText, Upload, X } from "lucide-react";

type Item = { id: number; name: string; size: number; progress: number };

function fmtSize(b: number) {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / 1024 / 1024).toFixed(1)} MB`;
}

export default function DropzoneUpload() {
  const [over, setOver] = useState(false);
  const [files, setFiles] = useState<Item[]>([]);
  const [msg, setMsg] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const nextId = useRef(1);
  const depth = useRef(0);

  const uploading = files.some((f) => f.progress < 100);
  useEffect(() => {
    if (!uploading) return;
    const t = setInterval(() => {
      setFiles((fs) => fs.map((f) => (f.progress < 100 ? { ...f, progress: Math.min(100, f.progress + 12 + (f.id % 3) * 6) } : f)));
    }, 180);
    return () => clearInterval(t);
  }, [uploading]);

  const add = (list: FileList | null) => {
    if (!list || list.length === 0) return;
    const added = Array.from(list).map((f) => ({ id: nextId.current++, name: f.name, size: f.size, progress: 0 }));
    setFiles((fs) => [...fs, ...added]);
    setMsg(`${added.length} 件のファイルを追加しました`);
  };

  return (
    <div className="w-full space-y-3">
      <div
        onDragEnter={(e) => { e.preventDefault(); depth.current++; setOver(true); }}
        onDragOver={(e) => e.preventDefault()}
        onDragLeave={() => { depth.current = Math.max(0, depth.current - 1); if (depth.current === 0) setOver(false); }}
        onDrop={(e) => { e.preventDefault(); depth.current = 0; setOver(false); add(e.dataTransfer.files); }}
        className={`rounded-lg border-2 border-dashed px-4 py-8 text-center transition-colors ${over ? "border-primary bg-primary/5" : "border-border bg-muted/30"}`}
      >
        <span className={`mx-auto mb-3 grid size-10 place-items-center rounded-full border bg-background transition-transform ${over ? "scale-110" : ""}`}>
          <Upload className="size-4 text-muted-foreground" />
        </span>
        <div className="text-sm font-medium">{over ? "離してアップロード" : "ファイルをここにドロップ"}</div>
        <div className="mt-1 text-xs text-muted-foreground">
          または{" "}
          <button type="button" onClick={() => input.current?.click()} className="font-medium text-foreground underline underline-offset-2">
            クリックして選択
          </button>
          <span className="block sm:inline">（最大 10 MB）</span>
        </div>
        <input ref={input} type="file" multiple className="sr-only" tabIndex={-1} aria-label="アップロードするファイル" onChange={(e) => { add(e.target.files); e.target.value = ""; }} />
      </div>
      <p aria-live="polite" className="sr-only">{msg}</p>
      {files.length > 0 && (
        <ul className="space-y-1.5">
          {files.map((f) => (
            <li key={f.id} className="flex items-center gap-2 rounded-md border bg-background p-2 text-xs">
              <FileText className="size-4 shrink-0 text-muted-foreground" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="min-w-0 flex-1 truncate">{f.name}</span>
                  <span className="shrink-0 tabular-nums text-muted-foreground">{f.progress < 100 ? `${f.progress}%` : fmtSize(f.size)}</span>
                </div>
                <div className="mt-1 h-1 overflow-hidden rounded-full bg-muted" role="progressbar" aria-label={`${f.name} のアップロード`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={f.progress}>
                  <div className="h-full origin-left rounded-full bg-primary transition-transform" style={{ transform: `scaleX(${f.progress / 100})` }} />
                </div>
              </div>
              {f.progress >= 100 && <Check className="size-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" aria-label="完了" />}
              <button
                type="button"
                aria-label={`${f.name} を削除`}
                onClick={() => { setFiles((fs) => fs.filter((x) => x.id !== f.id)); setMsg(`${f.name} を削除しました`); }}
                className="grid size-6 shrink-0 place-items-center rounded text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="size-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
