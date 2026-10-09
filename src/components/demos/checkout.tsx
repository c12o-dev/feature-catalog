"use client";

import { CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Checkout() {
  return (
    <div className="space-y-3 max-w-md">
      <div className="flex gap-2">
        <Button variant="outline" className="flex-1">  Apple Pay</Button>
        <Button variant="outline" className="flex-1">G Pay</Button>
      </div>
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <div className="h-px flex-1 bg-border" />OR<div className="h-px flex-1 bg-border" />
      </div>
      <div className="space-y-2">
        <Label className="flex items-center gap-1.5"><CreditCard className="size-4" />カード情報</Label>
        <Input placeholder="1234 5678 9012 3456" />
        <div className="grid grid-cols-2 gap-2">
          <Input placeholder="MM / YY" />
          <Input placeholder="CVC" />
        </div>
      </div>
      <Button className="w-full">¥22,580 を支払う</Button>
    </div>
  );
}
