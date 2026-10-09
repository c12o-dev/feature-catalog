"use client";

import { useState } from "react";
import { Play, Clock } from "lucide-react";
import { useStage } from "@/components/stage/stage-context";

const CHAPTERS = [
  { t: "0:00", label: "プロジェクトを作成" },
  { t: "0:48", label: "メンバーを招待" },
  { t: "1:52", label: "タスクを割り当て" },
];

function playerDoc(dark: boolean) {
  const bg = dark ? "#0b0b0f" : "#111318";
  return `<!doctype html><html lang="ja"><head><meta charset="utf-8"><style>
*{box-sizing:border-box;margin:0}
html,body{height:100%;background:${bg};color:#fff;font:12px/1.4 system-ui,sans-serif;overflow:hidden}
.screen{position:absolute;inset:10% 12% 22%;border-radius:8px;background:#f5f5f7;color:#111;padding:10px;display:flex;flex-direction:column;gap:6px}
.bar{height:8px;border-radius:4px;background:#d9dbe1}
.row{display:flex;gap:6px}
.btn{height:16px;width:64px;border-radius:4px;background:#3b5bdb;animation:pulse 9s infinite}
.card{flex:1;height:34px;border-radius:6px;background:#fff;border:1px solid #e3e5ea;opacity:0;animation:pop 9s infinite}
.card:nth-child(2){animation-delay:.3s}.card:nth-child(3){animation-delay:.6s}
.cursor{position:absolute;width:12px;height:12px;border-left:2px solid #111;border-top:2px solid #111;transform:rotate(-15deg);animation:move 9s infinite}
.cap{position:absolute;left:0;right:0;bottom:30px;text-align:center}
.cap span{background:rgba(0,0,0,.7);padding:3px 8px;border-radius:4px;opacity:0;position:absolute;left:50%;transform:translateX(-50%);white-space:nowrap}
.c1{animation:c1 9s infinite}.c2{animation:c2 9s infinite}.c3{animation:c3 9s infinite}
.prog{position:absolute;left:12px;right:12px;bottom:12px;height:3px;background:rgba(255,255,255,.25);border-radius:2px;overflow:hidden}
.prog i{display:block;height:100%;background:#fff;transform-origin:left;animation:prog 9s linear infinite}
@keyframes move{0%{transform:translate(70vw,60vh)}25%{transform:translate(20vw,24vh)}55%{transform:translate(50vw,45vh)}85%{transform:translate(70vw,40vh)}100%{transform:translate(70vw,60vh)}}
@keyframes pulse{25%,30%{filter:brightness(1.4)}0%,24%,31%,100%{filter:none}}
@keyframes pop{0%,30%{opacity:0;transform:translateY(4px)}36%,100%{opacity:1;transform:none}}
@keyframes c1{0%,30%{opacity:1}33%,100%{opacity:0}}
@keyframes c2{0%,33%{opacity:0}36%,63%{opacity:1}66%,100%{opacity:0}}
@keyframes c3{0%,66%{opacity:0}69%,97%{opacity:1}100%{opacity:0}}
@keyframes prog{from{transform:scaleX(0)}to{transform:scaleX(1)}}
@media (prefers-reduced-motion:reduce){*{animation:none!important}.card{opacity:1}.c1{opacity:1}.prog i{transform:scaleX(.3)}.cursor{transform:translate(20vw,24vh)}}
</style></head><body>
<div class="screen"><div class="bar" style="width:40%"></div><div class="row"><div class="btn"></div></div><div class="row"><div class="card"></div><div class="card"></div><div class="card"></div></div></div>
<div class="cursor"></div>
<div class="cap"><span class="c1">「新規作成」をクリック</span><span class="c2">テンプレートを選ぶ</span><span class="c3">カードが追加されます</span></div>
<div class="prog"><i></i></div>
</body></html>`;
}

export default function VideoTutorial() {
  const stage = useStage();
  const dark = stage?.theme === "dark";
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="mx-auto w-full max-w-md space-y-3">
      <div>
        <h3 className="text-sm font-medium">3 分でわかるプロジェクト作成</h3>
        <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="size-3" aria-hidden /> 2:41 · ヘルプセンター
        </p>
      </div>

      <div className="relative aspect-video overflow-hidden rounded-lg border bg-zinc-900">
        {loaded ? (
          <iframe
            title="チュートリアル動画: プロジェクト作成"
            srcDoc={playerDoc(dark)}
            sandbox=""
            className="absolute inset-0 size-full"
          />
        ) : (
          <button
            type="button"
            onClick={() => setLoaded(true)}
            aria-label="チュートリアル動画を再生（2分41秒）"
            className="group absolute inset-0 grid place-items-center bg-gradient-to-br from-zinc-800 to-zinc-950 text-white"
          >
            <span className="absolute left-3 top-3 text-left text-xs text-white/80">プロジェクト作成ガイド</span>
            <span className="grid size-12 place-items-center rounded-full bg-white/15 ring-1 ring-white/30 transition-transform group-hover:scale-105 group-focus-visible:scale-105">
              <Play className="ml-0.5 size-5 fill-white" aria-hidden />
            </span>
            <span className="absolute bottom-2 right-2 rounded bg-black/70 px-1.5 py-0.5 text-xs tabular-nums">2:41</span>
            <span className="absolute bottom-2 left-3 text-xs text-white/60">クリックで読み込み</span>
          </button>
        )}
      </div>

      <ol className="divide-y rounded-md border text-sm">
        {CHAPTERS.map((c) => (
          <li key={c.t} className="flex items-center gap-3 px-3 py-2">
            <span className="w-9 shrink-0 font-mono text-xs tabular-nums text-muted-foreground">{c.t}</span>
            <span className="truncate">{c.label}</span>
          </li>
        ))}
      </ol>
      <p className="text-xs text-muted-foreground" aria-live="polite">
        {loaded ? "プレーヤーを読み込みました" : "再生を押すまで埋め込みを読み込みません（軽量な facade 方式）"}
      </p>
    </div>
  );
}
