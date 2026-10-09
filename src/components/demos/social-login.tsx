"use client";

import { Button } from "@/components/ui/button";

const providers = [
  { name: "Google", color: "" }, { name: "Apple", color: "" },
  { name: "GitHub", color: "" }, { name: "X", color: "" },
];

export default function SocialLogin() {
  return (
    <div className="space-y-2 max-w-xs mx-auto">
      {providers.map((p) => (
        <Button key={p.name} variant="outline" className="w-full justify-center">
          {p.name} でサインイン
        </Button>
      ))}
    </div>
  );
}
