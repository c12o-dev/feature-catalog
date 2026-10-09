"use client";

import { useState } from "react";
import { ArrowDown, Plus, X } from "lucide-react";

type Cond = { id: number; field: string; op: string; value: string };
type Action = { id: number; type: string; target: string };

const fields = ["ステータス", "国", "プラン", "登録からの日数"];
const ops = ["=", "≠", "含む", ">", "<"];
const actionTypes = ["タグを付ける", "メールを送る", "担当者を割当", "Slack 風チャンネルに通知"];

const selectCls = "min-w-0 rounded-md border bg-background px-2 py-1.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";
const inputCls = "min-w-0 flex-1 rounded-md border bg-background px-2 py-1.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";
const removeCls = "grid size-8 shrink-0 place-items-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground";

export default function QueryBuilder() {
  const [match, setMatch] = useState<"AND" | "OR">("AND");
  const [conds, setConds] = useState<Cond[]>([
    { id: 1, field: "ステータス", op: "=", value: "有効" },
    { id: 2, field: "プラン", op: "=", value: "Pro" },
  ]);
  const [actions, setActions] = useState<Action[]>([{ id: 1, type: "タグを付ける", target: "優良顧客" }]);
  const [nextId, setNextId] = useState(10);

  const updC = (id: number, patch: Partial<Cond>) => setConds((cs) => cs.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  const updA = (id: number, patch: Partial<Action>) => setActions((as) => as.map((a) => (a.id === id ? { ...a, ...patch } : a)));

  const summary =
    conds.length === 0
      ? "条件なし（すべてに適用）"
      : conds.map((c) => `${c.field} ${c.op} 「${c.value || "…"}」`).join(match === "AND" ? " かつ " : " または ");

  return (
    <div className="mx-auto w-full max-w-lg space-y-2">
      <section className="rounded-lg border bg-card p-3">
        <div className="mb-2 flex flex-wrap items-center gap-2 text-xs font-medium">
          <span className="rounded bg-muted px-1.5 py-0.5 font-semibold">IF</span>
          <label className="inline-flex items-center gap-1 text-muted-foreground">
            次の
            <select aria-label="条件の結合" value={match} onChange={(e) => setMatch(e.target.value as "AND" | "OR")} className="rounded border bg-background px-1 py-0.5 text-xs text-foreground">
              <option value="AND">すべて</option>
              <option value="OR">いずれか</option>
            </select>
            を満たすとき
          </label>
        </div>
        <ul className="space-y-1.5">
          {conds.map((c, i) => (
            <li key={c.id} className="flex flex-wrap gap-1.5 sm:flex-nowrap">
              <select aria-label={`条件 ${i + 1} の項目`} value={c.field} onChange={(e) => updC(c.id, { field: e.target.value })} className={`${selectCls} flex-1 sm:flex-none`}>
                {fields.map((f) => <option key={f}>{f}</option>)}
              </select>
              <select aria-label={`条件 ${i + 1} の演算子`} value={c.op} onChange={(e) => updC(c.id, { op: e.target.value })} className={`${selectCls} w-16`}>
                {ops.map((o) => <option key={o}>{o}</option>)}
              </select>
              <div className="flex min-w-0 basis-full gap-1.5 sm:basis-auto sm:flex-1">
                <input aria-label={`条件 ${i + 1} の値`} value={c.value} onChange={(e) => updC(c.id, { value: e.target.value })} className={inputCls} placeholder="値" />
                <button type="button" aria-label={`条件 ${i + 1} を削除`} onClick={() => setConds((cs) => cs.filter((x) => x.id !== c.id))} className={removeCls}>
                  <X aria-hidden className="size-3.5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
        <button type="button" onClick={() => { setConds((cs) => [...cs, { id: nextId, field: "国", op: "=", value: "" }]); setNextId((n) => n + 1); }} className="mt-2 inline-flex items-center gap-1 text-xs text-primary hover:underline">
          <Plus aria-hidden className="size-3" />条件を追加
        </button>
      </section>

      <div className="flex justify-center text-muted-foreground"><ArrowDown aria-hidden className="size-4" /></div>

      <section className="rounded-lg border bg-card p-3">
        <div className="mb-2 flex items-center gap-2 text-xs font-medium">
          <span className="rounded bg-primary px-1.5 py-0.5 font-semibold text-primary-foreground">THEN</span>
          <span className="text-muted-foreground">次のアクションを実行</span>
        </div>
        <ul className="space-y-1.5">
          {actions.map((a, i) => (
            <li key={a.id} className="flex flex-wrap gap-1.5 sm:flex-nowrap">
              <select aria-label={`アクション ${i + 1} の種類`} value={a.type} onChange={(e) => updA(a.id, { type: e.target.value })} className={`${selectCls} basis-full sm:basis-auto`}>
                {actionTypes.map((t) => <option key={t}>{t}</option>)}
              </select>
              <div className="flex min-w-0 flex-1 gap-1.5">
                <input aria-label={`アクション ${i + 1} の対象`} value={a.target} onChange={(e) => updA(a.id, { target: e.target.value })} className={inputCls} placeholder="対象" />
                <button type="button" aria-label={`アクション ${i + 1} を削除`} onClick={() => setActions((as) => as.filter((x) => x.id !== a.id))} className={removeCls}>
                  <X aria-hidden className="size-3.5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
        <button type="button" onClick={() => { setActions((as) => [...as, { id: nextId, type: "メールを送る", target: "" }]); setNextId((n) => n + 1); }} className="mt-2 inline-flex items-center gap-1 text-xs text-primary hover:underline">
          <Plus aria-hidden className="size-3" />アクションを追加
        </button>
      </section>

      <p aria-live="polite" className="rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground">
        <span className="font-medium text-foreground">もし</span> {summary}
        <span className="font-medium text-foreground"> → </span>
        {actions.length ? actions.map((a) => `${a.type}${a.target ? `（${a.target}）` : ""}`).join("、") : "アクション未設定"}
      </p>
    </div>
  );
}
