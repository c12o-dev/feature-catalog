"use client";

import { useId, useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type PlanId = "free" | "pro" | "team";
const plans: { id: PlanId; name: string; price: number; desc: string }[] = [
  { id: "free", name: "Free", price: 0, desc: "個人利用・3 プロジェクトまで" },
  { id: "pro", name: "Pro", price: 1200, desc: "無制限プロジェクト・優先サポート" },
  { id: "team", name: "Team", price: 3800, desc: "5 名まで・権限管理・監査ログ" },
];
const yen = (n: number) => (n === 0 ? "無料" : `¥${n.toLocaleString("ja-JP")} / 月`);

type View = "summary" | "change" | "cancel";

export default function SubscriptionManage() {
  const [current, setCurrent] = useState<PlanId>("pro");
  const [pick, setPick] = useState<PlanId>("pro");
  const [canceled, setCanceled] = useState(false);
  const [view, setView] = useState<View>("summary");
  const [msg, setMsg] = useState("");
  const uid = useId();
  const plan = plans.find((p) => p.id === current)!;

  return (
    <div className="mx-auto max-w-md rounded-lg border bg-card p-4">
      {view === "summary" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div>
              <div className="text-xs text-muted-foreground">現在のプラン</div>
              <div className="text-lg font-semibold">{plan.name}</div>
            </div>
            {canceled ? <Badge variant="outline">解約予定</Badge> : <Badge>利用中</Badge>}
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div><div className="text-xs text-muted-foreground">料金</div><div className="tabular-nums">{yen(plan.price)}</div></div>
            <div>
              <div className="text-xs text-muted-foreground">{canceled ? "利用終了日" : "次回請求"}</div>
              <div className="tabular-nums">2026-10-15</div>
            </div>
          </div>
          {msg && <p className="rounded-md bg-muted px-3 py-2 text-xs">{msg}</p>}
          <div className="flex flex-wrap gap-2 border-t pt-3">
            {canceled ? (
              <Button size="sm" onClick={() => { setCanceled(false); setMsg("解約を取り消しました。引き続きご利用いただけます。"); }}>解約を取り消す</Button>
            ) : (
              <>
                <Button size="sm" variant="outline" onClick={() => { setPick(current); setView("change"); }}>プラン変更</Button>
                <Button size="sm" variant="ghost" className="text-destructive" onClick={() => setView("cancel")}>解約</Button>
              </>
            )}
          </div>
        </div>
      )}

      {view === "change" && (
        <div className="space-y-3">
          <div className="text-sm font-medium" id={`${uid}-plan-label`}>プランを選択</div>
          <div role="radiogroup" aria-labelledby={`${uid}-plan-label`} className="space-y-2">
            {plans.map((p) => (
              <label
                key={p.id}
                className={cn(
                  "flex w-full cursor-pointer items-start gap-3 rounded-md border p-3 text-left transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring/50",
                  pick === p.id ? "border-primary bg-primary/5" : "hover:bg-muted",
                )}
              >
                <input type="radio" name={`${uid}-plan`} value={p.id} checked={pick === p.id} onChange={() => setPick(p.id)} className="sr-only" />
                <span aria-hidden className={cn("mt-0.5 grid size-4 shrink-0 place-items-center rounded-full border", pick === p.id && "border-primary bg-primary text-primary-foreground")}>
                  {pick === p.id && <Check className="size-3" />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center justify-between gap-x-2 text-sm font-medium">
                    <span>{p.name}{p.id === current && <span className="ml-1.5 text-xs font-normal text-muted-foreground">現在</span>}</span>
                    <span className="tabular-nums">{yen(p.price)}</span>
                  </span>
                  <span className="block text-xs text-muted-foreground">{p.desc}</span>
                </span>
              </label>
            ))}
          </div>
          <div className="flex justify-end gap-2">
            <Button size="sm" variant="ghost" onClick={() => setView("summary")}>キャンセル</Button>
            <Button
              size="sm"
              disabled={pick === current}
              onClick={() => {
                const up = plans.findIndex((p) => p.id === pick) > plans.findIndex((p) => p.id === current);
                setCurrent(pick);
                setMsg(up ? "アップグレードしました。差額は日割りで請求されます。" : "次回請求日からプランが変更されます。");
                setView("summary");
              }}
            >
              {pick === current ? "変更なし" : "変更を確定"}
            </Button>
          </div>
        </div>
      )}

      {view === "cancel" && (
        <div className="space-y-3" role="alertdialog" aria-labelledby={`${uid}-cancel-title`} aria-describedby={`${uid}-cancel-desc`}>
          <div id={`${uid}-cancel-title`} className="text-sm font-medium">{plan.name} プランを解約しますか？</div>
          <p id={`${uid}-cancel-desc`} className="text-xs text-muted-foreground">
            2026-10-15 までは引き続き利用できます。その後は Free プランに切り替わり、超過分のプロジェクトは閲覧のみになります。
          </p>
          <div className="flex flex-wrap justify-end gap-2">
            <Button size="sm" variant="outline" onClick={() => setView("summary")}>続ける</Button>
            <Button size="sm" variant="destructive" onClick={() => { setCanceled(true); setMsg("解約を受け付けました。期間終了まで利用できます。"); setView("summary"); }}>解約する</Button>
          </div>
        </div>
      )}
      <p aria-live="polite" className="sr-only">{msg}</p>
    </div>
  );
}
