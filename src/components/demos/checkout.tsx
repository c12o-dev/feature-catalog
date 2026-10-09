"use client";

import { useEffect, useId, useState } from "react";
import { CheckCircle2, CreditCard, Loader2, Lock, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const digits = (s: string) => s.replace(/\D/g, "");
const formatCard = (s: string) => digits(s).slice(0, 16).replace(/(\d{4})(?=\d)/g, "$1 ");
const formatExp = (s: string) => {
  const d = digits(s).slice(0, 4);
  return d.length > 2 ? `${d.slice(0, 2)} / ${d.slice(2)}` : d;
};
const luhn = (num: string) => {
  let sum = 0;
  let dbl = false;
  for (let i = num.length - 1; i >= 0; i--) {
    let n = Number(num[i]);
    if (dbl) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    dbl = !dbl;
  }
  return num.length >= 15 && sum % 10 === 0;
};
const brandOf = (num: string) => (num.startsWith("4") ? "VISA" : /^5[1-5]/.test(num) ? "MC" : /^3[47]/.test(num) ? "AMEX" : null);

type Errors = Partial<Record<"card" | "exp" | "cvc" | "name", string>>;

export default function Checkout() {
  const id = useId();
  const [card, setCard] = useState("");
  const [exp, setExp] = useState("");
  const [cvc, setCvc] = useState("");
  const [name, setName] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "processing" | "done">("idle");
  const [method, setMethod] = useState<string>("カード");

  useEffect(() => {
    if (status !== "processing") return;
    const t = setTimeout(() => setStatus("done"), 1400);
    return () => clearTimeout(t);
  }, [status]);

  const brand = brandOf(digits(card));

  const pay = (e: React.FormEvent) => {
    e.preventDefault();
    const next: Errors = {};
    if (!luhn(digits(card))) next.card = "カード番号を確認してください";
    const [mm, yy] = [Number(digits(exp).slice(0, 2)), Number(digits(exp).slice(2))];
    if (!(mm >= 1 && mm <= 12) || digits(exp).length !== 4 || 2000 + yy < 2026 || (2000 + yy === 2026 && mm < 10))
      next.exp = "有効期限が正しくありません";
    if (digits(cvc).length < 3) next.cvc = "3〜4 桁で入力";
    if (!name.trim()) next.name = "名義を入力してください";
    setErrors(next);
    if (Object.keys(next).length === 0) {
      setMethod("カード");
      setStatus("processing");
    }
  };

  const wallet = (label: string) => {
    setMethod(label);
    setErrors({});
    setStatus("processing");
  };

  if (status === "done") {
    return (
      <div className="mx-auto flex w-full max-w-sm flex-col items-center rounded-lg border bg-card p-6 text-center" role="status">
        <CheckCircle2 className="size-10 text-emerald-600 dark:text-emerald-400" />
        <div className="mt-3 font-semibold">お支払いが完了しました</div>
        <p className="mt-1 text-sm text-muted-foreground">{method}で ¥22,580 を決済しました</p>
        <p className="mt-0.5 text-xs text-muted-foreground tabular-nums">注文番号 #A-20261001-0042</p>
        <Button
          variant="outline"
          size="sm"
          className="mt-4"
          onClick={() => {
            setStatus("idle");
            setCard("");
            setExp("");
            setCvc("");
            setName("");
          }}
        >
          もう一度試す
        </Button>
      </div>
    );
  }

  const busy = status === "processing";
  const err = (k: keyof Errors) =>
    errors[k] ? (
      <p id={`${id}-${k}-err`} className="text-xs text-destructive">{errors[k]}</p>
    ) : null;

  return (
    <form onSubmit={pay} noValidate className="mx-auto w-full max-w-sm space-y-4 rounded-lg border bg-card p-4">
      <div className="flex items-baseline justify-between">
        <span className="text-sm text-muted-foreground">年間プラン（2 席）</span>
        <span className="font-semibold tabular-nums">¥22,580</span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Button type="button" disabled={busy} onClick={() => wallet("Apple Pay ")} className="bg-black text-white hover:bg-black/85 dark:bg-white dark:text-black dark:hover:bg-white/85">
          <Smartphone /> Apple Pay
        </Button>
        <Button type="button" disabled={busy} variant="outline" onClick={() => wallet("Google Pay ")}>
          <Smartphone /> Google Pay
        </Button>
      </div>

      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <div className="h-px flex-1 bg-border" />またはカードで支払う<div className="h-px flex-1 bg-border" />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor={`${id}-card`}>カード番号</Label>
        <div className="relative">
          <Input
            id={`${id}-card`}
            name="cardnumber"
            autoComplete="cc-number"
            inputMode="numeric"
            placeholder="4242 4242 4242 4242"
            value={card}
            onChange={(e) => setCard(formatCard(e.target.value))}
            aria-invalid={!!errors.card}
            aria-describedby={errors.card ? `${id}-card-err` : undefined}
            className="pr-14 tabular-nums"
          />
          <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center gap-1 text-[10px] font-semibold text-muted-foreground">
            {brand ?? <CreditCard className="size-4" />}
          </span>
        </div>
        {err("card")}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1.5">
          <Label htmlFor={`${id}-exp`}>有効期限</Label>
          <Input
            id={`${id}-exp`}
            name="cc-exp"
            autoComplete="cc-exp"
            inputMode="numeric"
            placeholder="MM / YY"
            value={exp}
            onChange={(e) => setExp(formatExp(e.target.value))}
            aria-invalid={!!errors.exp}
            aria-describedby={errors.exp ? `${id}-exp-err` : undefined}
            className="tabular-nums"
          />
          {err("exp")}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`${id}-cvc`}>CVC</Label>
          <Input
            id={`${id}-cvc`}
            name="cvc"
            autoComplete="cc-csc"
            inputMode="numeric"
            placeholder="123"
            value={cvc}
            onChange={(e) => setCvc(digits(e.target.value).slice(0, 4))}
            aria-invalid={!!errors.cvc}
            aria-describedby={errors.cvc ? `${id}-cvc-err` : undefined}
            className="tabular-nums"
          />
          {err("cvc")}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor={`${id}-name`}>カード名義</Label>
        <Input
          id={`${id}-name`}
          name="ccname"
          autoComplete="cc-name"
          placeholder="TARO YAMADA"
          value={name}
          onChange={(e) => setName(e.target.value.toUpperCase())}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? `${id}-name-err` : undefined}
        />
        {err("name")}
      </div>

      <Button type="submit" className="w-full" disabled={busy}>
        {busy ? <><Loader2 className="motion-safe:animate-spin" />処理中…</> : <><Lock />¥22,580 を支払う</>}
      </Button>
      <p className="text-center text-xs text-muted-foreground" aria-live="polite">
        {busy ? `${method}で決済しています` : "テスト用: 4242 4242 4242 4242 / 12 / 30 / 123"}
      </p>
    </form>
  );
}
