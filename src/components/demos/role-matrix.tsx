"use client";

import { useState } from "react";
import { Check, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

const ROLES = [
  { key: "admin", label: "管理者" },
  { key: "editor", label: "編集者" },
  { key: "viewer", label: "閲覧者" },
] as const;
type Role = (typeof ROLES)[number]["key"];

const INITIAL: { name: string; allow: Record<Role, boolean> }[] = [
  { name: "プロジェクト閲覧", allow: { admin: true, editor: true, viewer: true } },
  { name: "コンテンツ編集", allow: { admin: true, editor: true, viewer: false } },
  { name: "コメント", allow: { admin: true, editor: true, viewer: true } },
  { name: "メンバー招待", allow: { admin: true, editor: false, viewer: false } },
  { name: "請求の管理", allow: { admin: true, editor: false, viewer: false } },
  { name: "プロジェクト削除", allow: { admin: true, editor: false, viewer: false } },
];

export default function RoleMatrix() {
  const [perms, setPerms] = useState(INITIAL);
  const [msg, setMsg] = useState("");

  const toggle = (row: number, role: Role) => {
    if (role === "admin") return;
    const p = perms[row];
    const next = !p.allow[role];
    setPerms((prev) => prev.map((x, i) => (i === row ? { ...x, allow: { ...x.allow, [role]: next } } : x)));
    const label = ROLES.find((r) => r.key === role)!.label;
    setMsg(`${label}の「${p.name}」を${next ? "許可" : "不許可"}にしました`);
  };

  return (
    <div className="mx-auto w-full max-w-lg space-y-2">
      <div className="overflow-x-auto rounded-lg border bg-card">
        <table className="w-full min-w-[260px] text-sm">
          <caption className="sr-only">ロールごとの権限。管理者は常にすべて許可</caption>
          <thead className="bg-muted/50">
            <tr className="text-xs text-muted-foreground">
              <th scope="col" className="px-3 py-2 text-left font-medium">権限</th>
              {ROLES.map((r) => (
                <th key={r.key} scope="col" className="px-2 py-2 text-center font-medium">{r.label}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y">
            {perms.map((p, i) => (
              <tr key={p.name}>
                <th scope="row" className="whitespace-nowrap px-3 py-1.5 text-left font-normal">{p.name}</th>
                {ROLES.map((r) => {
                  const on = p.allow[r.key];
                  const locked = r.key === "admin";
                  return (
                    <td key={r.key} className="px-2 py-1.5 text-center">
                      <button
                        type="button"
                        role="checkbox"
                        aria-checked={on}
                        aria-disabled={locked}
                        aria-label={`${r.label}: ${p.name}`}
                        onClick={() => toggle(i, r.key)}
                        className={cn(
                          "mx-auto grid size-7 place-items-center rounded-md transition-colors",
                          on ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300" : "text-muted-foreground/60 hover:bg-muted",
                          locked && "cursor-not-allowed opacity-70",
                        )}
                      >
                        {on ? <Check className="size-4" aria-hidden /> : <Minus className="size-4" aria-hidden />}
                        <span className="sr-only">{on ? "許可" : "不許可"}</span>
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="min-h-4 text-xs text-muted-foreground" aria-live="polite">
        {msg || "セルを押すと編集者・閲覧者の権限を切り替えられます"}
      </p>
    </div>
  );
}
