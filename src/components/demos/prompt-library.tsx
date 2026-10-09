"use client";

import { Bookmark, Copy } from "lucide-react";

const prompts = [
  { name: "コードレビュー", body: "あなたは厳格なシニアエンジニア。以下のコードをレビュー..." },
  { name: "要約 (3 行)", body: "次の文章を 3 行で要約してください..." },
  { name: "翻訳 (英→日)", body: "次の英文を自然な日本語に翻訳..." },
  { name: "メール下書き", body: "以下のトピックで丁寧なメールを..." },
];

export default function PromptLibrary() {
  return (
    <div className="space-y-2">
      {prompts.map((p) => (
        <div key={p.name} className="flex items-start gap-2 rounded-md border bg-background p-3">
          <Bookmark className="size-4 text-amber-500 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium">{p.name}</div>
            <div className="text-xs text-muted-foreground truncate">{p.body}</div>
          </div>
          <button className="text-muted-foreground hover:text-foreground p-1" aria-label="コピー"><Copy className="size-3.5" /></button>
        </div>
      ))}
    </div>
  );
}
