"use client";

import { useId, useRef, useState } from "react";
import { Reorder, useReducedMotion } from "motion/react";
import { ArrowDownAZ, ChevronDown, ChevronUp, GripVertical, Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";

type Task = { id: string; title: string; tag: string };

const TASKS: Task[] = [
  { id: "a", title: "デザインレビュー", tag: "デザイン" },
  { id: "b", title: "API 仕様の確定", tag: "開発" },
  { id: "c", title: "リリースノート作成", tag: "広報" },
  { id: "d", title: "負荷テスト", tag: "開発" },
  { id: "e", title: "ユーザーインタビュー", tag: "リサーチ" },
];

export default function FlipAnimation() {
  const [items, setItems] = useState(TASKS);
  const [announce, setAnnounce] = useState("");
  const seed = useRef(11);
  const reduce = useReducedMotion();
  const uid = useId();
  const transition = reduce ? { duration: 0 } : { type: "spring" as const, stiffness: 500, damping: 40 };

  const shuffle = () => {
    setItems((it) => {
      const a = [...it];
      for (let i = a.length - 1; i > 0; i--) {
        seed.current = (seed.current * 16807) % 2147483647;
        const j = seed.current % (i + 1);
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    });
    setAnnounce("並び順をシャッフルしました");
  };

  const sort = () => {
    setItems((it) => [...it].sort((x, y) => x.id.localeCompare(y.id)));
    setAnnounce("元の順に戻しました");
  };

  const move = (index: number, dir: -1 | 1) => {
    const to = index + dir;
    if (to < 0 || to >= items.length) return;
    const a = [...items];
    [a[index], a[to]] = [a[to], a[index]];
    setItems(a);
    setAnnounce(`「${items[index].title}」を ${to + 1} 番目に移動しました`);
    requestAnimationFrame(() => {
      const id = items[index].id;
      const pref = document.getElementById(`${uid}-${id}-${dir === -1 ? "up" : "down"}`) as HTMLButtonElement | null;
      const alt = document.getElementById(`${uid}-${id}-${dir === -1 ? "down" : "up"}`) as HTMLButtonElement | null;
      (pref && !pref.disabled ? pref : alt)?.focus();
    });
  };

  return (
    <div className="mx-auto max-w-sm space-y-3">
      <p className="sr-only" role="status" aria-live="polite">{announce}</p>
      <div className="flex flex-wrap gap-2">
        <Button size="sm" onClick={shuffle}>
          <Shuffle className="size-3.5" aria-hidden />
          シャッフル
        </Button>
        <Button size="sm" variant="outline" onClick={sort}>
          <ArrowDownAZ className="size-3.5" aria-hidden />
          元に戻す
        </Button>
      </div>
      <Reorder.Group axis="y" values={items} onReorder={setItems} className="space-y-1.5" aria-label="タスク（ドラッグまたは矢印ボタンで並べ替え）">
        {items.map((it, i) => (
          <Reorder.Item
            key={it.id}
            value={it}
            transition={transition}
            className="flex items-center gap-2 rounded-lg border bg-card px-2 py-2 text-sm shadow-xs"
          >
            <GripVertical className="size-4 shrink-0 cursor-grab text-muted-foreground active:cursor-grabbing" aria-hidden />
            <span className="w-4 text-xs text-muted-foreground tabular-nums">{i + 1}</span>
            <span className="min-w-0 flex-1 truncate select-none">{it.title}</span>
            <span className="hidden rounded bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground min-[360px]:inline">{it.tag}</span>
            <div className="flex">
              <button
                id={`${uid}-${it.id}-up`}
                type="button"
                onClick={() => move(i, -1)}
                disabled={i === 0}
                aria-label={`${it.title} を上へ`}
                className="grid size-6 place-items-center rounded text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-30"
              >
                <ChevronUp className="size-4" />
              </button>
              <button
                id={`${uid}-${it.id}-down`}
                type="button"
                onClick={() => move(i, 1)}
                disabled={i === items.length - 1}
                aria-label={`${it.title} を下へ`}
                className="grid size-6 place-items-center rounded text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-30"
              >
                <ChevronDown className="size-4" />
              </button>
            </div>
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </div>
  );
}
