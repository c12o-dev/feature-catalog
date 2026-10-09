import { ViewTransition } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Stage } from "@/components/stage/stage";
import { getEntry, sourceUrl, type Entry } from "@/lib/catalog";
import { TagList } from "./tag-list";

/** One pattern on a category page: text on the left, its live demo on the right. */
export function PatternCard({ entry }: { entry: Entry }) {
  const alias = entry.aliasOf ? getEntry(entry.aliasOf) : undefined;
  return (
    <article
      id={entry.slug}
      aria-labelledby={`${entry.slug}-h`}
      className="grid scroll-mt-24 gap-6 border-t border-line-1 py-12 xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] xl:gap-10"
    >
      <div className="flex flex-col gap-4">
        <p className="idx text-xs text-cat">{entry.code}</p>
        <ViewTransition name={`title-${entry.slug}`}>
          <h2 id={`${entry.slug}-h`} className="text-[length:var(--fs-h2)] leading-[1.2] text-fg-1">
            <Link href={`/p/${entry.slug}`} className="decoration-cat/60 decoration-1 underline-offset-[6px] hover:underline">
              {entry.name}
            </Link>
          </h2>
        </ViewTransition>
        <p className="text-[15px] text-fg-2">{entry.description}</p>
        {entry.notes && (
          <p className="border-l border-cat/40 pl-4 text-sm leading-relaxed text-fg-3">
            <span className="mb-1 block font-mono text-[10px] tracking-[0.16em] text-fg-3 uppercase">実装のポイント</span>
            {entry.notes}
          </p>
        )}
        {alias && (
          <p className="text-xs text-fg-3">
            デモは
            <Link href={`/p/${alias.slug}`} className="mx-1 text-fg-2 underline decoration-line-2 underline-offset-4 hover:text-fg-1">
              {alias.name}
            </Link>
            と共通です。
          </p>
        )}
        <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-3 pt-2">
          <TagList tags={entry.tags} />
          <Link href={`/p/${entry.slug}`} className="group ml-auto inline-flex items-center gap-1.5 text-sm text-fg-2 hover:text-fg-1">
            詳細
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
      {entry.demo && (
        <ViewTransition name={`stage-${entry.slug}`}>
          <div className="min-w-0">
            <Stage demo={entry.demo} label={entry.name} href={`/p/${entry.slug}`} source={sourceUrl(entry)} />
          </div>
        </ViewTransition>
      )}
    </article>
  );
}
