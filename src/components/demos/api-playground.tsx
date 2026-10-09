"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy, Loader2, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

type Method = "GET" | "POST" | "DELETE";

const USERS: Record<string, { id: number; name: string; email: string; plan: string }> = {
  "42": { id: 42, name: "佐藤 美咲", email: "misaki@example.com", plan: "pro" },
  "7": { id: 7, name: "田中 翔", email: "sho@example.com", plan: "free" },
};

function shellQuote(s: string) {
  return `'${s.replace(/'/g, `'\\''`)}'`;
}

function respond(method: Method, path: string, body: string): { status: number; text: string; json: unknown } {
  const m = path.match(/^\/v1\/users(?:\/(\w+))?$/);
  if (!m) return { status: 404, text: "Not Found", json: { error: "not_found", message: `${path} は存在しません` } };
  const id = m[1];
  if (method === "GET") {
    if (!id) return { status: 200, text: "OK", json: { data: Object.values(USERS), total: 2 } };
    const u = USERS[id];
    return u ? { status: 200, text: "OK", json: u } : { status: 404, text: "Not Found", json: { error: "user_not_found" } };
  }
  if (method === "POST") {
    if (id) return { status: 405, text: "Method Not Allowed", json: { error: "method_not_allowed" } };
    try {
      const parsed = JSON.parse(body || "{}");
      return { status: 201, text: "Created", json: { id: 43, ...parsed, created_at: "2026-10-01T00:00:00Z" } };
    } catch {
      return { status: 400, text: "Bad Request", json: { error: "invalid_json", message: "body が JSON として不正です" } };
    }
  }
  if (!id) return { status: 405, text: "Method Not Allowed", json: { error: "method_not_allowed" } };
  return USERS[id] ? { status: 204, text: "No Content", json: null } : { status: 404, text: "Not Found", json: { error: "user_not_found" } };
}

export default function ApiPlayground() {
  const [method, setMethod] = useState<Method>("GET");
  const [path, setPath] = useState("/v1/users/42");
  const [token, setToken] = useState("sk_test_4eC39H");
  const [body, setBody] = useState('{\n  "name": "鈴木 花",\n  "plan": "free"\n}');
  const [res, setRes] = useState<{ status: number; text: string; json: unknown; ms: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const t = timers.current;
    return () => t.forEach((id) => window.clearTimeout(id));
  }, []);

  const hasBody = method === "POST";
  const url = `https://api.example.com${path}`;
  const curl = [
    `curl -X ${method} ${shellQuote(url)}`,
    `  -H ${shellQuote(`Authorization: Bearer ${token}`)}`,
    ...(hasBody ? [`  -H 'Content-Type: application/json'`, `  -d ${shellQuote(body.replace(/\s*\n\s*/g, " "))}`] : []),
  ].join(" \\\n");

  const send = () => {
    setLoading(true);
    const r = respond(method, path.trim(), body);
    const ms = 80 + (path.length * 7) % 60;
    timers.current.push(
      window.setTimeout(() => {
        setRes({ ...r, ms });
        setLoading(false);
      }, 450),
    );
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(curl);
      setCopied(true);
      timers.current.push(window.setTimeout(() => setCopied(false), 1500));
    } catch {
      setCopied(false);
    }
  };

  const ok = res && res.status < 300;

  return (
    <div className="@container w-full">
      <div className="grid gap-3 @xl:grid-cols-2">
        <div className="space-y-2">
          <div className="flex gap-1.5">
            <label className="sr-only" htmlFor="ap-method">メソッド</label>
            <select
              id="ap-method"
              value={method}
              onChange={(e) => setMethod(e.target.value as Method)}
              className="rounded-md border bg-background px-2 py-1.5 font-mono text-xs font-semibold"
            >
              <option>GET</option>
              <option>POST</option>
              <option>DELETE</option>
            </select>
            <label className="sr-only" htmlFor="ap-path">パス</label>
            <input
              id="ap-path"
              value={path}
              onChange={(e) => setPath(e.target.value)}
              spellCheck={false}
              className="min-w-0 flex-1 rounded-md border bg-background px-2 py-1.5 font-mono text-xs"
            />
          </div>
          <div>
            <label htmlFor="ap-token" className="text-xs text-muted-foreground">Authorization (Bearer)</label>
            <input
              id="ap-token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              spellCheck={false}
              className="mt-1 w-full rounded-md border bg-background px-2 py-1.5 font-mono text-xs"
            />
          </div>
          {hasBody && (
            <div>
              <label htmlFor="ap-body" className="text-xs text-muted-foreground">Body (JSON)</label>
              <textarea
                id="ap-body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={4}
                spellCheck={false}
                className="mt-1 w-full resize-none rounded-md border bg-background px-2 py-1.5 font-mono text-xs"
              />
            </div>
          )}
          <div className="rounded-md border bg-muted/50">
            <div className="flex items-center justify-between border-b px-2 py-1">
              <span className="text-xs font-medium">cURL</span>
              <button
                type="button"
                onClick={copy}
                aria-label="cURL をコピー"
                className="grid size-6 place-items-center rounded text-muted-foreground hover:bg-muted"
              >
                {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
              </button>
            </div>
            <pre className="overflow-x-auto p-2 font-mono text-[11px] leading-relaxed">{curl}</pre>
          </div>
          <Button size="sm" onClick={send} disabled={loading} className="w-full">
            {loading ? <Loader2 className="size-3.5 motion-safe:animate-spin" /> : <Play className="size-3.5" />}
            送信
          </Button>
        </div>

        <div className="flex min-w-0 flex-col gap-2">
          <div className="flex items-center justify-between text-xs" aria-live="polite">
            <span className="font-medium">Response</span>
            {res && (
              <span className="flex items-center gap-2 font-mono tabular-nums">
                <span className={ok ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}>
                  {res.status} {res.text}
                </span>
                <span className="text-muted-foreground">{res.ms} ms</span>
              </span>
            )}
          </div>
          <pre className="min-h-32 flex-1 overflow-x-auto rounded-md border bg-muted/50 p-2 font-mono text-[11px] leading-relaxed">
            {res ? (res.json === null ? "(本文なし)" : JSON.stringify(res.json, null, 2)) : <span className="text-muted-foreground">リクエストを編集して送信してください</span>}
          </pre>
          <p className="text-xs text-muted-foreground">試せるパス: /v1/users, /v1/users/42, /v1/users/7</p>
        </div>
      </div>
    </div>
  );
}
