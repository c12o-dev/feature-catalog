import Link from "next/link";
import { GlobalCommand } from "@/components/command/global-command";
import { Xray, XrayToggle } from "@/components/shell/xray";
import { categoryList, themes } from "@/lib/catalog";

export function SiteHeader() {
  const cats = categoryList.map((c) => ({ slug: c.slug, name: c.name, code: c.code, en: c.en, hue: c.hue }));
  const goals = themes.flatMap((t) => t.goals.map((g, i) => ({ href: `/g/${t.slug}#g${i}`, title: g.title, theme: t.name })));
  return (
    <Xray slug="sticky-shrink" as="header" place="below" className="site-header sticky top-0 z-50">
      <div className="mx-auto flex h-full max-w-[1440px] items-center gap-3 px-4 sm:gap-6 sm:px-8">
        <Link href="/" className="group flex items-baseline gap-2 text-fg-1" aria-label="Feature Catalog ホーム">
          <span aria-hidden className="font-serif text-2xl leading-none text-brand transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:rotate-[-12deg]">
            §
          </span>
          <span className="hidden font-serif text-[15px] tracking-wide sm:inline">Feature Catalog</span>
        </Link>
        <nav aria-label="メイン" className="flex items-center gap-1 text-sm">
          <NavLink href="/categories">カテゴリ</NavLink>
          <NavLink href="/goals">目的</NavLink>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <GlobalCommand categories={cats} goals={goals} />
          <XrayToggle />
        </div>
      </div>
    </Xray>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="relative rounded-full px-3 py-1.5 text-fg-2 transition-colors after:absolute after:inset-x-3 after:bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-brand after:transition-transform after:duration-300 hover:text-fg-1 hover:after:scale-x-100"
    >
      {children}
    </Link>
  );
}
