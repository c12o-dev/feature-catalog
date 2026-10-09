import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { categories } from "@/data/categories";

export const metadata = { title: "カテゴリ一覧 — Feature Catalog" };

export default function CategoriesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">カテゴリ</h1>
        <p className="text-muted-foreground mt-2">UI form factor で分類した {categories.length} カテゴリ。</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {categories.map((c) => {
          const demoCount = c.patterns.filter((p) => p.demo).length;
          return (
            <Link key={c.id} href={`/c/${c.slug}`} className="group">
              <Card className="h-full transition-colors hover:border-foreground/30">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-muted-foreground font-mono">§{c.id}</span>
                    {demoCount > 0 && (
                      <Badge variant="secondary" className="text-[10px]">
                        デモ {demoCount}
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="flex items-center justify-between text-base">
                    {c.name}
                    <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">
                    {c.patterns.length} パターン
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
