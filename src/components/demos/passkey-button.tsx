"use client";

import { Fingerprint } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PasskeyButton() {
  return (
    <div className="space-y-3 max-w-xs mx-auto text-center">
      <Button size="lg" className="w-full">
        <Fingerprint className="size-5" />
        Passkey でサインイン
      </Button>
      <div className="text-xs text-muted-foreground">生体認証または PIN で安全にログイン</div>
    </div>
  );
}
