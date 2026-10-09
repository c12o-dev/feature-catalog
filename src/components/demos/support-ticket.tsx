"use client";

import { useId, useRef, useState } from "react";
import { CheckCircle2, FileText, Paperclip, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Attachment = { name: string; size: number };
const MAX_FILES = 3;
const MAX_BYTES = 5 * 1024 * 1024;

const fmtSize = (b: number) => (b >= 1024 * 1024 ? `${(b / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1024))} KB`);

export default function SupportTicket() {
  const id = useId();
  const fileRef = useRef<HTMLInputElement>(null);
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("bug");
  const [body, setBody] = useState("");
  const [files, setFiles] = useState<Attachment[]>([{ name: "screenshot-0930.png", size: 482_000 }]);
  const [fileError, setFileError] = useState("");
  const [done, setDone] = useState<{ no: number; files: number } | null>(null);

  const addFiles = (list: FileList | null) => {
    if (!list) return;
    const incoming = Array.from(list);
    const tooBig = incoming.filter((f) => f.size > MAX_BYTES);
    const ok = incoming.filter((f) => f.size <= MAX_BYTES).map((f) => ({ name: f.name, size: f.size }));
    const next = [...files, ...ok].slice(0, MAX_FILES);
    setFiles(next);
    setFileError(
      tooBig.length ? `${tooBig[0].name} は 5 MB を超えています` : files.length + ok.length > MAX_FILES ? `添付は ${MAX_FILES} 件までです` : "",
    );
    if (fileRef.current) fileRef.current.value = "";
  };

  if (done) {
    return (
      <div className="mx-auto w-full max-w-md space-y-3 rounded-lg border bg-card p-4" role="status">
        <div className="flex items-center gap-2 text-sm font-medium">
          <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" aria-hidden />
          チケット #{done.no} を受け付けました
        </div>
        <p className="text-xs text-muted-foreground">
          添付 {done.files} 件と一緒に送信しました。1 営業日以内にメールでご連絡します。
        </p>
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            setDone(null);
            setSubject("");
            setBody("");
            setFiles([]);
          }}
        >
          別の問い合わせ
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setDone({ no: 12839, files: files.length });
      }}
      className="@container mx-auto w-full max-w-md space-y-3 rounded-lg border bg-card p-4"
    >
      <div className="grid gap-3 @md:grid-cols-[1fr_10rem]">
        <div className="space-y-1.5">
          <Label htmlFor={`${id}-subject`}>件名</Label>
          <Input id={`${id}-subject`} required value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="例: CSV 出力で文字化けする" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`${id}-cat`}>種類</Label>
          <select
            id={`${id}-cat`}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="h-8 w-full rounded-lg border border-input bg-transparent px-2 text-sm dark:bg-input/30"
          >
            <option value="bug">不具合の報告</option>
            <option value="billing">請求・お支払い</option>
            <option value="question">使い方の質問</option>
          </select>
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor={`${id}-body`}>詳細</Label>
        <Textarea
          id={`${id}-body`}
          required
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="再現手順・期待した動作・実際の動作"
          rows={3}
        />
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-medium" id={`${id}-att`}>
            添付ファイル
          </span>
          <span className="text-xs text-muted-foreground tabular-nums">
            {files.length}/{MAX_FILES} · 各 5 MB まで
          </span>
        </div>
        {files.length > 0 && (
          <ul aria-labelledby={`${id}-att`} className="space-y-1">
            {files.map((f, i) => (
              <li key={`${f.name}-${i}`} className="flex items-center gap-2 rounded-md border bg-background px-2.5 py-1.5 text-xs">
                <FileText className="size-3.5 shrink-0 text-muted-foreground" aria-hidden />
                <span className="min-w-0 flex-1 truncate">{f.name}</span>
                <span className="shrink-0 text-muted-foreground tabular-nums">{fmtSize(f.size)}</span>
                <button
                  type="button"
                  onClick={() => setFiles((fs) => fs.filter((_, j) => j !== i))}
                  aria-label={`${f.name} を削除`}
                  className="rounded p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <X className="size-3.5" />
                </button>
              </li>
            ))}
          </ul>
        )}
        <input
          ref={fileRef}
          id={`${id}-file`}
          type="file"
          aria-label="添付するファイル"
          tabIndex={-1}
          multiple
          accept="image/*,.pdf,.txt,.log,.csv"
          className="sr-only"
          onChange={(e) => addFiles(e.target.files)}
          disabled={files.length >= MAX_FILES}
        />
        <Button type="button" size="sm" variant="outline" disabled={files.length >= MAX_FILES} onClick={() => fileRef.current?.click()}>
          <Paperclip />
          ファイルを選択
        </Button>
        <p aria-live="polite" className="min-h-4 text-xs text-destructive">
          {fileError}
        </p>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={!subject.trim() || !body.trim()}>
          送信する
        </Button>
      </div>
    </form>
  );
}
