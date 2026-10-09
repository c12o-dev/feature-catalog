"use client";

import { useId, useState } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

type Method = "GET" | "POST" | "PATCH" | "DELETE";
type Param = { name: string; type: string; req?: boolean; desc: string };
type Endpoint = {
  id: string;
  group: string;
  method: Method;
  path: string;
  title: string;
  desc: string;
  params: Param[];
  response: string;
};

const ENDPOINTS: Endpoint[] = [
  {
    id: "list-users", group: "Users", method: "GET", path: "/v1/users", title: "ユーザー一覧を取得",
    desc: "ワークスペース内のユーザーをページ単位で返します。作成日時の新しい順です。",
    params: [
      { name: "limit", type: "integer", desc: "1 ページの件数（最大 100）" },
      { name: "cursor", type: "string", desc: "次ページ取得用のカーソル" },
    ],
    response: `{\n  "data": [{ "id": "usr_8f2k", "name": "高橋 美咲" }],\n  "next_cursor": "c_19ad"\n}`,
  },
  {
    id: "create-user", group: "Users", method: "POST", path: "/v1/users", title: "ユーザーを作成",
    desc: "招待メールを送信し、保留状態のユーザーを作成します。",
    params: [
      { name: "email", type: "string", req: true, desc: "招待先のメールアドレス" },
      { name: "role", type: "enum", desc: "admin / member / guest" },
    ],
    response: `{\n  "id": "usr_9a1c",\n  "status": "invited"\n}`,
  },
  {
    id: "get-user", group: "Users", method: "GET", path: "/v1/users/{id}", title: "ユーザーを取得",
    desc: "指定した ID のユーザーを 1 件返します。",
    params: [{ name: "id", type: "string", req: true, desc: "ユーザー ID" }],
    response: `{\n  "id": "usr_8f2k",\n  "name": "高橋 美咲",\n  "role": "admin"\n}`,
  },
  {
    id: "update-user", group: "Users", method: "PATCH", path: "/v1/users/{id}", title: "ユーザーを更新",
    desc: "表示名や役割など、指定したフィールドだけを更新します。",
    params: [
      { name: "id", type: "string", req: true, desc: "ユーザー ID" },
      { name: "name", type: "string", desc: "表示名" },
    ],
    response: `{\n  "id": "usr_8f2k",\n  "updated_at": "2026-10-01T09:00:00+09:00"\n}`,
  },
  {
    id: "delete-user", group: "Users", method: "DELETE", path: "/v1/users/{id}", title: "ユーザーを削除",
    desc: "ユーザーを無効化します。30 日以内であれば復元できます。",
    params: [{ name: "id", type: "string", req: true, desc: "ユーザー ID" }],
    response: `{\n  "deleted": true\n}`,
  },
  {
    id: "list-invoices", group: "Billing", method: "GET", path: "/v1/invoices", title: "請求書一覧を取得",
    desc: "発行済みの請求書を新しい順に返します。",
    params: [{ name: "status", type: "enum", desc: "paid / open / void" }],
    response: `{\n  "data": [{ "id": "inv_2031", "amount": 12800 }]\n}`,
  },
  {
    id: "create-webhook", group: "Webhooks", method: "POST", path: "/v1/webhooks", title: "Webhook を登録",
    desc: "イベント発生時に通知する URL を登録します。",
    params: [
      { name: "url", type: "string", req: true, desc: "通知先 URL（https のみ）" },
      { name: "events", type: "string[]", req: true, desc: "購読するイベント名" },
    ],
    response: `{\n  "id": "wh_77b0",\n  "secret": "whsec_••••"\n}`,
  },
];

const METHOD_STYLE: Record<Method, string> = {
  GET: "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300",
  POST: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
  PATCH: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  DELETE: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300",
};

function MethodTag({ m }: { m: Method }) {
  return (
    <span className={cn("inline-block w-12 shrink-0 rounded px-1 py-px text-center font-mono text-[10px] font-semibold", METHOD_STYLE[m])}>
      {m}
    </span>
  );
}

function Mark({ text, q }: { text: string; q: string }) {
  const i = q ? text.toLowerCase().indexOf(q.toLowerCase()) : -1;
  if (i < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <mark className="rounded-sm bg-amber-200/70 text-inherit dark:bg-amber-500/30">{text.slice(i, i + q.length)}</mark>
      {text.slice(i + q.length)}
    </>
  );
}

