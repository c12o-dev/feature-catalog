"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown } from "lucide-react";

export default function InviteForm() {
  const [emails, setEmails] = useState("");
  const [role, setRole] = useState("Editor");
  return (
    <div className="space-y-3 max-w-md">
      <div className="text-sm font-medium">メンバーを招待</div>
      <div className="flex gap-2">
        <Input value={emails} onChange={(e) => setEmails(e.target.value)} placeholder="email1@..., email2@..." className="flex-1" />
        <button onClick={() => setRole(role === "Editor" ? "Viewer" : "Editor")} className="rounded-md border px-3 py-1.5 text-sm flex items-center gap-1">
          {role}<ChevronDown className="size-3" />
        </button>
      </div>
      <Button>招待を送信</Button>
    </div>
  );
}
