import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { themes } from "@/data/goals";

export const metadata = { title: "目的別 — Feature Catalog" };

export default function GoalsPage() {
  const total = themes.reduce((s, t) => s + t.goals.length, 0);
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
      <div className="mb-8 max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight">目的で探す</h1>
        <p className="text-muted-foreground mt-2">
          「フォーム離脱を減らしたい」のような問題ステートメントから関連パターンを逆引き。
          {themes.length} テーマ・{total} 目的。
        </p>
      </div>
      <div className="space-y-8">
        {themes.map((t) => (
          <section key={t.id}>
            <div className="flex items-baseline gap-3 mb-3">
              <h2 className="text-xl font-semibold tracking-tight">{t.name}</h2>
              <Badge variant="outline" className="font-mono text-xs">§{t.id}</Badge>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {t.goals.map((g, i) => (
                <Link key={i} href={`/g/${t.slug}#g${i}`} className="group">
                  <Card className="h-full transition-colors hover:border-foreground/30">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between text-base">
                        <span>{g.title}</span>
                        <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm text-muted-foreground line-clamp-2">
                        {g.patterns.slice(0, 4).join(" / ")}
                        {g.patterns.length > 4 ? ` 他 ${g.patterns.length - 4}` : ""}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
