import Link from "next/link";
import { ArrowRight, LayoutGrid, Compass, Sparkles } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { categories } from "@/data/categories";
import { themes } from "@/data/goals";
import { demoRegistry } from "@/components/demos/registry";

export default function Home() {
  const totalPatterns = categories.reduce((sum, c) => sum + c.patterns.length, 0);
  const demoCount = Object.keys(demoRegistry).length;
  const totalGoals = themes.reduce((sum, t) => sum + t.goals.length, 0);

  // Featured demos: pick patterns that have demos, dedupe by demo name
  const featured = categories
    .flatMap((c) => c.patterns.map((p) => ({ ...p, category: c })))
    .filter((p) => p.demo)
    .slice(0, 8);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-16">
      {/* Hero */}
      <section className="mb-16 sm:mb-20">
        <div className="flex flex-col items-start gap-5 max-w-3xl">
          <Badge variant="outline" className="font-mono">
            v1 — 2026-04-26
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight">
            モダン Web の機能パターン<br />
            <span className="text-muted-foreground">動くデモで網羅</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            草チャート・スキルマップ・コマンドパレット等、ユーザーから見える機能を{" "}
            <strong className="text-foreground">{categories.length} カテゴリ・{totalPatterns} パターン</strong>{" "}
            で索引化。{demoCount} パターンは React で実装した動くデモを掲載。
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/categories" className={cn(buttonVariants({ size: "lg" }))}>
              <LayoutGrid className="size-4" />
              カテゴリで探す
            </Link>
            <Link href="/goals" className={cn(buttonVariants({ size: "lg", variant: "outline" }))}>
              <Compass className="size-4" />
              目的別で探す
            </Link>
          </div>
        </div>
      </section>

      {/* Featured demos */}
      <section className="mb-16">
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
            <Sparkles className="size-5" />
            動くデモ
          </h2>
          <Link
            href="/categories"
            className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
          >
            すべて <ArrowRight className="size-3" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {featured.map((p) => (
            <Link
              key={`${p.category.id}-${p.name}`}
              href={`/c/${p.category.slug}#${encodeURIComponent(p.name)}`}
              className="group"
            >
              <Card className="h-full transition-colors hover:border-foreground/30">
                <CardHeader>
                  <div className="text-xs text-muted-foreground mb-1">§{p.category.id} {p.category.name}</div>
                  <CardTitle className="text-base">{p.name}</CardTitle>
                  <CardDescription className="line-clamp-2">{p.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="mb-16">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard label="カテゴリ" value={categories.length} />
          <StatCard label="パターン" value={totalPatterns} />
          <StatCard label="動くデモ" value={demoCount} accent />
          <StatCard label="目的（逆引き）" value={totalGoals} />
        </div>
      </section>

      {/* About */}
      <section className="rounded-lg border bg-muted/30 p-6 sm:p-8">
        <h2 className="text-xl font-semibold mb-3">このサイトは何か</h2>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>
            個人プロジェクトで「あの機能あったな」を思い出すための語彙索引です。実装可能な web components ライブラリ
            ではなく、「何を作るかの選択肢」を見渡すためのカタログ。
          </p>
          <p>
            <strong>カテゴリで探す</strong>：UI form factor 別の 25 セクション。<br />
            <strong>目的で探す</strong>：「フォーム離脱を減らしたい」等の問題ステートメントから逆引き。
          </p>
          <p className="pt-1 text-xs">
            ⚠ 各パターンの「代表例」サイト名は記憶ベース（[unverified 2026-04-26]）。引用前に裏取り推奨。
          </p>
        </div>
      </section>
    </div>
  );
}

function StatCard({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div
      className={`rounded-lg border p-4 ${
        accent ? "bg-foreground text-background" : "bg-card"
      }`}
    >
      <div className="text-3xl font-semibold tabular-nums">{value}</div>
      <div className={`text-xs mt-1 ${accent ? "text-background/70" : "text-muted-foreground"}`}>{label}</div>
    </div>
  );
}
