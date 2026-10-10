import type { Metadata } from "next";
import Link from "next/link";
import { NotFoundSearch } from "@/components/pattern/not-found-search";
import { Xray } from "@/components/shell/xray";
import { headingFonts } from "@/lib/fonts";

export const metadata: Metadata = { title: "ページが見つかりません", robots: { index: false } };

export default function NotFound() {
  const fonts = headingFonts("hub");
  return (
    <div style={fonts}>
    <Xray slug="empty-state" as="section" place="tr" className="mx-auto flex min-h-[70dvh] max-w-[1180px] flex-col items-center justify-center px-4 py-24 text-center sm:px-8">
      <p className="font-mono text-[clamp(5rem,22vw,14rem)] leading-none tracking-[-0.06em] text-fg-1/10" aria-hidden>
        404
      </p>
      <h1 className="-mt-6 text-3xl text-fg-1 sm:-mt-12 sm:text-5xl">このページは、まだ索引にありません。</h1>
      <p className="mt-5 mb-10 max-w-md text-sm leading-relaxed text-fg-3">URL が変わったか、存在しないパターンです。下で探すか、ホームから辿ってください。</p>
      <Xray slug="typeahead-search" place="tr" className="flex w-full justify-center">
        <NotFoundSearch />
      </Xray>
      <Link href="/" className="mt-10 text-sm text-fg-2 underline decoration-line-2 underline-offset-4 hover:text-fg-1">
        ホームへ戻る
      </Link>
    </Xray>
    </div>
  );
}
