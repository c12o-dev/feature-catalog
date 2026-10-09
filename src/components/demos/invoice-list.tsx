"use client";

import { Download, FileText } from "lucide-react";

const inv = [
  { id: "INV-2026-04", date: "2026-04-01", amount: 1200, status: "paid" },
  { id: "INV-2026-03", date: "2026-03-01", amount: 1200, status: "paid" },
  { id: "INV-2026-02", date: "2026-02-01", amount: 1200, status: "paid" },
];

export default function InvoiceList() {
  return (
    <ul className="rounded-md border bg-background divide-y max-w-md">
      {inv.map((i) => (
        <li key={i.id} className="flex items-center gap-3 px-3 py-2 text-sm">
          <FileText className="size-4 text-muted-foreground" />
          <div className="flex-1 min-w-0">
            <div className="font-mono text-xs">{i.id}</div>
            <div className="text-xs text-muted-foreground">{i.date}</div>
          </div>
          <div className="text-sm tabular-nums">¥{i.amount.toLocaleString()}</div>
          <button className="text-muted-foreground hover:text-foreground"><Download className="size-3.5" /></button>
        </li>
      ))}
    </ul>
  );
}
