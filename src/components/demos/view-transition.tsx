"use client";

import { useCallback, useId, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import { ArrowLeft, MapPin, Star } from "lucide-react";
import { cn } from "@/lib/utils";

type Place = { id: string; name: string; area: string; rating: number; desc: string; from: string; to: string };

const PLACES: Place[] = [
  { id: "a", name: "湖畔のカフェ 青", area: "長野・諏訪", rating: 4.6, desc: "湖を望む窓際席と自家焙煎のコーヒー。朝 7 時から営業。", from: "#7dd3fc", to: "#1e3a8a" },
  { id: "b", name: "古民家ギャラリー 灯", area: "岐阜・高山", rating: 4.8, desc: "築 120 年の町家を改装。季節ごとに地元作家の企画展を開催。", from: "#fcd34d", to: "#b45309" },
  { id: "c", name: "森の図書室", area: "北海道・東川", rating: 4.5, desc: "木漏れ日の閲覧室と 8,000 冊の絵本。予約不要で入れます。", from: "#86efac", to: "#166534" },
];

type DocWithVT = Document & { startViewTransition?: (cb: () => Promise<void> | void) => { finished: Promise<void> } };

const noop = () => () => {};
function subscribeReduce(cb: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

export default function ViewTransition() {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const [openId, setOpenId] = useState<string | null>(null);
  const [last, setLast] = useState<string>("");
  const resolver = useRef<(() => void) | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const prevId = useRef<string | null>(null);

  const supported = useSyncExternalStore(
    noop,
    () => typeof (document as DocWithVT).startViewTransition === "function",
    () => false,
  );
  const reduce = useSyncExternalStore(
    subscribeReduce,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );

  // DOM 更新が commit されたら startViewTransition に渡した Promise を解決する
  useLayoutEffect(() => {
    resolver.current?.();
    resolver.current = null;
    // 遷移後のフォーカス移動（初回マウント時は動かさない）
    const root = rootRef.current;
    if (root && (openId || prevId.current)) {
      const target = openId
        ? root.querySelector<HTMLElement>("[data-vt-heading]")
        : root.querySelector<HTMLElement>(`[data-vt-item="${prevId.current}"]`);
      target?.focus();
    }
    if (openId) prevId.current = openId;
  }, [openId]);

  const navigate = useCallback(
    (next: string | null) => {
      const doc = document as DocWithVT;
      if (!doc.startViewTransition || reduce) {
        setOpenId(next);
        setLast(reduce ? "視差効果を減らす設定のため、アニメーションなしで切り替えました" : "非対応ブラウザのため即時に切り替えました");
        return;
      }
      doc.startViewTransition(
        () =>
          new Promise<void>((resolve) => {
            resolver.current = resolve;
            setOpenId(next);
          }),
      );
      setLast("document.startViewTransition() で遷移しました");
    },
    [reduce],
  );

  const place = PLACES.find((p) => p.id === openId);
  const vt = (p: Place, part: string) => ({ viewTransitionName: `vt${uid}-${part}-${p.id}` }) as React.CSSProperties;

  return (
    <div ref={rootRef} className="mx-auto w-full max-w-md space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="text-muted-foreground">カードを押すと詳細へ遷移</span>
        <span
          className={cn(
            "rounded-full border px-2 py-0.5",
            supported ? "border-emerald-500/40 text-emerald-700 dark:text-emerald-400" : "text-muted-foreground",
          )}
        >
          View Transitions API: {supported ? "対応" : "非対応"}
        </span>
      </div>

      <div className="min-h-[300px] overflow-hidden rounded-lg border bg-card text-card-foreground">
        {!place ? (
          <ul className="divide-y">
            {PLACES.map((p) => (
              <li key={p.id}>
                <button
                  type="button"
                  data-vt-item={p.id}
                  onClick={() => navigate(p.id)}
                  className="flex w-full items-center gap-3 p-3 text-left hover:bg-muted/60 focus-visible:bg-muted/60 focus-visible:outline-none"
                >
                  <span
                    aria-hidden
                    className="size-16 shrink-0 rounded-md"
                    style={{ background: `linear-gradient(135deg, ${p.from}, ${p.to})`, ...vt(p, "img") }}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium" style={vt(p, "title")}>
                      {p.name}
                    </span>
                    <span className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin aria-hidden className="size-3" />
                      {p.area}
                    </span>
                  </span>
                  <span className="flex items-center gap-0.5 text-xs tabular-nums text-muted-foreground">
                    <Star aria-hidden className="size-3 fill-amber-400 text-amber-400" />
                    {p.rating.toFixed(1)}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div>
            <div
              aria-hidden
              className="relative h-36 w-full"
              style={{ background: `linear-gradient(135deg, ${place.from}, ${place.to})`, ...vt(place, "img") }}
            />
            <div className="space-y-2 p-4">
              <h3 data-vt-heading tabIndex={-1} className="text-base font-semibold outline-none" style={vt(place, "title")}>
                {place.name}
              </h3>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin aria-hidden className="size-3" />
                  {place.area}
                </span>
                <span className="flex items-center gap-0.5 tabular-nums">
                  <Star aria-hidden className="size-3 fill-amber-400 text-amber-400" />
                  {place.rating.toFixed(1)}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{place.desc}</p>
              <button
                type="button"
                onClick={() => navigate(null)}
                className="inline-flex items-center gap-1 rounded-md border px-2.5 py-1.5 text-sm hover:bg-muted"
              >
                <ArrowLeft aria-hidden className="size-3.5" />
                一覧へ戻る
              </button>
            </div>
          </div>
        )}
      </div>

      <p aria-live="polite" className="min-h-4 text-xs text-muted-foreground">
        {last}
      </p>
    </div>
  );
}
