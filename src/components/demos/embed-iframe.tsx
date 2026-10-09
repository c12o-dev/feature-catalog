"use client";

import { useMemo, useState } from "react";
import { ExternalLink, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStage } from "@/components/stage/stage-context";

type Kind = "post" | "video";

function postDoc(dark: boolean) {
  const bg = dark ? "#0f1115" : "#ffffff";
  const fg = dark ? "#e7e9ee" : "#0f1419";
  const mute = dark ? "#8b93a1" : "#5b6573";
  const line = dark ? "#262b33" : "#e5e7eb";
  return `<!doctype html><html lang="ja"><head><meta charset="utf-8"><style>
*{box-sizing:border-box;margin:0}body{font:14px/1.6 system-ui,sans-serif;background:${bg};color:${fg};padding:14px;border:1px solid ${line};border-radius:12px;height:100vh;overflow:hidden}
.h{display:flex;gap:10px;align-items:center}.av{width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#60a5fa,#a78bfa)}
.n{font-weight:600}.u{color:${mute};font-size:12px}.t{margin:10px 0}.img{height:70px;border-radius:8px;background:linear-gradient(120deg,#fbbf24,#f472b6 60%,#818cf8)}
.f{display:flex;gap:16px;margin-top:10px;color:${mute};font-size:12px}button{all:unset;cursor:pointer}button:focus-visible{outline:2px solid #60a5fa;border-radius:4px}.on{color:#f43f5e}
.br{position:absolute;top:14px;right:14px;font-size:11px;color:${mute}}
</style></head><body><span class="br">ひとこと</span>
<div class="h"><div class="av"></div><div><div class="n">小林 ひなた</div><div class="u">@hinata_k · 10月1日</div></div></div>
<p class="t">新しいカフェで朝ごはん。窓際の席は光がきれいで、つい長居してしまう。</p>
<div class="img" role="img" aria-label="朝の光のイメージ"></div>
<div class="f"><button id="l" aria-pressed="false">♡ <span id="c">128</span></button><span>↻ 12</span><span>💬 8</span></div>
<script>var b=document.getElementById('l'),c=document.getElementById('c'),on=false;b.onclick=function(){on=!on;b.className=on?'on':'';b.setAttribute('aria-pressed',on);c.textContent=on?129:128;b.firstChild.nodeValue=on?'♥ ':'♡ '}</script>
</body></html>`;
}

function videoDoc() {
  return `<!doctype html><html lang="ja"><head><meta charset="utf-8"><style>
*{box-sizing:border-box;margin:0}body{font:13px system-ui,sans-serif;background:#000;color:#fff;height:100vh;overflow:hidden;border-radius:12px;position:relative}
.bg{position:absolute;inset:0;background:radial-gradient(circle at 30% 40%,#334155,#0b1020)}
.t{position:absolute;top:12px;left:14px;font-weight:600;text-shadow:0 1px 2px #000}
.p{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:56px;height:56px;border-radius:50%;background:rgba(255,255,255,.9);border:0;cursor:pointer}
.p:after{content:"";position:absolute;left:22px;top:17px;border-left:16px solid #111;border-top:11px solid transparent;border-bottom:11px solid transparent}
.p:focus-visible{outline:3px solid #60a5fa}.bar{position:absolute;left:0;right:0;bottom:0;height:4px;background:#ffffff33}.bar i{display:block;height:100%;width:0;background:#f43f5e;transition:width .3s}
.s{position:absolute;bottom:10px;right:12px;font-size:11px;opacity:.8}
</style></head><body><div class="bg"></div><div class="t">はじめての水彩：にじみの基本</div>
<button class="p" id="p" aria-label="再生"></button><div class="bar"><i id="b"></i></div><div class="s" id="s">0:00 / 8:24</div>
<script>var p=document.getElementById('p'),b=document.getElementById('b'),s=document.getElementById('s'),t=0,id=null;p.onclick=function(){if(id){clearInterval(id);id=null;p.style.opacity=1;p.setAttribute('aria-label','再生');return}p.style.opacity=.25;p.setAttribute('aria-label','一時停止');id=setInterval(function(){t=(t+1)%505;b.style.width=(t/504*100)+'%';s.textContent=Math.floor(t/60)+':'+String(t%60).padStart(2,'0')+' / 8:24'},1000)}</script>
</body></html>`;
}

export default function EmbedIframe() {
  const stage = useStage();
  const dark = stage?.theme === "dark";
  const [kind, setKind] = useState<Kind>("post");
  const [consent, setConsent] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const doc = useMemo(() => (kind === "post" ? postDoc(dark) : videoDoc()), [kind, dark]);

  const choose = (k: Kind) => {
    setKind(k);
    setLoaded(false);
  };

  return (
    <div className="mx-auto w-full max-w-lg space-y-3 rounded-lg border bg-card p-4 text-card-foreground">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-semibold">週末のおすすめ</h3>
        <div role="radiogroup" aria-label="埋め込みの種類" className="inline-flex rounded-md border bg-muted p-0.5 text-xs">
          {(["post", "video"] as const).map((k) => (
            <button
              key={k}
              type="button"
              role="radio"
              aria-checked={kind === k}
              onClick={() => choose(k)}
              className={kind === k ? "rounded bg-background px-2.5 py-1 font-medium shadow-sm" : "rounded px-2.5 py-1 text-muted-foreground"}
            >
              {k === "post" ? "SNS 投稿" : "動画"}
            </button>
          ))}
        </div>
      </div>
      <p className="text-sm text-muted-foreground">本文の途中に、外部サービスの投稿をそのまま差し込めます。</p>

      <div className="relative">
        {consent ? (
          <>
            {!loaded && <div aria-hidden className="absolute inset-0 animate-pulse rounded-xl bg-muted" />}
            <iframe
              key={`${kind}-${dark}`}
              title={kind === "post" ? "埋め込まれた SNS 投稿" : "埋め込まれた動画"}
              srcDoc={doc}
              sandbox="allow-scripts"
              loading="lazy"
              onLoad={() => setLoaded(true)}
              className={`block w-full rounded-xl border-0 ${kind === "post" ? "h-64" : "aspect-video"}`}
            />
          </>
        ) : (
          <div className={`grid place-items-center rounded-xl border border-dashed bg-muted/50 p-4 text-center ${kind === "post" ? "h-64" : "aspect-video"}`}>
            <div className="max-w-xs space-y-2">
              <ShieldCheck className="mx-auto size-5 text-muted-foreground" aria-hidden />
              <p className="text-sm font-medium">外部コンテンツを読み込みますか？</p>
              <p className="text-xs text-muted-foreground">読み込むと、埋め込み元のサービスに閲覧情報が送られる場合があります。</p>
              <Button size="sm" onClick={() => setConsent(true)}>読み込む</Button>
            </div>
          </div>
        )}
      </div>
      <p className="flex items-center gap-1 text-xs text-muted-foreground">
        <ExternalLink className="size-3" aria-hidden />
        iframe（sandbox 付き）で埋め込み · 中のボタンも操作できます
      </p>
    </div>
  );
}
