import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { categories } from "@/data/categories";
import { PatternCard } from "@/components/pattern-card";

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = categories.find((c) => c.slug === slug);
  return c ? { title: `${c.name} — Feature Catalog` } : { title: "Not found" };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = categories.find((c) => c.slug === slug);
  if (!category) notFound();

  const demoCount = category.patterns.filter((p) => p.demo).length;

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8">
      <div className="mb-6">
        <Link href="/categories" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "-ml-3")}>
          <ChevronLeft className="size-4" />
          カテゴリ一覧へ
        </Link>
      </div>
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="outline" className="font-mono text-xs">§{category.id}</Badge>
          {demoCount > 0 && <Badge variant="secondary">動くデモ {demoCount}</Badge>}
          <Badge variant="outline">{category.patterns.length} パターン</Badge>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight">{category.name}</h1>
      </div>
      <div className="space-y-4">
        {category.patterns.map((p, i) => (
          <PatternCard key={p.name} pattern={p} index={i} />
        ))}
      </div>
    </div>
  );
}
