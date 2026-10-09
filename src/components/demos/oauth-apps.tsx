"use client";

import { Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const apps = [
  { name: "My CLI", clientId: "cli_x9k4P2", redirect: "http://localhost:8080/cb", scopes: "read:user, write:repo" },
  { name: "Slack Integration", clientId: "slk_3mPaB4", redirect: "https://slack.example.com/oauth", scopes: "read:user" },
];

export default function OauthApps() {
  return (
    <div className="space-y-2 max-w-md">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium">OAuth アプリケーション</div>
        <Button size="sm"><Plus className="size-3.5" />新規</Button>
      </div>
      <ul className="rounded-md border bg-background divide-y">
        {apps.map((a) => (
          <li key={a.clientId} className="p-3 space-y-1 text-sm">
            <div className="flex items-center justify-between">
              <span className="font-medium">{a.name}</span>
              <div className="flex gap-1">
                <button className="text-muted-foreground"><Edit className="size-3.5" /></button>
                <button className="text-muted-foreground hover:text-red-600"><Trash2 className="size-3.5" /></button>
              </div>
            </div>
            <div className="text-xs text-muted-foreground space-y-0.5">
              <div>client_id: <code className="font-mono">{a.clientId}</code></div>
              <div>redirect: <code className="font-mono">{a.redirect}</code></div>
              <div>scopes: {a.scopes}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
