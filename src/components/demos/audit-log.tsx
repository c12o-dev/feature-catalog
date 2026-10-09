"use client";

import { useState } from "react";
import { KeyRound, LogIn, Pencil, Shield, Trash2, UserPlus, Download, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Entry = {
  id: number;
  at: string; // ISO, JST
  actor: string;
  self: boolean;
  icon: LucideIcon;
  action: string;
  target: string;
  code: string;
  where: string;
};

const entries: Entry[] = [
  { id: 1, at: "2026-10-01T08:52:00+09:00", actor: "あなた", self: true, icon: LogIn, action: "ログインしました", target: "Chrome / macOS", code: "auth.login", where: "東京, JP" },
  { id: 2, at: "2026-10-01T08:40:00+09:00", actor: "佐藤 美咲", self: false, icon: UserPlus, action: "メンバーを招待しました", target: "kenta@example.com", code: "member.invite", where: "大阪, JP" },
  { id: 3, at: "2026-09-30T19:12:00+09:00", actor: "あなた", self: true, icon: Shield, action: "二段階認証を有効にしました", target: "認証アプリ", code: "mfa.enable", where: "東京, JP" },
  { id: 4, at: "2026-09-30T17:05:00+09:00", actor: "あなた", self: true, icon: Pencil, action: "プロフィールを更新しました", target: "表示名・アイコン", code: "user.update", where: "東京, JP" },
  { id: 5, at: "2026-09-30T11:31:00+09:00", actor: "システム", self: false, icon: KeyRound, action: "API キーを自動ローテーションしました", target: "本番キー ••••4f2a", code: "key.rotate", where: "—" },
  { id: 6, at: "2026-09-29T15:48:00+09:00", actor: "あなた", self: true, icon: Download, action: "データをエクスポートしました", target: "請求書 (CSV)", code: "billing.export", where: "東京, JP" },
  { id: 7, at: "2026-09-29T10:20:00+09:00", actor: "高橋 翔", self: false, icon: Trash2, action: "プロジェクトを削除しました", target: "旧LP 2025", code: "project.delete", where: "福岡, JP" },
];

const REF = new Date("2026-10-01T09:00:00+09:00").getTime();

function relative(iso: string) {
  const min = Math.round((REF - new Date(iso).getTime()) / 60000);
  if (min < 60) return `${min} 分前`;
  const h = Math.round(min / 60);
  if (h < 24) return `${h} 時間前`;
  return `${Math.round(h / 24)} 日前`;
}

function clock(iso: string) {
  // Fixed JST formatting without Intl timezone reads
  const d = new Date(new Date(iso).getTime() + 9 * 3600_000);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getUTCMonth() + 1}/${d.getUTCDate()} ${p(d.getUTCHours())}:${p(d.getUTCMinutes())}`;
}

export default function AuditLog() {
  const [scope, setScope] = useState<"self" | "team">("self");
  const [open, setOpen] = useState<number | null>(null);
  const list = scope === "self" ? entries.filter((e) => e.self) : entries;

  return (
    <div className="mx-auto w-full max-w-xl rounded-lg border bg-card text-card-foreground">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b px-4 py-3">
        <div>
          <h3 className="text-sm font-semibold">操作履歴</h3>
          <p className="text-xs text-muted-foreground">誰が・いつ・何をしたか</p>
        </div>
        <div role="radiogroup" aria-label="表示範囲" className="inline-flex rounded-md border bg-muted p-0.5 text-xs">
          {(["self", "team"] as const).map((s) => (
            <button
              key={s}
              type="button"
              role="radio"
              aria-checked={scope === s}
              onClick={() => setScope(s)}
              className={cn(
                "rounded px-2.5 py-1 transition-colors",
                scope === s ? "bg-background font-medium shadow-sm" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {s === "self" ? "自分" : "チーム全体"}
            </button>
          ))}
        </div>
      </div>
      <p aria-live="polite" className="sr-only">{list.length} 件を表示中</p>
      <ol className="divide-y">
        {list.map((e) => {
          const Icon = e.icon;
          const expanded = open === e.id;
          return (
            <li key={e.id}>
              <button
                type="button"
                aria-expanded={expanded}
                onClick={() => setOpen(expanded ? null : e.id)}
                className="flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/50 focus-visible:bg-muted/50 focus-visible:outline-none"
              >
                <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-muted text-muted-foreground">
                  <Icon className="size-3.5" aria-hidden />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm">
                    <span className={cn("font-medium", e.self && "text-primary")}>{e.actor}</span>
                    <span className="text-muted-foreground"> が </span>
                    {e.action}
                  </span>
                  <span className="block truncate text-xs text-muted-foreground">{e.target}</span>
                  {expanded && (
                    <span className="mt-2 grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 rounded-md bg-muted/60 p-2 text-xs">
                      <span className="text-muted-foreground">日時</span>
                      <span className="tabular-nums">{clock(e.at)} JST</span>
                      <span className="text-muted-foreground">場所</span>
                      <span>{e.where}</span>
                      <span className="text-muted-foreground">イベント</span>
                      <code className="font-mono">{e.code}</code>
                    </span>
                  )}
                </span>
                <time dateTime={e.at} className="shrink-0 text-xs text-muted-foreground tabular-nums">
                  {relative(e.at)}
                </time>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
