import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { Stage } from "@/components/stage/stage";
import { Breadcrumb } from "@/components/catalog/breadcrumb";
import { TagList } from "@/components/catalog/tag-list";
import { TrackRecent } from "@/components/pattern/track-recent";
import { Xray } from "@/components/shell/xray";
import { SITE, aliasesOf, entries, getEntry, goalsFor, neighbours, sourceUrl } from "@/lib/catalog";
import { headingFonts } from "@/lib/fonts";
import { TintHue } from "@/components/shell/tint-hue";
import { PageLoader } from "@/components/shell/page-loader";

export const dynamicParams = false;

export function generateStaticParams() {
  return entries.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: PageProps<"/p/[slug]">): Promise<Metadata> {
  const e = getEntry((await params).slug);
  if (!e) return {};
  return {
    title: e.name,
    description: `${e.description}。${e.notes ?? ""}`.slice(0, 160),
    alternates: { canonical: `/p/${e.slug}` },
    openGraph: { type: "article", url: `/p/${e.slug}` },
  };
}

export default async function PatternPage({ params }: PageProps<"/p/[slug]">) {
  const entry = getEntry((await params).slug);
  if (!entry) notFound();
  const fonts = headingFonts(`c-${entry.category.slug}`);
  const siblings = entries.filter((e) => e.category.slug === entry.category.slug);
  const { prev, next } = neighbours(siblings, entry);
  const goals = goalsFor(entry.slug);
  const alias = entry.aliasOf ? getEntry(entry.aliasOf) : undefined;
  const sharers = aliasesOf(entry.slug);
  const source = sourceUrl(entry);
  const tech = [...(entry.meta?.libs ?? []), ...(entry.meta?.apis ?? [])];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: entry.name,
    description: entry.description,
    url: `${SITE.url}/p/${entry.slug}`,
    inLanguage: "ja",
    isPartOf: { "@type": "WebSite", name: SITE.name, url: SITE.url },
    author: { "@type": "Person", name: SITE.author, url: SITE.portal },
    ...(source ? { codeRepository: SITE.repo } : {}),
  };

  return (
    <div data-hue={entry.category.hue} style={{ "--cat-hue": entry.category.hue, ...fonts } as React.CSSProperties}>
      <PageLoader />
      <TintHue hue={entry.category.hue} />
      <TrackRecent slug={entry.slug} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="mx-auto max-w-[1180px] px-4 pt-10 sm:px-8 sm:pt-16">
        <Breadcrumb items={[{ href: "/categories", label: "カテゴリ" }, { href: `/c/${entry.category.slug}`, label: entry.category.name }, { label: entry.name }]} />

        <header className="mt-10 mb-10 sm:mb-14">
          <p className="idx fade-up mb-4 text-sm text-cat" style={{ animationDelay: "70ms" }}>
            {entry.code}
            <span className="ml-3 text-fg-3">{entry.category.en}</span>
          </p>
          <h1 className="fade-up text-[length:var(--fs-h1)] leading-[1.08] tracking-[-0.01em] text-fg-1" style={{ animationDelay: "140ms" }}>
            {entry.name}
          </h1>
          <p className="fade-up mt-5 max-w-2xl text-lg text-fg-2" style={{ animationDelay: "210ms" }}>
            {entry.description}
          </p>
          {entry.when && (
            <p className="fade-up mt-4 max-w-2xl text-[15px] leading-relaxed text-fg-3" style={{ animationDelay: "280ms" }}>
              {entry.when}
            </p>
          )}
        </header>

        {!entry.demo && (

          <p className="flex min-h-[7rem] items-center justify-center rounded-[var(--radius-md)] border border-dashed border-line-2 px-6 text-center text-sm text-fg-3">

            このパターンは説明のみ（デモなし）

          </p>

        )}

        {entry.demo && (
          <div className="fade-up" style={{ animationDelay: "350ms" }}>
            <Xray slug="theme-toggle" place="bl" className="max-w-[880px]">
              <Stage demo={entry.demo} label={entry.name} source={source} size="hero" preload />
            </Xray>
          </div>
        )}

        <div className="mt-14 grid gap-12 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:gap-16">
          <section aria-labelledby="notes-h">
            <h2 id="notes-h" className="mb-4 font-mono text-[11px] font-normal tracking-[0.18em] text-fg-3 uppercase">実装のポイント</h2>
            <p className="text-2xl leading-[1.6] text-fg-1 sm:text-[26px]">{entry.notes ?? entry.description}</p>
            {alias && (
              <p className="mt-6 text-sm text-fg-3">
                このデモは
                <Link href={`/p/${alias.slug}`} className="mx-1 text-fg-1 underline decoration-line-2 underline-offset-4 hover:decoration-cat">
                  {alias.name}
                </Link>
                と共通です。
              </p>
            )}
            {sharers.length > 0 && (
              <p className="mt-6 text-sm text-fg-3">
                同じデモを使うパターン:
                {sharers.map((s) => (
                  <Link key={s.slug} href={`/p/${s.slug}`} className="ml-2 text-fg-1 underline decoration-line-2 underline-offset-4 hover:decoration-cat">
                    {s.name}
                  </Link>
                ))}
              </p>
            )}
          </section>

          <dl className="grid content-start gap-6 text-sm">
            {entry.tags.length > 0 && (
              <Meta label="特徴">
                <TagList tags={entry.tags} />
              </Meta>
            )}
            {tech.length > 0 && (
              <Meta label="デモで使っているもの">
                <ul className="flex flex-wrap gap-x-3 gap-y-1 font-mono text-xs text-fg-2">
                  {tech.map((t) => <li key={t}>{t}</li>)}
                </ul>
              </Meta>
            )}
            {entry.example?.verified && <Meta label="代表例"><span className="text-fg-2">{entry.example.text}</span></Meta>}
            {source && (
              <Meta label="ソース">
                <a href={source} className="inline-flex items-center gap-1 font-mono text-xs text-fg-2 hover:text-fg-1">
                  {entry.meta?.file.replace("src/components/demos/", "")} <ArrowUpRight className="size-3" />
                </a>
              </Meta>
            )}
          </dl>
        </div>

        {goals.length > 0 && (
          <section aria-labelledby="goals-h" className="mt-20">
            <h2 id="goals-h" className="mb-5 font-mono text-[11px] font-normal tracking-[0.18em] text-fg-3 uppercase">このパターンが効く目的</h2>
            <ul className="border-t border-line-1">
              {goals.map(({ theme, goal, index }) => (
                <li key={`${theme.slug}-${index}`} className="border-b border-line-1">
                  <Link href={`/g/${theme.slug}#g${index}`} className="group flex items-baseline justify-between gap-4 py-5 transition-colors hover:text-fg-1">
                    <span className="text-xl text-fg-1">{goal.title}</span>
                    <span className="flex shrink-0 items-center gap-2 text-xs text-fg-3">
                      {theme.name} <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <nav aria-label="前後のパターン" className="mt-20 grid gap-px border-y border-line-1 bg-line-1 sm:grid-cols-2">
          {prev ? (
            <Link href={`/p/${prev.slug}`} className="flex flex-col gap-2 bg-bg-0 py-8 pr-4 transition-colors hover:bg-bg-1 sm:pr-6">
              <span className="flex items-center gap-2 text-xs text-fg-3"><ArrowLeft className="size-3.5" /> {prev.code}</span>
              <span className="text-xl text-fg-1">{prev.name}</span>
            </Link>
          ) : (
            <Link href={`/c/${entry.category.slug}`} className="flex flex-col gap-2 bg-bg-0 py-8 pr-4 transition-colors hover:bg-bg-1 sm:pr-6">
              <span className="flex items-center gap-2 text-xs text-fg-3"><ArrowLeft className="size-3.5" /> {entry.category.code}</span>
              <span className="text-xl text-fg-1">{entry.category.name} の先頭です</span>
            </Link>
          )}
          {next ? (
            <Link href={`/p/${next.slug}`} className="flex flex-col items-end gap-2 bg-bg-0 py-8 pl-4 text-right transition-colors hover:bg-bg-1 sm:pl-6">
              <span className="flex items-center gap-2 text-xs text-fg-3">{next.code} <ArrowRight className="size-3.5" /></span>
              <span className="text-xl text-fg-1">{next.name}</span>
            </Link>
          ) : (
            <Link href={`/c/${entry.category.slug}`} className="flex flex-col items-end gap-2 bg-bg-0 py-8 pl-4 text-right transition-colors hover:bg-bg-1 sm:pl-6">
              <span className="flex items-center gap-2 text-xs text-fg-3">{entry.category.code} <ArrowRight className="size-3.5" /></span>
              <span className="text-xl text-fg-1">{entry.category.name} の末尾です</span>
            </Link>
          )}
        </nav>
      </div>
    </div>
  );
}

function Meta({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-2 border-t border-line-1 pt-4">
      <dt className="font-mono text-[10px] tracking-[0.16em] text-fg-3 uppercase">{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}
