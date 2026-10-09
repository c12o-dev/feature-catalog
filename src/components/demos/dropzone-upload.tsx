"use client";

import { useState } from "react";
import { Upload, FileText, X } from "lucide-react";

export default function DropzoneUpload() {
  const [over, setOver] = useState(false);
  const [files, setFiles] = useState<{ name: string; size: number }[]>([]);
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setOver(false);
    const dropped = Array.from(e.dataTransfer.files).map((f) => ({ name: f.name, size: f.size }));
    setFiles((fs) => [...fs, ...dropped]);
  };
  return (
    <div className="space-y-3">
      <div
        onDragOver={(e) => { e.preventDefault(); setOver(true); }}
        onDragLeave={() => setOver(false)}
        onDrop={onDrop}
        className={`rounded-lg border-2 border-dashed p-8 text-center transition-colors ${over ? "border-primary bg-primary/5" : "border-border"}`}
      >
        <Upload className="size-8 text-muted-foreground mx-auto mb-2" />
        <div className="text-sm font-medium">ファイルをここにドロップ</div>
        <div className="text-xs text-muted-foreground mt-1">またはクリックで選択</div>
      </div>
      {files.length > 0 && (
        <ul className="space-y-1">
          {files.map((f, i) => (
            <li key={i} className="flex items-center gap-2 text-xs rounded border bg-background p-2">
              <FileText className="size-3.5 text-muted-foreground" />
              <span className="flex-1 truncate">{f.name}</span>
              <span className="text-muted-foreground tabular-nums">{(f.size / 1024).toFixed(1)} KB</span>
              <button onClick={() => setFiles((fs) => fs.filter((_, j) => j !== i))}><X className="size-3" /></button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
