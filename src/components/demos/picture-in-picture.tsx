"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { Maximize2, PictureInPicture2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Mode = "inline" | "native" | "float";
const CW = 320;
const CH = 180;

function draw(ctx: CanvasRenderingContext2D, t: number) {
  const g = ctx.createLinearGradient(0, 0, CW, CH);
  g.addColorStop(0, "#1e293b");
  g.addColorStop(1, "#312e81");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, CW, CH);
  // equaliser bars
  for (let i = 0; i < 16; i++) {
    const h = 20 + Math.abs(Math.sin(t * 2 + i * 0.7)) * 60;
    ctx.fillStyle = `hsla(${200 + i * 6}, 80%, 70%, 0.85)`;
    ctx.fillRect(40 + i * 15, 120 - h, 9, h);
  }
  ctx.fillStyle = "rgba(255,255,255,0.9)";
  ctx.font = "600 14px system-ui, sans-serif";
  ctx.fillText("週次ミーティング 録画", 16, 150);
  const s = Math.floor(t) % 3600;
  ctx.font = "12px ui-monospace, monospace";
  ctx.fillStyle = "rgba(255,255,255,0.7)";
  ctx.fillText(`${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")} / 42:10`, 16, 168);
  ctx.fillStyle = "#ef4444";
  ctx.beginPath();
  ctx.arc(CW - 20, 20, 5, 0, Math.PI * 2);
  ctx.fill();
}

export default function PictureInPicture() {
  const reduce = useReducedMotion();
  const canvas = useRef<HTMLCanvasElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [mode, setMode] = useState<Mode>("inline");
  const [note, setNote] = useState("");

  useEffect(() => {
    const c = canvas.current;
    const v = video.current;
    const ctx = c?.getContext("2d");
    if (!c || !v || !ctx) return;
    let raf = 0;
    const start = performance.now();
    const stream = typeof c.captureStream === "function" ? c.captureStream(30) : null;
    if (stream) {
      v.srcObject = stream;
      v.play().catch(() => {});
    }
    if (reduce) {
      draw(ctx, 0);
    } else {
      const loop = (now: number) => {
        draw(ctx, (now - start) / 1000);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    }
    const onEnter = () => setMode("native");
    const onLeave = () => {
      setMode("inline");
      setNote("");
    };
    v.addEventListener("enterpictureinpicture", onEnter);
    v.addEventListener("leavepictureinpicture", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      v.removeEventListener("enterpictureinpicture", onEnter);
      v.removeEventListener("leavepictureinpicture", onLeave);
      if (document.pictureInPictureElement === v) document.exitPictureInPicture().catch(() => {});
      stream?.getTracks().forEach((tr) => tr.stop());
      v.srcObject = null;
    };
  }, [reduce]);

  const openPip = async () => {
    const v = video.current;
    if (v && document.pictureInPictureEnabled && v.srcObject && !v.disablePictureInPicture) {
      try {
        await v.requestPictureInPicture();
        setNote("OS の小窓で再生中です。ほかのタブに移っても見られます。");
        return;
      } catch {
        /* fall through */
      }
    }
    setMode("float");
    setNote("このブラウザは Picture-in-Picture API に未対応のため、ページ内の小窓で表示しています。");
  };

  const close = async () => {
    if (mode === "native" && document.pictureInPictureElement) await document.exitPictureInPicture().catch(() => {});
    setMode("inline");
    setNote("");
  };

  const floating = mode !== "inline";

  return (
    <div className="mx-auto w-full max-w-xl space-y-3">
      <canvas ref={canvas} width={CW} height={CH} className="hidden" aria-hidden />
      <div className="relative min-h-56 overflow-hidden rounded-lg border bg-card">
        <div className="relative aspect-video bg-zinc-900">
          {floating && (
            <div className="absolute inset-0 grid place-items-center text-center text-xs text-zinc-400">
              <div className="space-y-1">
                <PictureInPicture2 className="mx-auto size-6" aria-hidden />
                <p>小窓で再生中</p>
              </div>
            </div>
          )}
          <div
            className={cn(
              "overflow-hidden bg-zinc-900",
              mode === "float"
                ? "absolute right-3 bottom-3 z-10 w-[45%] max-w-48 rounded-md shadow-xl ring-1 ring-white/20"
                : mode === "native"
                  ? "absolute size-px opacity-0"
                  : "absolute inset-0",
            )}
          >
            {/* Muted, canvas-generated stream: no network media */}
            <video ref={video} muted playsInline aria-label="週次ミーティングの録画（デモ映像）" className="block aspect-video w-full" />
            {mode === "float" && (
              <div className="absolute top-1 right-1 flex gap-1">
                <button type="button" aria-label="元の位置に戻す" onClick={close} className="grid size-6 place-items-center rounded bg-black/60 text-white hover:bg-black/80">
                  <Maximize2 className="size-3" />
                </button>
                <button type="button" aria-label="小窓を閉じる" onClick={close} className="grid size-6 place-items-center rounded bg-black/60 text-white hover:bg-black/80">
                  <X className="size-3" />
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2 p-3">
          <div className="min-w-0">
            <p className="text-sm font-medium">週次ミーティング 10/1</p>
            <p className="text-xs text-muted-foreground">プロダクトチーム · 42 分</p>
          </div>
          {floating ? (
            <Button size="sm" variant="outline" onClick={close}>
              <Maximize2 className="size-3.5" />
              元に戻す
            </Button>
          ) : (
            <Button size="sm" variant="outline" onClick={openPip}>
              <PictureInPicture2 className="size-3.5" />
              小窓で再生
            </Button>
          )}
        </div>
      </div>
      <p aria-live="polite" className="min-h-4 text-xs text-muted-foreground">{note}</p>
    </div>
  );
}
