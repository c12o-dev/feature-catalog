"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { demoRegistry } from "@/components/demos/registry";
import type { Pattern } from "@/data/categories";

export function PatternCard({ pattern, index }: { pattern: Pattern; index: number }) {
  const Demo = pattern.demo ? demoRegistry[pattern.demo] : undefined;
  const anchor = encodeURIComponent(pattern.name);

  return (
    <Card id={anchor} className="scroll-mt-20 overflow-hidden">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base flex items-center gap-2 flex-wrap">
              <span className="text-xs text-muted-foreground font-mono">#{index + 1}</span>
              {pattern.name}
              {Demo && (
                <Badge variant="default" className="text-[10px]">
                  動くデモ
                </Badge>
              )}
            </CardTitle>
            <CardDescription className="mt-1.5">{pattern.description}</CardDescription>
          </div>
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          代表例: <span className="text-foreground/70">{pattern.example}</span>{" "}
          <span className="opacity-50">[unverified]</span>
        </div>
      </CardHeader>
      {Demo && (
        <CardContent>
          <div className="rounded-md border bg-muted/30 p-4 sm:p-6 not-prose">
            <Demo />
          </div>
        </CardContent>
      )}
    </Card>
  );
}
