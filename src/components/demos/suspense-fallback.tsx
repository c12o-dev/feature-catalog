"use client";

import { Suspense, use, useEffect, useState, useSyncExternalStore } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

type Profile = { name: string; team: string; projects: number };
type Activity = { id: number; text: string; when: string }[];
type Entry = { promise: Promise<unknown>; flush: () => void };
type Cache = Map<string, Entry>;

function load<T>(cache: Cache, key: string, ms: number, value: T): Promise<T> {
  let e = cache.get(key);
  if (!e) {
    let flush = () => {};
    const promise = new Promise<T>((resolve) => {
      const t = setTimeout(() => resolve(value), ms);
      flush = () => {
        clearTimeout(t);
        resolve(value);
      };
    });
    e = { promise, flush };
    cache.set(key, e);
  }
  return e.promise as Promise<T>;
}

const PROFILE: Profile = { name: "佐藤 美咲", team: "プロダクトデザイン", projects: 12 };
const ACTIVITY: Activity = [
  { id: 1, text: "「料金ページ改善」にコメントしました", when: "09:12" },
  { id: 2, text: "デザインシステム v3 をレビューしました", when: "08:47" },
  { id: 3, text: "新しいタスクを 2 件作成しました", when: "昨日" },
];

function ProfileCard({ promise }: { promise: Promise<Profile> }) {
  const p = use(promise);
  return (
    <div className="flex items-center gap-3">
      <div className="grid size-10 shrink-0 place-items-center rounded-full bg-sky-100 text-sm font-medium text-sky-700 dark:bg-sky-950 dark:text-sky-300">
        {p.name[0]}
      </div>
      <div className="min-w-0">
        <div className="text-sm font-medium">{p.name}</div>
        <div className="text-xs text-muted-foreground">
          {p.team} · <span className="tabular-nums">{p.projects}</span> プロジェクト
        </div>
      </div>
    </div>
  );
}

function ProfileFallback() {
  return (
    <div className="flex items-center gap-3">
      <Skeleton className="size-10 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-2.5 w-40 max-w-full" />
      </div>
    </div>
  );
}

function ActivityList({ promise }: { promise: Promise<Activity> }) {
  const items = use(promise);
  return (
    <ul className="divide-y">
      {items.map((a) => (
        <li key={a.id} className="flex items-center justify-between gap-3 py-2 text-sm">
          <span className="min-w-0 truncate">{a.text}</span>
          <span className="shrink-0 text-xs tabular-nums text-muted-foreground">{a.when}</span>
        </li>
      ))}
    </ul>
  );
}

function ActivityFallback() {
  return (
    <div className="space-y-3 py-2">
      {[0, 1, 2].map((i) => (
        <div key={i} className="flex justify-between gap-3">
          <Skeleton className="h-3 w-3/4" />
          <Skeleton className="h-3 w-8" />
        </div>
      ))}
    </div>
  );
}

function Boundary({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="relative rounded-md border border-dashed border-border p-3 pt-4">
      <span className="absolute -top-2 left-2 bg-card px-1 font-mono text-[11px] text-muted-foreground">
        {"<Suspense>"} {label}
      </span>
      {children}
    </section>
  );
}

const noop = () => () => {};

export default function SuspenseFallback() {
  const [gen, setGen] = useState(0);
  const [cache] = useState<Cache>(() => new Map());
  const isClient = useSyncExternalStore(noop, () => true, () => false);

  // Clear pending timers on unmount (settling their promises so nothing dangles).
  useEffect(() => () => cache.forEach((e) => e.flush()), [cache]);

  return (
    <div className="mx-auto w-full max-w-md overflow-hidden rounded-lg border bg-card">
      <div className="flex items-center justify-between border-b px-3 py-2">
        <span className="text-sm font-medium">ダッシュボード</span>
        <Button size="sm" variant="outline" onClick={() => setGen((g) => g + 1)}>
          <RefreshCw />
          再読み込み
        </Button>
      </div>
      <div className="space-y-4 p-3">
        <Boundary label="プロフィール（0.8 秒）">
          {isClient ? (
            <Suspense fallback={<ProfileFallback />}>
              <ProfileCard promise={load(cache, `p${gen}`, 800, PROFILE)} />
            </Suspense>
          ) : (
            <ProfileFallback />
          )}
        </Boundary>
        <Boundary label="最近のアクティビティ（2 秒）">
          {isClient ? (
            <Suspense fallback={<ActivityFallback />}>
              <ActivityList promise={load(cache, `a${gen}`, 2000, ACTIVITY)} />
            </Suspense>
          ) : (
            <ActivityFallback />
          )}
        </Boundary>
        <p className="text-xs text-muted-foreground">
          境界ごとに独立して fallback を表示し、準備できたものから順に差し替わります。
        </p>
      </div>
    </div>
  );
}
