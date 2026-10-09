import Link from "next/link";
import { ArrowRight, Command } from "lucide-react";
import { LivingWall } from "@/components/home/living-wall";
import { CountUp } from "@/components/home/count-up";
import { RiseText } from "@/components/home/rise-text";
import { CategoryIndex } from "@/components/catalog/category-index";
import { Xray } from "@/components/shell/xray";
import { OpenCommandButton } from "@/components/command/open-command-button";
import { LIVING_WALL, categoryList, getEntry, stats, themes } from "@/lib/catalog";

const FEATURED_GOALS: [string, number][] = [
  ["input", 0],
  ["experience", 1],
  ["experience", 3],
  ["auth-security", 0],
  ["trust-monetize", 1],
  ["cross-cutting", 0],
];

export default function Home() {
  const tiles = LIVING_WALL.flatMap((s) => {
    const e = getEntry(s);
    return e ? [{ slug: s, code: e.code, name: e.name, hue: e.category.hue }] : [];
  });
  const goals = FEATURED_GOALS.flatMap(([slug, i]) => {
    const t = themes.find((x) => x.slug === slug);
    const g = t?.goals[i];
    return t && g ? [{ href: `/g/${t.slug}#g${i}`, title: g.title, theme: t.name, count: g.patterns.length }] : [];
  });

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative mx-auto grid max-w-[1440px] gap-12 px-4 pt-10 pb-20 sm:px-8 sm:pt-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-16 lg:pt-24 lg:pb-32">
        <div className="flex flex-col gap-12 [container-type:inline-size] lg:pt-6">
          <div>
            <p className="fade-up mb-8 flex items-center gap-3 font-mono text-[11px] tracking-[0.2em] text-fg-3 uppercase">
              <span className="h-px w-8 bg-brand" />
              Feature Catalog · {stats.categories} categories
            </p>
            <h1 className="hero-title leading-[1.04] tracking-[-0.02em] text-fg-1">
              <span className="hero-line"><RiseText text="ユーザーから" /></span>
              <span className="hero-line"><RiseText text="見える機能の、" delay={180} /></span>
              <span className="hero-line">
                <span className="text-brand">
                  <RiseText text={`${stats.patterns}`} delay={420} step={60} className="font-mono tracking-[-0.06em]" />
                </span>
                <RiseText text=" の語彙。" delay={560} />
              </span>
            </h1>
          </div>
          <div className="fade-up max-w-md space-y-6" style={{ animationDelay: "700ms" }}>
            <p className="text-[15px] leading-[1.9] text-fg-2">
              草チャート、コマンドパレット、楽観的 UI、AI のストリーミング表示。名前を知っていれば選べる機能を、動くデモ付きで引ける索引にしました。
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/categories"
                className="group inline-flex h-11 items-center gap-2 rounded-full bg-brand pr-4 pl-5 text-sm font-medium text-black transition-[background-color,box-shadow] hover:bg-[var(--accent-hi)] hover:shadow-[0_0_40px_-8px_var(--accent-glow)]"
              >
                カテゴリで探す
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
              <Link href="/goals" className="inline-flex h-11 items-center rounded-full border border-line-2 px-5 text-sm text-fg-1 transition-colors hover:border-fg-3">
                目的から探す
              </Link>
              <OpenCommandButton className="inline-flex h-11 items-center gap-2 rounded-full px-3 text-sm text-fg-3 transition-colors hover:text-fg-1">
                <Command className="size-3.5" /> K で検索
              </OpenCommandButton>
            </div>
          </div>
        </div>
        <div className="fade-up" style={{ animationDelay: "350ms" }}>
          <LivingWall tiles={tiles} />
        </div>
      </section>

      {/* ── Numbers ── */}
      <section aria-label="収録数" className="reveal mx-auto max-w-[1440px] px-4 sm:px-8">
        <Xray slug="counter-tick" place="tr">
          <dl className="grid grid-cols-2 border-y border-line-1 lg:grid-cols-4">
            {[
              { k: "カテゴリ", v: stats.categories, en: "Categories" },
              { k: "パターン", v: stats.patterns, en: "Patterns" },
              { k: "固有の動くデモ", v: stats.uniqueDemos, en: "Live demos" },
              { k: "目的からの逆引き", v: stats.goals, en: "Goals" },
            ].map((s, i) => (
              <div key={s.k} className={`flex flex-col gap-2 px-1 py-8 sm:px-6 sm:py-10 ${i % 2 ? "border-l border-line-1" : ""} ${i >= 2 ? "border-t border-line-1 lg:border-t-0" : ""} ${i === 2 ? "lg:border-l" : ""}`}>
                <dt className="order-2 text-sm text-fg-3">
                  {s.k}
                  <span className="ml-2 font-serif text-fg-4 italic">{s.en}</span>
                </dt>
                <dd className="order-1 font-mono text-5xl tracking-tight text-fg-1 sm:text-7xl">
                  <CountUp value={s.v} />
                </dd>
              </div>
            ))}
          </dl>
        </Xray>
      </section>

      {/* ── Index ── */}
      <section aria-labelledby="index-h" className="mx-auto max-w-[1440px] px-4 pt-28 sm:px-8 sm:pt-36">
        <SectionHead id="index-h" no="01" en="Index" title="UI のかたちで引く" lead="25 のカテゴリに分けた索引です。行に触れると、そのカテゴリの色がページににじみます。" />
        <div className="reveal">
          <CategoryIndex categories={categoryList} />
        </div>
      </section>

      {/* ── Goals ── */}
      <section aria-labelledby="goals-h" className="mx-auto max-w-[1440px] px-4 pt-28 sm:px-8 sm:pt-36">
        <SectionHead id="goals-h" no="02" en="Goals" title="困りごとから引く" lead="「フォームの離脱を減らしたい」のような問題文から、効くパターンをまとめて引けます。" />
        <ul className="reveal grid border-t border-line-1 md:grid-cols-2">
          {goals.map((g, i) => (
            <li key={g.href} className={`border-b border-line-1 ${i % 2 === 0 ? "md:border-r" : ""}`}>
              <Link href={g.href} className="group flex h-full items-start gap-5 py-8 transition-colors hover:bg-bg-1 md:px-6">
                <span className="idx pt-2 text-xs text-fg-4">{String(i + 1).padStart(2, "0")}</span>
                <span className="flex-1">
                  <span className="block font-serif text-2xl leading-snug text-fg-1 transition-colors group-hover:text-brand sm:text-[28px]">{g.title}</span>
                  <span className="mt-2 block text-xs text-fg-4">
                    {g.theme} · {g.count} パターン
                  </span>
                </span>
                <ArrowRight className="mt-2 size-5 shrink-0 text-fg-4 transition-all duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-1 group-hover:text-brand" />
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-8">
          <Link href="/goals" className="inline-flex items-center gap-2 text-sm text-fg-2 hover:text-fg-1">
            {stats.goals} の目的をすべて見る <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      {/* ── About ── */}
      <section id="about" aria-labelledby="about-h" className="mx-auto max-w-[1440px] scroll-mt-24 px-4 pt-28 sm:px-8 sm:pt-36">
        <SectionHead id="about-h" no="03" en="About" title="このサイトについて" />
        <div className="reveal grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="max-w-[38em] space-y-5 text-[15px] leading-[1.95] text-fg-2">
            <p>
              個人開発で「あの機能、何て呼ぶんだっけ」を引くために作った語彙の索引です。コンポーネントライブラリではありません。何を作るかの選択肢を、名前と動きで見渡すためのカタログです。
            </p>
            <p>
              デモはすべて手元で動くモックです。地図・決済・動画のような外部サービスが要るパターンも、通信しない UI で再現しています。各デモの右上から、ステージの明暗の切り替え、リセット、ソースの表示ができます。
            </p>
          </div>
          <div className="rounded-2xl border border-line-1 bg-bg-1 p-6 sm:p-8">
            <p className="font-mono text-[11px] tracking-[0.18em] text-brand uppercase">X-ray mode</p>
            <p className="mt-3 font-serif text-2xl leading-snug text-fg-1">このサイト自体が、カタログのデモです。</p>
            <p className="mt-3 text-sm leading-relaxed text-fg-3">
              ヘッダーの <span className="font-mono text-fg-2">X-ray</span> を押すか、キーボードで <kbd className="rounded border border-line-2 px-1 font-mono text-xs">x</kbd> を 2 回。画面の各部に、使っているパターンの名前が浮かびます。
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

function SectionHead({ id, no, en, title, lead }: { id: string; no: string; en: string; title: string; lead?: string }) {
  return (
    <div className="mb-10 grid gap-4 sm:mb-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-end">
      <div>
        <p className="mb-3 flex items-center gap-3 font-mono text-[11px] tracking-[0.2em] text-fg-4 uppercase">
          <span className="text-brand">{no}</span> {en}
        </p>
        <h2 id={id} className="text-[length:var(--fs-h1)] leading-[1.08] tracking-[-0.01em] text-fg-1">
          {title}
        </h2>
      </div>
      {lead && <p className="max-w-md text-sm leading-relaxed text-fg-3 lg:justify-self-end">{lead}</p>}
    </div>
  );
}
