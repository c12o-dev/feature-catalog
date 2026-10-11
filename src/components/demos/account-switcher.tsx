"use client";

import { useState } from "react";
import { Check, ChevronDown, Plus } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const accounts = [
  { id: 1, name: "Personal", email: "you@example.com", color: "bg-blue-400" },
  { id: 2, name: "Acme Inc", email: "you@acme.example", color: "bg-purple-400" },
  { id: 3, name: "Side Project", email: "you@side.example", color: "bg-emerald-400" },
];

export default function AccountSwitcher() {
  const [active, setActive] = useState(1);
  const cur = accounts.find((a) => a.id === active)!;
  return (
    <div className="flex justify-center">
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <button className="flex items-center gap-2 rounded-md border bg-background px-3 py-2 text-sm">
              <div className={`size-7 rounded ${cur.color} grid place-items-center text-white font-medium`}>{cur.name[0]}</div>
              <div className="text-left">
                <div className="text-sm font-medium leading-tight">{cur.name}</div>
                <div className="text-[10px] text-muted-foreground">{cur.email}</div>
              </div>
              <ChevronDown className="size-3.5 text-muted-foreground ml-2" />
            </button>
          }
        />
        <DropdownMenuContent className="w-56">
          {accounts.map((a) => (
            <DropdownMenuItem key={a.id} onClick={() => setActive(a.id)}>
              <div className={`size-5 rounded ${a.color} mr-2`} />
              <span className="flex-1">{a.name}</span>
              {active === a.id && <Check className="size-3.5" />}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem><Plus className="size-3.5 mr-2" />アカウント追加</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
