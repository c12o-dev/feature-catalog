"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const plans = [
  { name: "Free", monthly: 0, yearly: 0, features: ["1 プロジェクト", "100 MB ストレージ", "コミュニティサポート"] },
  { name: "Pro", monthly: 1200, yearly: 12000, popular: true, features: ["無制限プロジェクト", "10 GB ストレージ", "メールサポート", "高度な分析"] },
  { name: "Team", monthly: 4800, yearly: 48000, features: ["チーム招待", "100 GB ストレージ", "優先サポート", "SSO", "監査ログ"] },
];

export default function PricingTable() {
  const [yearly, setYearly] = useState(false);
  return (
    <div className="space-y-4">
      <div className="flex justify-center">
        <div className="inline-flex rounded-lg bg-muted p-1 text-sm">
          <button
            onClick={() => setYearly(false)}
            className={`px-3 py-1 rounded-md ${!yearly ? "bg-background shadow-sm" : "text-muted-foreground"}`}
          >
            月額
          </button>
          <button
            onClick={() => setYearly(true)}
            className={`px-3 py-1 rounded-md flex items-center gap-1 ${yearly ? "bg-background shadow-sm" : "text-muted-foreground"}`}
          >
            年額 <Badge variant="secondary" className="text-[9px]">2 ヶ月分 OFF</Badge>
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {plans.map((p) => (
          <div
            key={p.name}
            className={`rounded-lg border p-4 ${p.popular ? "border-foreground ring-2 ring-foreground/20" : ""}`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="font-semibold">{p.name}</div>
              {p.popular && <Badge>Popular</Badge>}
            </div>
            <div className="text-2xl font-semibold tabular-nums">
              ¥{(yearly ? p.yearly : p.monthly).toLocaleString()}
              <span className="text-sm font-normal text-muted-foreground">/{yearly ? "年" : "月"}</span>
            </div>
            <ul className="mt-3 space-y-1.5 text-sm">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <Check className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
