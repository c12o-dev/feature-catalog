"use client";

import { useId, useState, type ChangeEvent } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const steps = ["基本情報", "所属", "確認"] as const;
type Data = { name: string; email: string; company: string; role: string };
type Errors = Partial<Record<keyof Data, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(step: number, d: Data): Errors {
  const e: Errors = {};
  if (step === 0) {
    if (!d.name.trim()) e.name = "名前を入力してください";
    if (!d.email.trim()) e.email = "メールアドレスを入力してください";
    else if (!EMAIL_RE.test(d.email.trim())) e.email = "メールアドレスの形式が正しくありません";
  }
  if (step === 1 && !d.role.trim()) e.role = "役職を入力してください";
  return e;
}

export default function MultiStepForm() {
  const id = useId();
  const [s, setS] = useState(0);
  const [done, setDone] = useState(false);
  const [data, setData] = useState<Data>({ name: "", email: "", company: "", role: "" });
  const [errors, setErrors] = useState<Errors>({});

  const set = (k: keyof Data) => (e: ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setData((d) => ({ ...d, [k]: v }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }));
  };

  const next = () => {
    const e = validate(s, data);
    setErrors(e);
    if (Object.keys(e).length > 0) {
      const first = Object.keys(e)[0];
      document.getElementById(`${id}-${first}`)?.focus();
      return;
    }
    if (s === steps.length - 1) setDone(true);
    else setS(s + 1);
  };

  const field = (k: keyof Data, label: string, opts: { type?: string; optional?: boolean; placeholder?: string } = {}) => (
    <div className="space-y-1.5">
      <Label htmlFor={`${id}-${k}`}>
        {label}
        {opts.optional && <span className="text-xs font-normal text-muted-foreground">任意</span>}
      </Label>
      <Input
        id={`${id}-${k}`}
        type={opts.type ?? "text"}
        value={data[k]}
        placeholder={opts.placeholder}
        onChange={set(k)}
        aria-invalid={errors[k] ? true : undefined}
        aria-describedby={errors[k] ? `${id}-${k}-err` : undefined}
      />
      {errors[k] && (
        <p id={`${id}-${k}-err`} className="text-xs text-destructive">
          {errors[k]}
        </p>
      )}
    </div>
  );

  if (done) {
    return (
      <div className="mx-auto w-full max-w-md rounded-lg border bg-card p-6 text-center" role="status">
        <div className="mx-auto mb-3 grid size-10 place-items-center rounded-full bg-primary text-primary-foreground">
          <Check className="size-5" />
        </div>
        <p className="text-sm font-medium">登録が完了しました</p>
        <p className="mt-1 text-xs text-muted-foreground">{data.email} に確認メールを送りました</p>
        <Button
          size="sm"
          variant="outline"
          className="mt-4"
          onClick={() => {
            setDone(false);
            setS(0);
            setData({ name: "", email: "", company: "", role: "" });
          }}
        >
          最初からやり直す
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-4 rounded-lg border bg-card p-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium">{steps[s]}</span>
          <span className="text-muted-foreground tabular-nums">
            ステップ {s + 1} / {steps.length}
          </span>
        </div>
        <div
          role="progressbar"
          aria-label="入力の進捗"
          aria-valuemin={1}
          aria-valuemax={steps.length}
          aria-valuenow={s + 1}
          aria-valuetext={`${steps.length} ステップ中 ${s + 1}: ${steps[s]}`}
          className="h-1.5 overflow-hidden rounded-full bg-muted"
        >
          <div
            className="h-full origin-left rounded-full bg-primary transition-transform duration-300"
            style={{ transform: `scaleX(${(s + 1) / steps.length})` }}
          />
        </div>
        <ol className="flex justify-between text-[11px] text-muted-foreground">
          {steps.map((label, i) => (
            <li key={label} className={cn("flex items-center gap-1", i <= s && "text-foreground")}>
              <span
                className={cn(
                  "grid size-4 place-items-center rounded-full border text-[10px] tabular-nums",
                  i < s && "border-primary bg-primary text-primary-foreground",
                  i === s && "border-primary"
                )}
              >
                {i < s ? <Check className="size-2.5" /> : i + 1}
              </span>
              {label}
            </li>
          ))}
        </ol>
      </div>

      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          next();
        }}
        className="space-y-4"
      >
        {s === 0 && (
          <div className="space-y-3">
            {field("name", "名前", { placeholder: "佐藤 美咲" })}
            {field("email", "メール", { type: "email", placeholder: "misaki@example.jp" })}
          </div>
        )}
        {s === 1 && (
          <div className="space-y-3">
            {field("company", "会社名", { optional: true, placeholder: "株式会社ミナモ" })}
            {field("role", "役職", { placeholder: "プロダクトデザイナー" })}
          </div>
        )}
        {s === 2 && (
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 rounded-md border bg-muted/40 p-3 text-sm">
            <dt className="text-muted-foreground">名前</dt>
            <dd className="min-w-0 break-words">{data.name}</dd>
            <dt className="text-muted-foreground">メール</dt>
            <dd className="min-w-0 break-all">{data.email}</dd>
            <dt className="text-muted-foreground">会社</dt>
            <dd className="min-w-0 break-words">{data.company || "—"}</dd>
            <dt className="text-muted-foreground">役職</dt>
            <dd className="min-w-0 break-words">{data.role}</dd>
          </dl>
        )}
        <div className="flex justify-between gap-2">
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => {
              setErrors({});
              setS((x) => Math.max(0, x - 1));
            }}
            disabled={s === 0}
          >
            戻る
          </Button>
          <Button type="submit" size="sm">
            {s === steps.length - 1 ? "登録する" : "次へ"}
          </Button>
        </div>
      </form>
    </div>
  );
}
