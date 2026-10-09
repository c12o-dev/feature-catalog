"use client";

import { Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SsoButton() {
  return (
    <div className="space-y-3 max-w-xs mx-auto">
      <Button className="w-full" size="lg" variant="outline">
        <Building2 className="size-5" />
        SSO でサインイン
      </Button>
      <div className="text-xs text-muted-foreground text-center">企業の SSO (SAML / OIDC) でログイン</div>
    </div>
  );
}
