import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { CategoryInfo } from "@/lib/catalog";
import { Xray } from "@/components/shell/xray";

/** Editorial index of the 25 categories. Hovering a row tints the page with its hue. */
export function CategoryIndex({ categories, samples }: { categories: CategoryInfo[]; samples?: Record<string, string[]> }) {
  return (
    <Xray slug="hover-micro" as="div" place="tr">
      <ol className="border-t border-line-1">
        {categories.map((c) => (
          <li key={c.slug}>
            <Link
              href={`/c/${c.slug}`}
              data-hue={c.hue}
              style={{ "--cat-hue": c.hue } as React.CSSProperties}
              className="group relative grid grid-cols-[3rem_1fr_auto] items-baseline gap-x-4 gap-y-1 border-b border-line-1 py-5 transition-colors duration-500 hover:bg-cat-dim/40 sm:grid-cols-[4.5rem_minmax(0,1fr)_minmax(0,1fr)_6rem_2rem] sm:py-6"
            >
              <span aria-hidden className="absolute inset-y-0 left-0 w-0.5 origin-top scale-y-0 bg-cat transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-y-100" />
              <span className="idx pl-3 text-xs text-fg-4 transition-colors group-hover:text-cat">{c.code}</span>
              <span className="min-w-0">
                <span className="block font-serif text-xl text-fg-1 sm:text-2xl">{c.name}</span>
                {samples?.[c.slug] && (
                  <span className="mt-1 block truncate text-xs text-fg-4">{samples[c.slug].join(" / ")}</span>
                )}
              </span>
              <span className="col-start-2 font-serif text-sm text-fg-4 italic transition-colors group-hover:text-fg-2 sm:col-start-auto sm:text-lg">{c.en}</span>
              <span className="col-start-3 row-start-1 font-mono text-xs text-fg-3 tabular-nums sm:col-start-auto sm:row-start-auto sm:text-right">
                {c.patterns.length}
                <span className="text-fg-4"> 件</span>
              </span>
              <ArrowUpRight aria-hidden className="hidden size-5 text-fg-4 transition-all duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-cat sm:block" />
            </Link>
          </li>
        ))}
      </ol>
    </Xray>
  );
}
