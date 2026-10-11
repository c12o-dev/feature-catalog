import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/shell/site-header";
import { SiteFooter } from "@/components/shell/site-footer";
import { CursorLight } from "@/components/shell/cursor-light";
import { TransitionCurtain } from "@/components/shell/transition-curtain";
import { XrayProvider, type XrayInfo } from "@/components/shell/xray";
import { Toaster } from "@/components/ui/sonner";
import { SITE, XRAY_SLUGS, getEntry } from "@/lib/catalog";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: `${SITE.name} — モダン Web の UI パターン 341`, template: `%s · ${SITE.name}` },
  description: SITE.description,
  applicationName: SITE.name,
  authors: [{ name: SITE.author, url: SITE.portal }],
  creator: SITE.author,
  alternates: { canonical: "/" },
  openGraph: { type: "website", siteName: SITE.name, locale: "ja_JP", url: "/" },
  twitter: { card: "summary_large_image" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#0b0b0c",
  colorScheme: "dark",
};

const xrayInfo: XrayInfo = Object.fromEntries(
  XRAY_SLUGS.flatMap((s) => {
    const e = getEntry(s);
    return e ? [[s, { code: e.code, name: e.name, hue: e.category.hue }]] : [];
  }),
);

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE.name,
  url: SITE.url,
  inLanguage: "ja",
  description: SITE.description,
  keywords: ["UI パターン", "機能パターン", "UI デザインパターン", "Web の機能", "デモ"],
  author: { "@type": "Person", name: SITE.author, url: SITE.portal },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <head>
        {/* In production the @font-face rules and per-page preloads are inlined into the static HTML
            after the build (scripts/inject-font-preloads.mjs). Dev just links the stylesheet. */}
        {process.env.NODE_ENV !== "production" && (
          // eslint-disable-next-line @next/next/no-css-tags
          <link rel="stylesheet" href="/fonts/fonts.css" />
        )}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      </head>
      <body className="grain min-h-dvh overflow-x-clip">
        <XrayProvider info={xrayInfo}>
          <a
            href="#main"
            className="fixed left-4 top-3 z-[80] -translate-y-20 rounded-full bg-brand px-4 py-2 text-sm font-medium text-black transition-transform focus:translate-y-0"
          >
            本文へ移動
          </a>
          <CursorLight />
          <SiteHeader />
          {/* no z-index here: a stacking context on main would trap the loading screen beneath the header */}
          <main id="main" tabIndex={-1} className="relative outline-none">
            {children}
          </main>
          <SiteFooter />
          <TransitionCurtain />
          <Toaster position="bottom-center" />
        </XrayProvider>
      </body>
    </html>
  );
}
