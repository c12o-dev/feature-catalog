"use client";

import { useState } from "react";
import { Globe, Check, ChevronDown } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const langs = [{ c: "ja", l: "日本語" }, { c: "en", l: "English" }, { c: "zh", l: "中文" }, { c: "ko", l: "한국어" }, { c: "es", l: "Español" }];

export default function LanguageSwitcher() {
  const [v, setV] = useState("ja");
  const cur = langs.find((x) => x.c === v)!;
  return (
    <div className="flex justify-center">
      <DropdownMenu>
        <DropdownMenuTrigger render={<button className="flex items-center gap-1.5 rounded-md border bg-background px-3 py-1.5 text-sm"><Globe className="size-4" />{cur.l}<ChevronDown className="size-3 text-muted-foreground" /></button>} />
        <DropdownMenuContent>
          {langs.map((l) => (
            <DropdownMenuItem key={l.c} onClick={() => setV(l.c)}>{l.l}{v === l.c && <Check className="ml-auto size-3.5" />}</DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
