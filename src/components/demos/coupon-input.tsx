"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Loader2, Tag, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Coupon = { code: string; label: string; apply: (subtotal: number) => { discount: number; shipping: number } };

// In production the code is validated on the server; this mock stands in for that request.
const MOCK_SERVER: Record<string, Coupon> = {
  WELCOME20: { code: "WELCOME20", label: "初回 20% オフ", apply: (s) => ({ discount: Math.round(s * 0.2), shipping: 500 }) },
  FREESHIP: { code: "FREESHIP", label: "送料無料", apply: () => ({ discount: 0, shipping: 0 }) },
};

const SUBTOTAL = 12800;
const yen = (n: number) => `¥${n.toLocaleString("ja-JP")}`;

export default function CouponInput() {
  const [code, setCode] = useState("");
  const [applied, setApplied] = useState<Coupon | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const id = useId();

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const apply = () => {
    const c = code.trim();
    if (!c || checking) return;
    setChecking(true);
    setError(null);
    timer.current = setTimeout(() => {
      const hit = MOCK_SERVER[c];
      setChecking(false);
      if (hit) {
        setApplied(hit);
        setCode("");
      } else {
        setError(`「${c}」は無効か、有効期限が切れています`);
      }
    }, 700);
  };

  const { discount, shipping } = applied ? applied.apply(SUBTOTAL) : { discount: 0, shipping: 500 };
  const total = SUBTOTAL - discount + shipping;

  return (
    <div className="mx-auto w-full max-w-sm space-y-3 rounded-lg border bg-card p-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          apply();
        }}
        className="space-y-1.5"
      >
        <label htmlFor={id} className="flex items-center gap-1.5 text-sm font-medium">
          <Tag className="size-3.5" aria-hidden />
          クーポンコード
        </label>
        <div className="flex gap-2">
          <Input
            id={id}
            value={code}
            onChange={(e) => {
              setCode(e.target.value.toUpperCase());
              setError(null);
            }}
            placeholder="例: WELCOME20"
            autoComplete="off"
            aria-invalid={!!error || undefined}
            aria-describedby={`${id}-msg`}
            className="font-mono uppercase"
          />
          <Button type="submit" variant="outline" disabled={!code.trim() || checking} className="w-16">
            {checking ? <Loader2 className="size-4 animate-spin" aria-label="確認中" /> : "適用"}
          </Button>
        </div>
        <p id={`${id}-msg`} aria-live="polite" className="min-h-4 text-xs">
          {error && <span className="text-destructive">{error}</span>}
          {!error && applied && <span className="text-emerald-600 dark:text-emerald-400">{applied.label}を適用しました</span>}
          {!error && !applied && <span className="text-muted-foreground">WELCOME20 / FREESHIP が使えます</span>}
        </p>
      </form>

      {applied && (
        <div className="flex items-center justify-between rounded-md border border-dashed px-2.5 py-1.5">
          <span className="font-mono text-xs">{applied.code}</span>
          <button
            type="button"
            onClick={() => setApplied(null)}
            aria-label={`${applied.code} を外す`}
            className="rounded p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="size-3.5" />
          </button>
        </div>
      )}

      <dl className="space-y-1 border-t pt-3 text-sm tabular-nums">
        <div className="flex justify-between">
          <dt className="text-muted-foreground">小計</dt>
          <dd>{yen(SUBTOTAL)}</dd>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
            <dt>割引</dt>
            <dd>−{yen(discount)}</dd>
          </div>
        )}
        <div className="flex justify-between">
          <dt className="text-muted-foreground">送料</dt>
          <dd>{shipping ? yen(shipping) : "無料"}</dd>
        </div>
        <div className="flex justify-between border-t pt-2 font-medium">
          <dt>合計</dt>
          <dd>{yen(total)}</dd>
        </div>
      </dl>
    </div>
  );
}
