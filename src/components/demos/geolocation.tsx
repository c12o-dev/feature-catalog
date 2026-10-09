"use client";

import { useState } from "react";
import { Crosshair } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Geolocation() {
  const [pos, setPos] = useState<{ lat: number; lng: number } | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const fetch = () => {
    if (!navigator.geolocation) { setErr("Geolocation 非対応"); return; }
    navigator.geolocation.getCurrentPosition(
      (p) => { setPos({ lat: p.coords.latitude, lng: p.coords.longitude }); setErr(null); },
      (e) => setErr(e.message)
    );
  };
  return (
    <div className="space-y-2">
      <Button size="sm" onClick={fetch}><Crosshair className="size-4" />現在地を取得</Button>
      {pos && <div className="text-xs font-mono">lat: {pos.lat.toFixed(4)}, lng: {pos.lng.toFixed(4)}</div>}
      {err && <div className="text-xs text-red-600">{err}</div>}
    </div>
  );
}
