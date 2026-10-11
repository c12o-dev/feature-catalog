"use client";

import { useId, useState, useSyncExternalStore } from "react";
import { Check, Copy, ShieldCheck, Smartphone, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const REF = Date.parse("2026-10-01T09:00:00+09:00");
const TICK = 200;

function subscribe(cb: () => void) {
  const id = setInterval(cb, TICK);
  return () => clearInterval(id);
}
const getSnapshot = () => Math.floor(Date.now() / TICK) * TICK;
const getServerSnapshot = () => REF;

// toy HOTP stand-in: deterministic 6 digits from (secret, counter)
function code(secret: number, counter: number) {
  let h = (secret ^ Math.imul(counter, 0x9e3779b1)) >>> 0;
  h = Math.imul(h ^ (h >>> 16), 0x85ebca6b) >>> 0;
  h = Math.imul(h ^ (h >>> 13), 0xc2b2ae35) >>> 0;
  return String((h ^ (h >>> 16)) % 1_000_000).padStart(6, "0");
}

const accounts = [
  { name: "Tsumiki", user: "aoi@tsumiki.example", secret: 0x5eed01 },
  { name: "Kumo Cloud", user: "aoi.nakamura", secret: 0x5eed02 },
];

export default function TotpAuth() {
  const id = useId();
  const now = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const counter = Math.floor(now / 30000);
  const remainingMs = 30000 - (now % 30000);
  const remaining = Math.ceil(remainingMs / 1000);
  const [input, setInput] = useState("");
  const [result, setResult] = useState<"ok" | "ng" | null>(null);
  const [copied, setCopied] = useState(false);

  const current = code(accounts[0].secret, counter);

  const verify = (e: React.FormEvent) => {
    e.preventDefault();
    // accept the previous window too, like real servers do for clock skew
    const ok = input === current || input === code(accounts[0].secret, counter - 1);
    setResult(ok ? "ok" : "ng");
  };

  return (
    <div className="mx-auto grid w-full max-w-2xl gap-4 sm:grid-cols-2">
      <section aria-label="Authenticator アプリ" className="rounded-2xl border bg-card p-3">
        <div className="mb-2 flex items-center gap-1.5 px-1 text-xs text-muted-foreground">
          <Smartphone className="size-3.5" /> Authenticator
        </div>
        <ul className="space-y-2">
          {accounts.map((a) => {
            const c = code(a.secret, counter);
            return (
              <li key={a.name} className="rounded-lg bg-muted/50 px-3 py-2.5">
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="truncate">
                    <span className="font-medium">{a.name}</span>
                    <span className="text-muted-foreground"> · {a.user}</span>
                  </span>
                </div>
                <div className="mt-1 flex items-center justify-between gap-2">
                  <span
                    className={`font-mono text-2xl tracking-[0.2em] tabular-nums ${remaining <= 5 ? "text-destructive" : "text-primary"}`}
                    aria-label={`コード ${c.split("").join(" ")}`}
                  >
                    {c.slice(0, 3)} {c.slice(3)}
                  </span>
                  {a === accounts[0] && (
                    <button
                      type="button"
                      aria-label="コードを入力欄に貼り付け"
                      onClick={() => {
                        setInput(c);
                        setResult(null);
                        setCopied(true);
                      }}
                      onBlur={() => setCopied(false)}
                      className="rounded p-1 text-muted-foreground hover:bg-background hover:text-foreground"
                    >
                      {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
                    </button>
                  )}
                </div>
                <div className="mt-2 h-1 overflow-hidden rounded-full bg-background">
                  <div
                    className={`h-full origin-left ${remaining <= 5 ? "bg-destructive" : "bg-primary"}`}
                    style={{ transform: `scaleX(${remainingMs / 30000})` }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
        <div className="mt-2 px-1 text-xs text-muted-foreground tabular-nums">あと {remaining} 秒で更新</div>
      </section>

      <form onSubmit={verify} className="flex flex-col rounded-lg border bg-card p-4">
        <div className="flex items-center gap-2 text-sm font-medium">
          <ShieldCheck className="size-4 text-primary" /> 2 段階認証
        </div>
        <p className="mt-1 text-xs text-muted-foreground">Authenticator アプリに表示されている 6 桁のコードを入力してください。</p>
        <label htmlFor={`${id}-otp`} className="mt-3 text-xs font-medium">確認コード</label>
        <input
          id={`${id}-otp`}
          value={input}
          onChange={(e) => {
            setInput(e.target.value.replace(/\D/g, "").slice(0, 6));
            setResult(null);
          }}
          inputMode="numeric"
          autoComplete="one-time-code"
          placeholder="000000"
          aria-invalid={result === "ng"}
          className="mt-1 rounded-md border bg-background px-3 py-2 text-center font-mono text-lg tracking-[0.4em] tabular-nums outline-none focus-visible:ring-2 focus-visible:ring-ring/50 aria-invalid:border-destructive"
        />
        <Button type="submit" className="mt-3" disabled={input.length !== 6}>確認</Button>
        <p aria-live="polite" className="mt-2 flex min-h-5 items-center gap-1 text-xs">
          {result === "ok" && <><Check className="size-3.5 text-emerald-600 dark:text-emerald-400" />認証に成功しました</>}
          {result === "ng" && <span className="inline-flex items-center gap-1 text-destructive"><X className="size-3.5" />コードが一致しません</span>}
        </p>
      </form>
    </div>
  );
}
