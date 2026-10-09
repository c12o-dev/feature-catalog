import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { themes } from "@/data/goals";
import { categories } from "@/data/categories";

export function generateStaticParams() {
  return themes.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const t = themes.find((t) => t.slug === slug);
  return t ? { title: `${t.name} — 目的別 — Feature Catalog` } : { title: "Not found" };
}

export default async function ThemePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const theme = themes.find((t) => t.slug === slug);
  if (!theme) notFound();

  // Build a map: pattern name → category for cross-linking
  const patternToCategory = new Map<string, { id: string; slug: string }>();
  for (const c of categories) {
    for (const p of c.patterns) {
      if (!patternToCategory.has(p.name)) patternToCategory.set(p.name, { id: c.id, slug: c.slug });
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8">
      <div className="mb-6">
        <Link href="/goals" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "-ml-3")}>
          <ChevronLeft className="size-4" />
          目的一覧へ
        </Link>
      </div>
      <div className="mb-8">
        <Badge variant="outline" className="font-mono text-xs mb-2">§{theme.id}</Badge>
        <h1 className="text-3xl font-semibold tracking-tight">{theme.name}</h1>
      </div>
      <div className="space-y-6">
        {theme.goals.map((g, i) => (
          <Card key={i} id={`g${i}`} className="scroll-mt-20">
            <CardHeader>
              <CardTitle className="text-lg">{g.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">該当パターン</div>
                <div className="flex flex-wrap gap-2">
                  {g.patterns.map((p) => {
                    const cat = patternToCategory.get(p);
                    return cat ? (
                      <Link
                        key={p}
                        href={`/c/${cat.slug}#${encodeURIComponent(p)}`}
                        className="rounded-md border px-2.5 py-1 text-xs hover:bg-accent transition-colors"
                      >
                        <span className="text-muted-foreground mr-1.5 font-mono">§{cat.id}</span>
                        {p}
                      </Link>
                    ) : (
                      <span key={p} className="rounded-md border bg-muted px-2.5 py-1 text-xs text-muted-foreground">
                        {p}
                      </span>
                    );
                  })}
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground pt-1">
                <span>関連カテゴリ:</span>
                <div className="flex gap-1.5">
                  {g.categoryRefs.map((cid) => {
                    const c = categories.find((c) => c.id === cid);
                    return c ? (
                      <Link
                        key={cid}
                        href={`/c/${c.slug}`}
                        className="rounded-md border bg-background px-2 py-0.5 hover:bg-accent transition-colors"
                      >
                        §{c.id} {c.name}
                      </Link>
                    ) : null;
                  })}
                </div>
                {g.external && (
                  <span className="ml-auto inline-flex items-center gap-1 text-muted-foreground">
                    外部参照: <span className="text-foreground/70">{g.external}</span>
                    <ExternalLink className="size-3" />
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
