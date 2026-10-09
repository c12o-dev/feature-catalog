"use client";

import { BadgeCheck } from "lucide-react";

const users = [
  { name: "Alice Tanaka", verified: true, color: "bg-rose-400" },
  { name: "Bob 公式アカウント", verified: true, color: "bg-blue-400" },
  { name: "Carol", verified: false, color: "bg-emerald-400" },
];

export default function VerifiedCheck() {
  return (
    <ul className="space-y-2">
      {users.map((u) => (
        <li key={u.name} className="flex items-center gap-2">
          <div className={`size-9 rounded-full ${u.color} grid place-items-center text-white font-medium`}>{u.name[0]}</div>
          <div className="text-sm font-medium flex items-center gap-1">
            {u.name}
            {u.verified && <BadgeCheck className="size-4 text-blue-500 fill-blue-500" stroke="white" />}
          </div>
        </li>
      ))}
    </ul>
  );
}
