"use client";

import { useState } from "react";

const users = ["alice", "bob", "carol", "dan", "eve"];

export default function MentionPicker() {
  const [v, setV] = useState("");
  const matchAt = v.match(/@(\w*)$/);
  const sug = matchAt ? users.filter((u) => u.startsWith(matchAt[1])).slice(0, 4) : [];
  return (
    <div className="space-y-2 max-w-md">
      <div className="text-xs text-muted-foreground">@ を入力するとユーザー候補が出ます</div>
      <div className="relative">
        <input
          value={v}
          onChange={(e) => setV(e.target.value)}
          placeholder="@で始めて..."
          className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-foreground/20"
        />
        {sug.length > 0 && (
          <ul className="absolute top-full left-0 mt-1 rounded-md border bg-popover shadow-md min-w-[10rem] overflow-hidden z-10">
            {sug.map((u) => (
              <li key={u} onMouseDown={() => setV((v) => v.replace(/@\w*$/, "@" + u + " "))} className="flex items-center gap-2 px-2 py-1.5 text-sm hover:bg-accent cursor-pointer">
                <div className="size-5 rounded-full bg-blue-400 text-white text-[10px] grid place-items-center">{u[0]}</div>
                @{u}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
