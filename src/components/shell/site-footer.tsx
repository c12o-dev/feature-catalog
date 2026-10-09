import Link from "next/link";
import { SITE, stats } from "@/lib/catalog";
import { Xray, XrayToggle } from "@/components/shell/xray";

export function SiteFooter() {
  return (
    <footer className="relative z-[1] mt-32 border-t border-line-1">
      <div className="mx-auto max-w-[1440px] px-4 pt-16 pb-10 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p aria-hidden className="font-serif text-[clamp(3rem,10vw,8.5rem)] leading-[0.9] tracking-tight text-fg-1/90">
              Feature
              <br />
              <span className="text-fg-3">Catalog</span>
            </p>
            <p className="mt-6 max-w-sm text-sm text-fg-3">
              {stats.patterns} の機能パターンを、{stats.uniqueDemos} の動くデモで。ユーザーから見える機能の語彙索引です。
            </p>
          </div>
          <nav aria-label="サイト" className="text-sm">
            <h2 className="mb-4 font-mono text-[10px] tracking-[0.18em] text-fg-3 uppercase">Index</h2>
            <ul className="space-y-2.5">
              <li><Link className="text-fg-2 hover:text-fg-1" href="/categories">カテゴリ一覧</Link></li>
              <li><Link className="text-fg-2 hover:text-fg-1" href="/goals">目的から探す</Link></li>
              <li><Link className="text-fg-2 hover:text-fg-1" href="/#about">このサイトについて</Link></li>
            </ul>
          </nav>
          <div className="text-sm">
            <h2 className="mb-4 font-mono text-[10px] tracking-[0.18em] text-fg-3 uppercase">Elsewhere</h2>
            <ul className="space-y-2.5">
              <li><a className="text-fg-2 hover:text-fg-1" href={SITE.portal}>c12o.net</a></li>
              <li><a className="text-fg-2 hover:text-fg-1" href={SITE.blog}>Blog</a></li>
              <li><a className="text-fg-2 hover:text-fg-1" href={SITE.repo}>GitHub リポジトリ</a></li>
            </ul>
            <div className="mt-8 flex items-center gap-3">
              <XrayToggle />
              <span className="text-xs text-fg-3">このサイトで使っているパターンを表示</span>
            </div>
          </div>
        </div>
        <Xray slug="version-footer" place="tr" className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-line-1 pt-6 font-mono text-[11px] text-fg-3">
          <span>© 2026 {SITE.author}</span>
          <span>Next.js · React · Tailwind CSS · Cloudflare Pages</span>
        </Xray>
      </div>
    </footer>
  );
}
