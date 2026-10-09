"use client";

import { useState } from "react";
import { ArrowDownLeft, ArrowUpRight, Plus, Wallet as WalletIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Tx = { id: number; label: string; amount: number; date: string };

const AMOUNTS = [1000, 3000, 5000, 10000];
const yen = (n: number) => `¥${n.toLocaleString("ja-JP")}`;

export default function Wallet() {
  const [balance, setBalance] = useState(4820);
  const [amount, setAmount] = useState(3000);
  const [charging, setCharging] = useState(false);
  const [txs, setTxs] = useState<Tx[]>([
    { id: 3, label: "カフェ ソラ", amount: -680, date: "10/01" },
    { id: 2, label: "チャージ", amount: 5000, date: "09/28" },
    { id: 1, label: "コンビニ ハル", amount: -1240, date: "09/27" },
  ]);
  const [nextId, setNextId] = useState(4);
  const [announce, setAnnounce] = useState("");

  const charge = () => {
    setBalance((b) => b + amount);
    setTxs((t) => [{ id: nextId, label: "チャージ", amount, date: "10/01" }, ...t].slice(0, 5));
    setNextId(nextId + 1);
    setCharging(false);
    setAnnounce(`${yen(amount)} をチャージしました。残高 ${yen(balance + amount)}`);
  };

  return (
    <div className="mx-auto max-w-sm space-y-3">
      <p className="sr-only" role="status" aria-live="polite">{announce}</p>

      <div className="rounded-xl border bg-card p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <WalletIcon className="size-3.5" aria-hidden />
            残高
          </span>
          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
            ポイント 1% 還元
          </span>
        </div>
        <div className="mt-1 text-3xl font-semibold tabular-nums">{yen(balance)}</div>

        {charging ? (
          <div className="mt-4 space-y-3">
            <div role="radiogroup" aria-label="チャージ金額" className="grid grid-cols-2 gap-2">
              {AMOUNTS.map((a) => (
                <button
                  key={a}
                  type="button"
                  role="radio"
                  aria-checked={amount === a}
                  onClick={() => setAmount(a)}
                  className={cn(
                    "rounded-md border px-2 py-2 text-sm tabular-nums transition-colors",
                    amount === a
                      ? "border-emerald-600 bg-emerald-50 font-medium text-emerald-800 dark:border-emerald-400 dark:bg-emerald-500/15 dark:text-emerald-200"
                      : "hover:bg-muted",
                  )}
                >
                  {yen(a)}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" className="flex-1" onClick={() => setCharging(false)}>
                キャンセル
              </Button>
              <Button size="sm" className="flex-1" onClick={charge}>
                {yen(amount)} をチャージ
              </Button>
            </div>
          </div>
        ) : (
          <Button size="sm" className="mt-4 w-full" onClick={() => setCharging(true)}>
            <Plus className="size-4" aria-hidden />
            チャージ
          </Button>
        )}
      </div>

      <div className="rounded-xl border bg-card">
        <div className="px-4 pt-3 text-xs font-medium text-muted-foreground">利用履歴</div>
        <ul className="divide-y">
          {txs.map((t) => (
            <li key={t.id} className="flex items-center gap-3 px-4 py-2.5 text-sm motion-safe:animate-in motion-safe:fade-in">
              <span
                className={cn(
                  "grid size-7 shrink-0 place-items-center rounded-full",
                  t.amount > 0 ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300" : "bg-muted text-muted-foreground",
                )}
                aria-hidden
              >
                {t.amount > 0 ? <ArrowDownLeft className="size-3.5" /> : <ArrowUpRight className="size-3.5" />}
              </span>
              <span className="min-w-0 flex-1 truncate">{t.label}</span>
              <span className="text-xs text-muted-foreground tabular-nums">{t.date}</span>
              <span className={cn("w-20 text-right tabular-nums", t.amount > 0 && "text-emerald-700 dark:text-emerald-400")}>
                {t.amount > 0 ? "+" : "−"}
                {yen(Math.abs(t.amount))}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
