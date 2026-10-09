"use client";

import { useEffect, useRef, useState } from "react";
import { Crosshair, LocateFixed, Navigation, Pause, Satellite } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// simulated walk around a fictional neighbourhood (map units)
const ROUTE: [number, number][] = [
  [180, 420], [180, 380], [180, 340], [180, 300], [220, 300], [260, 300], [300, 300], [340, 300],
  [340, 260], [340, 220], [380, 220], [420, 220], [420, 260], [420, 300], [420, 340], [380, 340],
  [340, 340], [300, 340], [260, 340], [220, 340], [180, 340],
];
const START: [number, number] = [300, 300];
const STEP_MS = 600;

type Phase = "idle" | "locating" | "tracking" | "paused";

export default function Geolocation() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [step, setStep] = useState(0);
  const [follow, setFollow] = useState(true);
  const [view, setView] = useState<[number, number]>(START);
  const [real, setReal] = useState<{ lat: number; lng: number; acc: number } | null>(null);
  const [realErr, setRealErr] = useState<string | null>(null);
  const [watching, setWatching] = useState(false);
  const locateTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const watchId = useRef<number | null>(null);
  const drag = useRef<{ x: number; y: number; vx: number; vy: number } | null>(null);

  useEffect(() => {
    if (phase !== "tracking") return;
    const id = setInterval(() => setStep((s) => (s + 1) % ROUTE.length), STEP_MS);
    return () => clearInterval(id);
  }, [phase]);

  useEffect(
    () => () => {
      if (locateTimer.current) clearTimeout(locateTimer.current);
      if (watchId.current !== null) navigator.geolocation?.clearWatch(watchId.current);
    },
    [],
  );

  const user = ROUTE[step];
  const prev = ROUTE[(step - 1 + ROUTE.length) % ROUTE.length];
  const heading = (Math.atan2(user[1] - prev[1], user[0] - prev[0]) * 180) / Math.PI + 90;
  const hasFix = phase === "tracking" || phase === "paused";
  const center = follow && hasFix ? user : view;

  const locate = () => {
    setPhase("locating");
    if (locateTimer.current) clearTimeout(locateTimer.current);
    locateTimer.current = setTimeout(() => {
      setPhase("tracking");
      setFollow(true);
    }, 900);
  };

  const recenter = () => {
    setFollow(true);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { x: e.clientX, y: e.clientY, vx: center[0], vy: center[1] };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    if (follow && Math.hypot(dx, dy) < 4) return;
    if (follow) setFollow(false);
    setView([Math.min(560, Math.max(40, d.vx - dx)), Math.min(560, Math.max(40, d.vy - dy))]);
  };
  const onPointerUp = () => {
    drag.current = null;
  };

  const toggleReal = () => {
    if (watching) {
      if (watchId.current !== null) navigator.geolocation.clearWatch(watchId.current);
      watchId.current = null;
      setWatching(false);
      return;
    }
    if (!("geolocation" in navigator)) {
      setRealErr("このブラウザは位置情報に対応していません");
      return;
    }
    setRealErr(null);
    setWatching(true);
    watchId.current = navigator.geolocation.watchPosition(
      (p) => setReal({ lat: p.coords.latitude, lng: p.coords.longitude, acc: p.coords.accuracy }),
      (err) => {
        setRealErr(err.code === err.PERMISSION_DENIED ? "位置情報の利用が許可されませんでした" : "位置を取得できませんでした");
        setWatching(false);
        if (watchId.current !== null) navigator.geolocation.clearWatch(watchId.current);
        watchId.current = null;
      },
      { enableHighAccuracy: true },
    );
  };

  const status =
    phase === "locating" ? "現在地を測位しています" : phase === "tracking" ? (follow ? "現在地を追従中" : "追従を一時解除しました") : "";

  return (
    <div className="mx-auto max-w-lg space-y-3">
      <div
        className="relative h-72 touch-none overflow-hidden rounded-lg border bg-[#eef1ea] select-none dark:bg-zinc-900"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        role="application"
        aria-label="地図。ドラッグで移動"
      >
        <div
          className="absolute left-1/2 top-1/2 transition-transform duration-500 ease-out"
          style={{ transform: `translate(${-center[0]}px, ${-center[1]}px)` }}
        >
          <svg width="600" height="600" viewBox="0 0 600 600" aria-hidden className="block">
            {/* blocks */}
            {Array.from({ length: 6 }).map((_, r) =>
              Array.from({ length: 6 }).map((__, c) => (
                <rect
                  key={`${r}-${c}`}
                  x={c * 80 + 70}
                  y={r * 80 + 70}
                  width="60"
                  height="60"
                  rx="4"
                  className={(r + c) % 5 === 0 ? "fill-emerald-200/70 dark:fill-emerald-900/40" : "fill-white dark:fill-zinc-800"}
                />
              )),
            )}
            <path d="M0 520 C150 480 300 560 600 500" className="fill-none stroke-sky-300 dark:stroke-sky-900" strokeWidth="18" />
            <text x="300" y="185" textAnchor="middle" className="fill-zinc-400 text-[10px] dark:fill-zinc-500">けやき通り</text>
            <text x="470" y="505" textAnchor="middle" className="fill-sky-600/70 text-[10px] dark:fill-sky-400/60">みなと川</text>
            {/* visited trail */}
            {hasFix && (
              <polyline
                points={ROUTE.slice(0, step + 1).map((p) => p.join(",")).join(" ")}
                className="fill-none stroke-sky-500/60"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}
          </svg>
          {hasFix && (
            <div
              className="absolute transition-transform duration-500 ease-linear"
              style={{ left: 0, top: 0, transform: `translate(${user[0]}px, ${user[1]}px)` }}
            >
              <span className="absolute -left-6 -top-6 size-12 rounded-full bg-sky-500/15 ring-1 ring-sky-500/30" />
              <span
                className="absolute -left-2 -top-2 grid size-4 place-items-center rounded-full border-2 border-white bg-sky-600 shadow dark:border-zinc-900"
                style={{ transform: `rotate(${heading}deg)` }}
              />
            </div>
          )}
        </div>

        {phase === "locating" && (
          <div className="absolute inset-0 grid place-items-center bg-background/40">
            <span className="rounded-full bg-background px-3 py-1 text-xs shadow">測位中…</span>
          </div>
        )}

        {hasFix && (
          <button
            type="button"
            onClick={recenter}
            onPointerDown={(e) => e.stopPropagation()}
            aria-pressed={follow}
            aria-label={follow ? "現在地を追従中" : "現在地に戻って追従"}
            className={cn(
              "absolute bottom-3 right-3 grid size-10 place-items-center rounded-full border bg-background shadow-md",
              follow ? "text-sky-600 dark:text-sky-400" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {follow ? <Navigation className="size-4 fill-current" /> : <LocateFixed className="size-4" />}
          </button>
        )}
        <p className="sr-only" role="status" aria-live="polite">{status}</p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {phase === "idle" || phase === "locating" ? (
          <Button size="sm" onClick={locate} disabled={phase === "locating"}>
            <Crosshair className="size-4" aria-hidden />
            現在地を取得して追従
          </Button>
        ) : (
          <Button size="sm" variant="outline" onClick={() => setPhase(phase === "tracking" ? "paused" : "tracking")}>
            {phase === "tracking" ? <Pause className="size-4" aria-hidden /> : <Navigation className="size-4" aria-hidden />}
            {phase === "tracking" ? "移動を止める" : "移動を再開"}
          </Button>
        )}
        <span className="text-xs text-muted-foreground">
          {hasFix ? (follow ? "地図は現在地に合わせて動きます。ドラッグで解除" : "右下のボタンで追従に戻ります") : "位置はシミュレーションです"}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2 border-t pt-3 text-xs">
        <Button size="xs" variant="ghost" onClick={toggleReal}>
          <Satellite className="size-3" aria-hidden />
          {watching ? "実機の追跡を停止" : "実機の GPS で試す"}
        </Button>
        <span className="text-muted-foreground tabular-nums" aria-live="polite">
          {realErr ??
            (real
              ? `${real.lat.toFixed(5)}, ${real.lng.toFixed(5)}（±${Math.round(real.acc)}m）`
              : watching
                ? "許可を待っています…"
                : "watchPosition で座標を更新し続けます")}
        </span>
      </div>
    </div>
  );
}
