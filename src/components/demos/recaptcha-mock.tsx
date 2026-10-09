"use client";

import { useState } from "react";
import { ShieldCheck, Loader2 } from "lucide-react";

export default function RecaptchaMock() {
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  return (
    <div className="max-w-xs mx-auto">
      <button
        onClick={() => { setState("loading"); setTimeout(() => setState("done"), 800); }}
        disabled={state !== "idle"}
        className="w-full flex items-center gap-3 rounded-md border bg-background p-3 hover:bg-accent transition-colors text-sm"
      >
        <div className="size-6 rounded border-2 grid place-items-center">
          {state === "idle" && <span />}
          {state === "loading" && <Loader2 className="size-4 animate-spin text-muted-foreground" />}
          {state === "done" && <ShieldCheck className="size-4 text-emerald-600" />}
        </div>
        <span>私はロボットではありません</span>
        <div className="ml-auto text-[8px] text-muted-foreground leading-tight text-right">
          <div className="font-bold">reCAPTCHA</div>
          <div>Privacy・Terms</div>
        </div>
      </button>
    </div>
  );
}
