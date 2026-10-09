import Link from "next/link";
import { LayoutGrid, Compass, Sparkles } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { GlobalCommand } from "@/components/global-command";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Sparkles className="size-5" />
          <span className="hidden sm:inline">Feature Catalog</span>
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          <Link
            href="/categories"
            className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <LayoutGrid className="size-4" />
            <span className="hidden sm:inline">カテゴリ</span>
          </Link>
          <Link
            href="/goals"
            className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <Compass className="size-4" />
            <span className="hidden sm:inline">目的別</span>
          </Link>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <GlobalCommand />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
