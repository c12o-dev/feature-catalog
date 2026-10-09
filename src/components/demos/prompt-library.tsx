"use client";

import { useEffect, useRef, useState } from "react";
import { Bookmark, BookmarkPlus, Check, Copy, CornerDownLeft, Search } from "lucide-react";

type Prompt = { id: number; name: string; body: string };

const initial: Prompt[] = [
  { id: 1, name: "コードレビュー", body: "あなたは厳格なシニアエンジニアです。以下のコードをレビューし、バグ・可読性・性能の観点で指摘してください。" },
  { id: 2, name: "3 行要約", body: "次の文章を、結論から 3 行で要約してください。" },
  { id: 3, name: "英日翻訳", body: "次の英文を、自然で読みやすい日本語に翻訳してください。" },
  { id: 4, name: "メール下書き", body: "以下の要件で、取引先向けの丁寧なメールを下書きしてください。" },
];

export default function PromptLibrary() {
  const [prompts, setPrompts] = useState(initial);
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState("");
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [status, setStatus] = useState("");
  const nextId = useRef(5);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const filtered = prompts.filter((p) => (p.name + p.body).includes(query.trim()));

  const copy = (p: Prompt) => {
    navigator.clipboard?.writeText(p.body).catch(() => {});
    setCopiedId(p.id);
    setStatus(`「${p.name}」をコピーしました`);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopiedId(null), 1500);
  };
  const use = (p: Prompt) => { setDraft(p.body); setStatus(`「${p.name}」を入力欄に呼び出しました`); };
  const save = () => {
    const body = draft.trim();
    if (!body) return;
    const name = body.replace(/\s+/g, " ").slice(0, 12) + (body.length > 12 ? "…" : "");
    setPrompts((ps) => [{ id: nextId.current++, name, body }, ...ps]);
    setStatus(`「${name}」をライブラリに保存しました`);
  };

  return (
    <div className="mx-auto grid w-full max-w-2xl gap-3 md:grid-cols-[1fr_1fr]">
      <section aria-label="プロンプトライブラリ" className="space-y-2">
        <label className="flex items-center gap-2 rounded-md border bg-background px-2 py-1.5">
          <Search aria-hidden className="size-3.5 text-muted-foreground" />
          <span className="sr-only">テンプレを検索</span>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="テンプレを検索" className="min-w-0 flex-1 bg-transparent text-sm outline-none" />
        </label>
        <ul className="max-h-64 space-y-1.5 overflow-y-auto">
          {filtered.map((p) => (
            <li key={p.id} className="flex items-start gap-2 rounded-md border bg-card p-2.5">
              <Bookmark aria-hidden className="mt-0.5 size-4 shrink-0 fill-amber-400/30 text-amber-500 dark:text-amber-400" />
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium">{p.name}</div>
                <div className="truncate text-xs text-muted-foreground">{p.body}</div>
              </div>
              <div className="flex shrink-0 gap-0.5">
                <button type="button" aria-label={`「${p.name}」を呼び出す`} onClick={() => use(p)} className="grid size-7 place-items-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground">
                  <CornerDownLeft aria-hidden className="size-3.5" />
                </button>
                <button type="button" aria-label={`「${p.name}」をコピー`} onClick={() => copy(p)} className="grid size-7 place-items-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground">
                  {copiedId === p.id ? <Check aria-hidden className="size-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy aria-hidden className="size-3.5" />}
                </button>
              </div>
            </li>
          ))}
          {filtered.length === 0 && <li className="py-4 text-center text-xs text-muted-foreground">一致するテンプレはありません</li>}
        </ul>
      </section>
      <section aria-label="入力欄" className="flex flex-col gap-2 rounded-lg border bg-card p-3">
        <label htmlFor="pl-draft" className="text-xs font-medium">プロンプト</label>
        <textarea id="pl-draft" value={draft} onChange={(e) => setDraft(e.target.value)} rows={5} placeholder="左のテンプレを呼び出すか、ここに書いて保存" className="min-h-28 flex-1 resize-none rounded-md border bg-background p-2 text-sm" />
        <div className="flex items-center justify-between gap-2">
          <p aria-live="polite" className="min-w-0 truncate text-xs text-muted-foreground">{status}</p>
          <button type="button" onClick={save} disabled={!draft.trim()} className="inline-flex shrink-0 items-center gap-1 rounded-md border px-2 py-1 text-xs hover:bg-accent disabled:opacity-50">
            <BookmarkPlus aria-hidden className="size-3.5" />テンプレとして保存
          </button>
        </div>
      </section>
    </div>
  );
}
