"use client";

import { Component, useEffect, useId, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { ArrowUpRight, Code2, Moon, RotateCcw, Sun } from "lucide-react";
import { demoRegistry } from "@/components/demos/registry";
import { demoReady, registerDemo } from "@/lib/demo-ready";
import { DemoSkeleton } from "@/components/demos/_skeleton";
import demoSizes from "@/data/demo-sizes.generated.json";
import { StageContext, type StageTheme } from "./stage-context";
import { cn } from "@/lib/utils";
import { Xray } from "@/components/shell/xray";

type Props = {
  demo: string;
  /** /p/[slug] — omitted on the pattern page itself */
  href?: string;
  source?: string;
  label: string;
  size?: "card" | "hero" | "mini";
  /** mount immediately instead of on scroll-in */
  eager?: boolean;
  /** mount immediately and hold the page's loading screen until this demo has rendered */
  preload?: boolean;
  toolbar?: boolean;
  className?: string;
};

/**
 * Neutral frame a demo plays on (v2-launch §3.4). Preloading stages mount at once and count
 * towards the page's loading screen; the others mount when they come near the viewport. A demo
 * that has mounted stays mounted: unmounting off-screen demos made every scroll back re-load and
 * re-render them, which is what left stale frames on screen while scrolling.
 */
// Rendered heights of each demo at 390 / 1440 (scripts/measure-demos.mjs), reserved by hero and card stages. The
// stage reserves them before the demo chunk arrives, so the swap from skeleton to demo doesn't
// move the page (CLS). Unmeasured demos fall back to the skeleton's own height.
const SIZES = demoSizes as Record<string, { sm: number; lg: number; csm?: number; clg?: number }>;

export function Stage({ demo, href, source, label, size = "card", eager, preload, toolbar = true, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  // dark by default (§3.4: the stage sits on --bg-1); light is one click away
  const [theme, setTheme] = useState<StageTheme>("dark");
  const [mounted, setMounted] = useState(!!(eager || preload));
  const readyId = useId();
  const [run, setRun] = useState(0);
  const Demo = demoRegistry[demo];
  // mini: 44px toolbar band + 12px bottom padding around the measured heights, capped at 30rem
  const MINI_MAX = 480;
  const miniSm = SIZES[demo] ? Math.min(MINI_MAX, SIZES[demo].sm + 56) : 240;
  const miniLg = SIZES[demo] ? Math.min(MINI_MAX, SIZES[demo].lg + 56) : 240;
  const miniClipped = !SIZES[demo] || Math.max(SIZES[demo].sm, SIZES[demo].lg) + 56 > MINI_MAX;

  // Not preloading: mount once the stage comes near the viewport (or its <details> opens), then keep it.
  useEffect(() => {
    if (eager || preload || mounted) return;
    const el = ref.current;
    if (!el) return;
    // inside a folded <details>: mount together the moment it opens, not one by one while scrolling
    const details = el.closest("details");
    if (details) {
      const onToggle = () => details.open && setMounted(true);
      if (details.open) setTimeout(onToggle, 0);
      details.addEventListener("toggle", onToggle);
      return () => details.removeEventListener("toggle", onToggle);
    }
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setMounted(true), { rootMargin: "400px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, [eager, preload, mounted]);

  // Preloading: count towards the loading screen until the demo has replaced its skeleton on screen.
  useEffect(() => {
    if (!preload) return;
    const id = `${readyId}:${demo}`;
    registerDemo(id);
    const root = ref.current?.querySelector("[data-demo-root]");
    let live = true;
    const settle = () => requestAnimationFrame(() => requestAnimationFrame(() => live && demoReady(id)));
    if (!root || !demoRegistry[demo]) {
      settle();
      return () => {
        live = false;
        demoReady(id);
      };
    }
    // next/dynamic renders its own skeleton until the chunk is in; done when no skeleton remains
    const check = () => {
      if (root.querySelector("[data-demo-skeleton]")) return false;
      mo.disconnect();
      settle();
      return true;
    };
    const mo = new MutationObserver(check);
    mo.observe(root, { childList: true, subtree: true });
    check();
    return () => {
      live = false;
      mo.disconnect();
      demoReady(id);
    };
  }, [preload, demo, readyId]);

  return (
    <StageContext.Provider value={{ theme, setTheme }}>
      <div
        ref={ref}
        data-stage={theme}
        data-demo={demo}
        data-size={size}
        style={size === "mini" ? ({ "--mini-h-sm": `${miniSm}px`, "--mini-h-lg": `${miniLg}px` } as React.CSSProperties) : undefined}
        className={cn(
          "group/stage relative isolate overflow-hidden rounded-[var(--radius-md)] border border-black/5 shadow-[0_1px_0_rgba(255,255,255,0.04)_inset,0_24px_60px_-32px_rgba(0,0,0,0.9)] transition-colors duration-300",
          size === "hero" && "flex min-h-[16rem] flex-col justify-center",
          size === "card" && "min-h-[12rem]",
          // sized to the demo (measured) so mounting it never shifts the page; taller demos are
          // clipped with a fade at the bottom
          size === "mini" && "h-[var(--mini-h-sm)] sm:h-[var(--mini-h-lg)]",
          className,
        )}
      >
        {toolbar && (
          <Xray slug="theme-toggle" as="div" place="bl" className="absolute right-2 top-2 z-10 flex items-center gap-0.5 rounded-full border bg-background/80 p-0.5 text-muted-foreground backdrop-blur">
            <ToolButton label={theme === "light" ? "ステージをダークにする" : "ステージをライトにする"} onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
              {theme === "light" ? <Moon className="size-3.5" /> : <Sun className="size-3.5" />}
            </ToolButton>
            <ToolButton label="デモをリセット" onClick={() => setRun((r) => r + 1)}>
              <RotateCcw className="size-3.5" />
            </ToolButton>
            {source && (
              <a href={source} target="_blank" rel="noreferrer" aria-label={`${label} のソースを GitHub で見る`} title="ソースを見る" className={toolClass}>
                <Code2 className="size-3.5" />
              </a>
            )}
            {href && (
              <Link href={href} aria-label={`${label} の詳細`} title="詳細" className={toolClass}>
                <ArrowUpRight className="size-3.5" />
              </Link>
            )}
          </Xray>
        )}
        <div
          className={cn(
            "relative",
            size === "mini" ? cn("h-full p-3 pt-11", miniClipped && "[mask-image:linear-gradient(to_bottom,black_82%,transparent)]") : size === "hero" ? "p-6 sm:p-10" : "p-5 sm:p-7",
            // the toolbar floats top-right: keep the first row of the demo clear of it
            toolbar && size !== "mini" && "pt-12 sm:pt-14",
          )}
        >
          <div
            data-demo-root
            className={cn(
              size === "hero" && SIZES[demo] && "min-h-[var(--demo-h-sm)] sm:min-h-[var(--demo-h-lg)]",
              // cards are measured in place: phone width, and the two-column layout from xl
              size === "card" && SIZES[demo] && "min-h-[var(--demo-h-csm)] sm:min-h-[var(--demo-h-lg)] xl:min-h-[var(--demo-h-clg)]",
            )}
            style={
              size !== "mini" && SIZES[demo]
                ? ({
                    "--demo-h-sm": `${SIZES[demo].sm}px`,
                    "--demo-h-lg": `${SIZES[demo].lg}px`,
                    "--demo-h-csm": `${SIZES[demo].csm ?? SIZES[demo].sm}px`,
                    "--demo-h-clg": `${SIZES[demo].clg ?? SIZES[demo].lg}px`,
                  } as React.CSSProperties)
                : undefined
            }
          >
            {Demo && mounted ? (
              <DemoBoundary key={run} label={label}>
                <Demo />
              </DemoBoundary>
            ) : (
              <Xray slug="skeleton-loader" place="br">
                <DemoSkeleton />
              </Xray>
            )}
          </div>
        </div>
      </div>
    </StageContext.Provider>
  );
}

const toolClass =
  "inline-flex size-7 items-center justify-center rounded-full transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2";

function ToolButton({ label, onClick, children }: { label: string; onClick: () => void; children: ReactNode }) {
  return (
    <button type="button" aria-label={label} title={label} onClick={onClick} className={toolClass}>
      {children}
    </button>
  );
}

class DemoBoundary extends Component<{ label: string; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (this.state.failed)
      return <p className="text-sm text-muted-foreground">{this.props.label} のデモを表示できませんでした。リセットで再試行できます。</p>;
    return this.props.children;
  }
}
