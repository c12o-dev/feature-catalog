"use client";

import { useState } from "react";
import { Globe, Users, Lock, ChevronDown } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const opts = [
  { v: "public", l: "公開", icon: Globe, desc: "誰でも閲覧可" },
  { v: "friends", l: "フォロワーのみ", icon: Users, desc: "フォロワーだけ" },
  { v: "private", l: "非公開", icon: Lock, desc: "自分のみ" },
];

export default function VisibilityScope() {
  const [v, setV] = useState("friends");
  const cur = opts.find((o) => o.v === v)!;
  return (
    <div className="flex justify-center">
      <DropdownMenu>
        <DropdownMenuTrigger render={<button className="flex items-center gap-1.5 rounded-md border bg-background px-3 py-1.5 text-sm"><cur.icon className="size-4" />{cur.l}<ChevronDown className="size-3 text-muted-foreground" /></button>} />
        <DropdownMenuContent>
          {opts.map((o) => (
            <DropdownMenuItem key={o.v} onClick={() => setV(o.v)}>
              <o.icon className="size-4 mr-2" />
              <div>
                <div>{o.l}</div>
                <div className="text-[10px] text-muted-foreground">{o.desc}</div>
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