export default function ApiDocs() {
  const id = useId();
  const [q, setQ] = useState("");
  const [sel, setSel] = useState("get-user");

  const needle = q.trim().toLowerCase();
  const hits = needle
    ? ENDPOINTS.filter((e) => [e.path, e.title, e.method, e.group, e.desc].join(" ").toLowerCase().includes(needle))
    : ENDPOINTS;
  const groups = [...new Set(hits.map((e) => e.group))];
  const cur = ENDPOINTS.find((e) => e.id === sel)!;

  return (
    <div className="@container w-full">
      <div className="overflow-hidden rounded-lg border bg-background text-sm">
        <div className="border-b p-2">
          <label htmlFor={`${id}-q`} className="sr-only">
            ドキュメントを検索
          </label>
          <div className="flex items-center gap-2 rounded-md border bg-muted/40 px-2.5 focus-within:ring-2 focus-within:ring-ring/50">
            <Search className="size-3.5 shrink-0 text-muted-foreground" aria-hidden />
            <input
              id={`${id}-q`}
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.nativeEvent.isComposing && hits[0]) setSel(hits[0].id);
              }}
              placeholder="エンドポイントを検索（例: user, 請求）"
              className="h-8 min-w-0 flex-1 bg-transparent text-sm outline-none"
            />
            <span className="shrink-0 text-xs text-muted-foreground tabular-nums" aria-live="polite">
              {hits.length} 件
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 @xl:grid-cols-[11rem_1fr] @3xl:grid-cols-[11rem_1fr_15rem]">
          <nav aria-label="API リファレンス" className="max-h-40 overflow-y-auto border-b p-2 @xl:max-h-80 @xl:border-r @xl:border-b-0">
            {groups.length === 0 && <p className="px-1 py-2 text-xs text-muted-foreground">該当なし</p>}
            {groups.map((g) => (
              <div key={g} className="mb-2 last:mb-0">
                <div className="px-1 pb-1 text-xs font-medium text-muted-foreground">{g}</div>
                <ul className="space-y-px">
                  {hits
                    .filter((e) => e.group === g)
                    .map((e) => (
                      <li key={e.id}>
                        <button
                          type="button"
                          onClick={() => setSel(e.id)}
                          aria-current={sel === e.id ? "page" : undefined}
                          className={cn(
                            "flex w-full items-center gap-1.5 rounded px-1 py-1 text-left text-xs hover:bg-muted",
                            sel === e.id && "bg-muted font-medium",
                          )}
                        >
                          <MethodTag m={e.method} />
                          <span className="min-w-0 truncate font-mono">
                            <Mark text={e.path} q={q.trim()} />
                          </span>
                        </button>
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </nav>

          <article className="min-w-0 space-y-3 p-4">
            <div className="flex flex-wrap items-center gap-2">
              <MethodTag m={cur.method} />
              <code className="min-w-0 font-mono text-xs break-all">{cur.path}</code>
            </div>
            <h3 className="text-base font-semibold">{cur.title}</h3>
            <p className="text-sm text-muted-foreground">{cur.desc}</p>
            <div>
              <div className="mb-1.5 text-xs font-medium">パラメータ</div>
              <ul className="divide-y rounded-md border">
                {cur.params.map((p) => (
                  <li key={p.name} className="px-3 py-2">
                    <div className="flex flex-wrap items-baseline gap-x-2">
                      <code className="font-mono text-xs font-medium">{p.name}</code>
                      <span className="text-xs text-muted-foreground">{p.type}</span>
                      {p.req && <span className="text-xs text-red-600 dark:text-red-400">必須</span>}
                    </div>
                    <div className="text-xs text-muted-foreground">{p.desc}</div>
                  </li>
                ))}
              </ul>
            </div>
          </article>

          <aside aria-label="レスポンス例" className="min-w-0 border-t bg-muted/40 p-3 @xl:col-span-2 @3xl:col-span-1 @3xl:border-t-0 @3xl:border-l">
            <div className="mb-1.5 text-xs font-medium text-muted-foreground">レスポンス 200</div>
            <pre className="overflow-x-auto rounded-md bg-zinc-950 p-3 font-mono text-[11px] leading-relaxed text-zinc-100">
              {cur.response}
            </pre>
          </aside>
        </div>
      </div>
    </div>
  );
}
