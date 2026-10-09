"use client";

import { useId, useState } from "react";

const PER_USER = 200;
const PER_GB = 10;

export default function PriceSimulator() {
  const [users, setUsers] = useState(20);
  const [storage, setStorage] = useState(50);
  const [yearly, setYearly] = useState(false);
  const uid = useId();
  const monthly = users * PER_USER + storage * PER_GB;
  const total = yearly ? Math.round(monthly * 0.8) : monthly;

  return (
    <div className="mx-auto w-full max-w-md space-y-4">
      <div className="space-y-1.5">
        <label htmlFor={`${uid}-users`} className="flex justify-between text-xs">
          <span>ユーザー数</span>
          <span className="tabular-nums text-muted-foreground">{users} 人</span>
        </label>
        <input
          id={`${uid}-users`}
          type="range"
          min={1}
          max={200}
          value={users}
          onChange={(e) => setUsers(+e.target.value)}
          aria-valuetext={`${users} 人`}
          className="w-full accent-primary"
        />
      </div>
      <div className="space-y-1.5">
        <label htmlFor={`${uid}-storage`} className="flex justify-between text-xs">
          <span>ストレージ</span>
          <span className="tabular-nums text-muted-foreground">{storage} GB</span>
        </label>
        <input
          id={`${uid}-storage`}
          type="range"
          min={1}
          max={500}
          value={storage}
          onChange={(e) => setStorage(+e.target.value)}
          aria-valuetext={`${storage} GB`}
          className="w-full accent-primary"
        />
      </div>
      <label className="flex items-center gap-2 text-xs">
        <input type="checkbox" checked={yearly} onChange={(e) => setYearly(e.target.checked)} className="accent-primary" />
        年払い（20% 割引）
      </label>
      <div className="rounded-lg border bg-card p-4">
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-xs text-muted-foreground">月額見積</span>
          <output className="text-2xl font-semibold tabular-nums" aria-live="polite">
            ¥{total.toLocaleString("ja-JP")}
          </output>
        </div>
        <dl className="mt-3 space-y-1 border-t pt-3 text-xs text-muted-foreground">
          <div className="flex justify-between">
            <dt>ユーザー ¥{PER_USER} × {users}</dt>
            <dd className="tabular-nums">¥{(users * PER_USER).toLocaleString("ja-JP")}</dd>
          </div>
          <div className="flex justify-between">
            <dt>ストレージ ¥{PER_GB} × {storage} GB</dt>
            <dd className="tabular-nums">¥{(storage * PER_GB).toLocaleString("ja-JP")}</dd>
          </div>
          {yearly && (
            <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
              <dt>年払い割引</dt>
              <dd className="tabular-nums">−¥{(monthly - total).toLocaleString("ja-JP")}</dd>
            </div>
          )}
        </dl>
      </div>
    </div>
  );
}
