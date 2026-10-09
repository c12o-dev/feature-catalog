"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { useStage, type StageTheme } from "@/components/stage/stage-context";

type Mode = "light" | "dark" | "system";

const opts = [
  { v: "light", label: "ライト", icon: Sun },
  { v: "dark", label: "ダーク", icon: Moon },
  { v: "system", label: "システム", icon: Monitor },
] as const;

const QUERY = "(prefers-color-scheme: dark)";
function subscribe(cb: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}
const getOsDark = () => window.matchMedia(QUERY).matches;
const getServerOsDark = () => false;

/** Switches the theme of the stage this demo sits on, not the whole site. */
export default function ThemeToggleDemo() {
  const stage = useStage();
  const [local, setLocal] = useState<StageTheme>("light");
  const [mode, setMode] = useState<Mode>(stage?.theme ?? "light");
  const osDark = useSyncExternalStore(subscribe, getOsDark, getServerOsDark);
  const theme: StageTheme = stage?.theme ?? (mode === "system" ? (osDark ? "dark" : "light") : local);
  const setTheme = (t: StageTheme) => (stage ? stage.setTheme(t) : setLocal(t));

  const stageRef = useRef(stage);
  useEffect(() => {
    stageRef.current = stage;
  }, [stage]);

  // Follow OS changes while in "system" mode (runs only when the OS value or mode changes).
  useEffect(() => {
    if (mode !== "system") return;
    const s = stageRef.current;
    const want: StageTheme = osDark ? "dark" : "light";
    if (s && s.theme !== want) s.setTheme(want);
  }, [mode, osDark]);

  // If the viewer flips the stage from the toolbar away from the OS value, show the explicit theme.
  const shown: Mode = mode === "system" && theme === (osDark ? "dark" : "light") ? "system" : theme;

  const choose = (m: Mode) => {
    setMode(m);
    setTheme(m === "system" ? (getOsDark() ? "dark" : "light") : m);
  };

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div role="radiogroup" aria-label="テーマ" className="inline-flex rounded-lg bg-muted p-1">
        {opts.map((o) => (
          <button
            key={o.v}
            role="radio"
            aria-checked={shown === o.v}
            onClick={() => choose(o.v)}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm transition-colors sm:px-3 ${
              shown === o.v ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <o.icon className="size-4" />
            {o.label}
          </button>
        ))}
      </div>
      <div className="w-full max-w-xs rounded-lg border bg-card p-3 text-card-foreground shadow-sm">
        <div className="flex items-center gap-2">
          <span className="size-8 rounded-full bg-muted" />
          <div className="flex-1 space-y-1.5">
            <div className="h-2 w-2/3 rounded bg-foreground/80" />
            <div className="h-2 w-1/3 rounded bg-muted-foreground/40" />
          </div>
        </div>
        <div className="mt-3 h-6 w-20 rounded-md bg-primary" />
      </div>
      <p className="text-xs text-muted-foreground" aria-live="polite">
        {shown === "system"
          ? `OS の設定に追従中（現在: ${theme === "dark" ? "ダーク" : "ライト"}）`
          : "このステージのテーマだけが切り替わります"}
      </p>
    </div>
  );
}
