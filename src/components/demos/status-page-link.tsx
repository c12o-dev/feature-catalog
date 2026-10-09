"use client";

import { ExternalLink, CheckCircle2 } from "lucide-react";

export default function StatusPageLink() {
  return (
    <a className="inline-flex items-center gap-2 rounded-md border bg-background px-3 py-1.5 text-sm hover:bg-accent cursor-pointer">
      <CheckCircle2 className="size-4 text-emerald-500" />
      All systems operational
      <ExternalLink className="size-3 text-muted-foreground" />
    </a>
  );
}
