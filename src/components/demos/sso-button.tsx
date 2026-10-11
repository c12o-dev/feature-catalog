"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ArrowLeft, Building2, CheckCircle2, KeyRound, Loader2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Mock directory: email domain → the organisation's identity provider.
const IDP: Record<string, { org: string; idp: string; protocol: "SAML" | "OIDC" }> = {
  "hoshino.test": { org: "星野製作所", idp: "Hoshi ID", protocol: "SAML" },
  "kumo-labs.test": { org: "Kumo Labs", idp: "Kumo Auth", protocol: "OIDC" },
};

type Step = "email" | "found" | "redirect" | "done" | "none";

export default function SsoButton() {
  const id = useId();
  const [email, setEmail] = useState("aoi@hoshino.test");
  const [step, setStep] = useState<Step>("email");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const domain = email.split("@")[1]?.toLowerCase() ?? "";
  const hit = IDP[domain];
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const go = () => {
    setStep("redirect");
    timer.current = setTimeout(() => setStep("done"), 1400);
  };

  return (
    <div className="mx-auto w-full max-w-xs rounded-lg border bg-card p-4">
      <div aria-live="polite" className="space-y-3">
        {step === "email" && (
          <form
            className="space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              if (validEmail) setStep(hit ? "found" : "none");
            }}
          >
            <div className="flex items-center gap-2 text-sm font-medium">
              <Building2 className="size-4" aria-hidden />
              SSO でサインイン
            </div>
            <div className="space-y-1.5">
              <Label htmlFor={id} className="text-xs">
                会社のメールアドレス
              </Label>
              <Input id={id} type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <p className="text-[11px] text-muted-foreground">試す: …@hoshino.test / …@kumo-labs.test / その他</p>
            </div>
            <Button type="submit" className="w-full" disabled={!validEmail}>
              続ける
            </Button>
          </form>
        )}

        {step === "found" && hit && (
          <>
            <div className="text-xs text-muted-foreground">組織を検出しました</div>
            <div className="flex items-center gap-3 rounded-md border bg-background p-3">
              <div className="grid size-9 shrink-0 place-items-center rounded-md bg-muted text-sm font-semibold">{hit.org[0]}</div>
              <div className="min-w-0">
                <div className="truncate text-sm font-medium">{hit.org}</div>
                <div className="text-xs text-muted-foreground">
                  {hit.idp} · {hit.protocol}
                </div>
              </div>
            </div>
            <Button className="w-full" onClick={go}>
              <ShieldCheck />
              {hit.idp} で続ける
            </Button>
            <BackButton onClick={() => setStep("email")} />
          </>
        )}

        {step === "redirect" && hit && (
          <div className="flex flex-col items-center gap-2 py-4 text-center">
            <Loader2 className="size-5 animate-spin text-muted-foreground" aria-hidden />
            <div className="text-sm">{hit.idp} に移動しています…</div>
            <div className="text-xs text-muted-foreground">{hit.protocol === "SAML" ? "SAML リクエストを送信" : "認可コードフローを開始"}</div>
          </div>
        )}

        {step === "done" && hit && (
          <>
            <div className="flex items-center gap-2 text-sm font-medium">
              <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" aria-hidden />
              サインインしました
            </div>
            <p className="text-xs text-muted-foreground">
              {email} として {hit.org} のワークスペースに入りました。
            </p>
            <Button variant="outline" size="sm" onClick={() => setStep("email")}>
              サインアウト
            </Button>
          </>
        )}

        {step === "none" && (
          <>
            <p className="text-sm">
              <span className="font-mono text-xs">{domain}</span> には SSO が設定されていません。
            </p>
            <Button variant="outline" className="w-full" onClick={() => setStep("email")}>
              <KeyRound />
              パスワードでサインイン
            </Button>
            <BackButton onClick={() => setStep("email")} />
          </>
        )}
      </div>
    </div>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
      <ArrowLeft className="size-3" aria-hidden />
      別のメールアドレス
    </button>
  );
}
