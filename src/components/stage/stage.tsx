"use client";

import { Component, useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { ArrowUpRight, Code2, Moon, RotateCcw, Sun } from "lucide-react";
import { demoRegistry } from "@/components/demos/registry";
import { DemoSkeleton } from "@/components/demos/_skeleton";
import demoSizes from "@/data/demo-sizes.generated.json";
import { StageContext, type StageTheme } from "./stage-context";
import { cn } from "@/lib/utils";

type Props = {
  demo: string;
  /** /p/[slug] — omitted on the pattern page itself */
  href?: string;
  source?: string;
  label: string;
  size?: "card" | "hero" | "mini";
  /** mount immediately instead of on scroll-in */
  eager?: boolean;
  toolbar?: boolean;
  className?: string;
};

const UNMOUNT_AFTER_MS = 60_000;

/**
 * Neutral frame a demo plays on (v2-launch §3.4). Mounts the demo when it scrolls near the
 * viewport and unmounts it a minute after it leaves, so timers in off-screen demos stop.
 */
// Rendered heights of each demo in a hero stage at 390 / 1440 (scripts/measure-demos.mjs). The
// stage reserves them before the demo chunk arrives, so the swap from skeleton to demo doesn't
// move the page (CLS). Unmeasured demos fall back to the skeleton's own height.
const SIZES = demoSizes as Record<string, { sm: number; lg: number }>;

export function Stage({ demo, href, source, label, size = "card", eager, toolbar = true, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [theme, setTheme] = useState<StageTheme>("light");
  const [mounted, setMounted] = useState(!!eager);
  const [run, setRun] = useState(0);
  const Demo = demoRegistry[demo];
  // mini: 44px toolbar band + 12px bottom padding around the measured (phone-width) height
  const miniHeight = SIZES[demo] ? Math.min(240, SIZES[demo].sm + 56) : 240;
  const miniClipped = !SIZES[demo] || SIZES[demo].sm + 56 > 240;

  useEffect(() => {
    if (eager) return;
    const el = ref.current;
    if (!el) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          clearTimeout(timer);
          setMounted(true);
        } else {
          clearTimeout(timer);
          timer = setTimeout(() => setMounted(false), UNMOUNT_AFTER_MS);
        }
      },
      { rootMargin: "400px 0px" },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      clearTimeout(timer);
    };
  }, [eager]);

  return (
    <StageContext.Provider value={{ theme, setTheme }}>
      <div
        ref={ref}
        data-stage={theme}
        data-demo={demo}
        style={size === "mini" ? { height: miniHeight } : undefined}
        className={cn(
          "group/stage relative isolate overflow-hidden rounded-[var(--radius-md)] border border-black/5 shadow-[0_1px_0_rgba(255,255,255,0.04)_inset,0_24px_60px_-32px_rgba(0,0,0,0.9)] transition-colors duration-300",
          size === "hero" && "flex min-h-[16rem] flex-col justify-center",
          size === "card" && "min-h-[12rem]",
          // sized to the demo (measured) so mounting it never shifts the page; taller demos are
          // clipped with a fade at the bottom
          size === "mini" && !SIZES[demo] && "h-60",
          className,
        )}
      >
        {toolbar && (
          <div className="absolute right-2 top-2 z-10 flex items-center gap-0.5 rounded-full border bg-background/80 p-0.5 text-muted-foreground backdrop-blur">
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
          </div>
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
            className={cn(size === "hero" && SIZES[demo] && "min-h-[var(--demo-h-sm)] sm:min-h-[var(--demo-h-lg)]")}
            style={size === "hero" && SIZES[demo] ? ({ "--demo-h-sm": `${SIZES[demo].sm}px`, "--demo-h-lg": `${SIZES[demo].lg}px` } as React.CSSProperties) : undefined}
          >
            {Demo && mounted ? (
              <DemoBoundary key={run} label={label}>
                <Demo />
              </DemoBoundary>
            ) : (
              <DemoSkeleton />
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
