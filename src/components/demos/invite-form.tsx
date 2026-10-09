"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Link2, Mail, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Role = "admin" | "editor" | "viewer";
const ROLES: { value: Role; label: string; hint: string }[] = [
  { value: "admin", label: "管理者", hint: "メンバー管理と請求" },
  { value: "editor", label: "編集者", hint: "作成・編集が可能" },
  { value: "viewer", label: "閲覧者", hint: "閲覧とコメントのみ" },
];
const ROLE_LABEL: Record<Role, string> = { admin: "管理者", editor: "編集者", viewer: "閲覧者" };
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LINK = "https://app.example.jp/join/7Kq2-mR9d";

type Sent = { email: string; role: Role };

export default function InviteForm() {
  const [emails, setEmails] = useState("");
  const [role, setRole] = useState<Role>("editor");
  const [sent, setSent] = useState<Sent[]>([{ email: "sato@example.jp", role: "viewer" }]);
  const [message, setMessage] = useState<{ tone: "ok" | "error"; text: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const radios = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => () => {
    if (copyTimer.current) clearTimeout(copyTimer.current);
  }, []);

  const submit = () => {
    const list = emails.split(/[\s,、]+/).map((s) => s.trim()).filter(Boolean);
    if (list.length === 0) {
      setMessage({ tone: "error", text: "メールアドレスを入力してください" });
      return;
    }
    const invalid = list.filter((s) => !EMAIL.test(s));
    if (invalid.length) {
      setMessage({ tone: "error", text: `形式が正しくありません: ${invalid.join(", ")}` });
      return;
    }
    const fresh = list.filter((e) => !sent.some((s) => s.email === e));
    setSent((prev) => [...fresh.map((email) => ({ email, role })), ...prev]);
    setEmails("");
    setMessage({
      tone: "ok",
      text: fresh.length ? `${fresh.length} 件の招待を${ROLE_LABEL[role]}として送信しました` : "すでに招待済みのアドレスです",
    });
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(LINK);
      setCopied(true);
      if (copyTimer.current) clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), 1500);
    } catch {
      setMessage({ tone: "error", text: "コピーできませんでした。リンクを選択してコピーしてください" });
    }
  };

  const onRadioKey = (e: React.KeyboardEvent, i: number) => {
    const d = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const n = (i + d + ROLES.length) % ROLES.length;
    setRole(ROLES[n].value);
    radios.current[n]?.focus();
  };

  return (
    <div className="@container mx-auto w-full max-w-md space-y-4 rounded-lg border bg-card p-4">
      <div>
        <div className="text-sm font-medium">メンバーを招待</div>
        <p className="text-xs text-muted-foreground">デザインチーム ワークスペース</p>
      </div>

      <form
        className="space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <div className="space-y-1.5">
          <label htmlFor="invite-emails" className="text-xs font-medium">
            メールアドレス
          </label>
          <input
            id="invite-emails"
            value={emails}
            onChange={(e) => setEmails(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.nativeEvent.isComposing) e.preventDefault();
            }}
            placeholder="tanaka@example.jp, suzuki@example.jp"
            aria-describedby="invite-emails-hint"
            className="h-9 w-full rounded-md border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          />
          <p id="invite-emails-hint" className="text-xs text-muted-foreground">
            カンマ区切りで複数入力できます
          </p>
        </div>

        <div className="space-y-1.5">
          <div id="invite-role-label" className="text-xs font-medium">
            役割
          </div>
          <div role="radiogroup" aria-labelledby="invite-role-label" className="grid grid-cols-1 gap-1.5 @sm:grid-cols-3">
            {ROLES.map((r, i) => {
              const on = role === r.value;
              return (
                <button
                  key={r.value}
                  ref={(el) => {
                    radios.current[i] = el;
                  }}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  tabIndex={on ? 0 : -1}
                  onClick={() => setRole(r.value)}
                  onKeyDown={(e) => onRadioKey(e, i)}
                  className={cn(
                    "rounded-md border px-3 py-2 text-left transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                    on ? "border-primary bg-primary/5 ring-1 ring-primary" : "bg-background hover:bg-muted/60",
                  )}
                >
                  <div className="flex items-center justify-between text-sm font-medium">
                    {r.label}
                    {on && <Check className="size-3.5" aria-hidden />}
                  </div>
                  <div className="text-xs text-muted-foreground">{r.hint}</div>
                </button>
              );
            })}
          </div>
        </div>

        <button
          type="submit"
          className="inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Mail className="size-4" aria-hidden />
          招待を送信
        </button>
      </form>

      <div aria-live="polite" className="min-h-5 text-xs">
        {message && (
          <p className={message.tone === "ok" ? "text-emerald-700 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}>
            {message.text}
          </p>
        )}
      </div>

      <div className="space-y-1.5 border-t pt-3">
        <div className="text-xs font-medium">招待リンク</div>
        <div className="flex items-center gap-2 rounded-md border bg-muted/40 p-1.5 pl-2.5">
          <Link2 className="size-3.5 shrink-0 text-muted-foreground" aria-hidden />
          <code className="min-w-0 flex-1 truncate text-xs text-muted-foreground">{LINK}</code>
          <button
            type="button"
            onClick={copyLink}
            className="inline-flex h-7 shrink-0 items-center gap-1 rounded-md border bg-background px-2 text-xs font-medium hover:bg-muted"
          >
            {copied ? <Check className="size-3 text-emerald-600 dark:text-emerald-400" aria-hidden /> : null}
            {copied ? "コピー済み" : "コピー"}
          </button>
        </div>
      </div>

      {sent.length > 0 && (
        <ul className="space-y-1" aria-label="招待中">
          {sent.map((s) => (
            <li key={s.email} className="flex items-center gap-2 rounded-md px-1 py-1 text-sm">
              <span className="grid size-6 shrink-0 place-items-center rounded-full bg-muted text-xs font-medium uppercase">
                {s.email[0]}
              </span>
              <span className="min-w-0 flex-1 truncate">{s.email}</span>
              <span className="shrink-0 text-xs text-muted-foreground">{ROLE_LABEL[s.role]}・招待中</span>
              <button
                type="button"
                aria-label={`${s.email} の招待を取り消す`}
                onClick={() => setSent((prev) => prev.filter((x) => x.email !== s.email))}
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
