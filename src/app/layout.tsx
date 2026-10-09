import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/shell/site-header";
import { SiteFooter } from "@/components/shell/site-footer";
import { CursorLight } from "@/components/shell/cursor-light";
import { XrayProvider, type XrayInfo } from "@/components/shell/xray";
import { Toaster } from "@/components/ui/sonner";
import { SITE, XRAY_SLUGS, getEntry } from "@/lib/catalog";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: `${SITE.name} — モダン Web の機能パターン 341`, template: `%s · ${SITE.name}` },
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

// Loads the Japanese font slices without blocking first paint (v2-launch §3.3).
const FONT_LOADER = `(function(l){if(!l)return;function f(){l.media='all'}l.sheet?f():l.addEventListener('load',f)})(document.getElementById('fc-fonts'))`;

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
  author: { "@type": "Person", name: SITE.author, url: SITE.portal },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <head>
        {/* Self-hosted font slices are loaded async via media swap; next/font cannot ingest unicode-range slices (v2-launch §3.3). */}
        {/* eslint-disable-next-line @next/next/no-css-tags */}
        <link id="fc-fonts" rel="stylesheet" href="/fonts/fonts.css" media="print" suppressHydrationWarning />
        <script dangerouslySetInnerHTML={{ __html: FONT_LOADER }} />
        <noscript>
          {/* eslint-disable-next-line @next/next/no-css-tags */}
          <link rel="stylesheet" href="/fonts/fonts.css" />
        </noscript>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
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
          <main id="main" tabIndex={-1} className="relative z-[1] outline-none">
            {children}
          </main>
          <SiteFooter />
          <Toaster position="bottom-center" />
        </XrayProvider>
      </body>
    </html>
  );
}
