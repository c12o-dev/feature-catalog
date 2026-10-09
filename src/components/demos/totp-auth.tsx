"use client";

import { useEffect, useState } from "react";
import { Smartphone } from "lucide-react";

export default function TotpAuth() {
  const [code, setCode] = useState("");
  const [remaining, setRemaining] = useState(30);
  useEffect(() => {
    const update = () => {
      const now = Math.floor(Date.now() / 1000);
      const window = Math.floor(now / 30);
      setCode(((window * 7919) % 1000000).toString().padStart(6, "0"));
      setRemaining(30 - (now % 30));
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="space-y-3 max-w-xs mx-auto text-center">
      <div className="text-xs flex items-center justify-center gap-1 text-muted-foreground">
        <Smartphone className="size-3.5" />Authenticator アプリ
      </div>
      <div className="rounded-lg border bg-background p-4">
        <div className="font-mono text-3xl tabular-nums tracking-widest">{code.slice(0, 3)} {code.slice(3)}</div>
        <div className="mt-2 h-1 rounded-full bg-muted overflow-hidden">
          <div className="h-full bg-blue-500 transition-all duration-1000" style={{ width: `${(remaining / 30) * 100}%` }} />
        </div>
        <div className="text-xs text-muted-foreground mt-1">残り {remaining} 秒</div>
      </div>
    </div>
  );
}
