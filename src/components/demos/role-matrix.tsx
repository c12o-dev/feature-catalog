"use client";

import { Check, X } from "lucide-react";

const roles = ["Admin", "Editor", "Viewer"];
const perms = [
  { name: "プロジェクト閲覧", admin: true, editor: true, viewer: true },
  { name: "コンテンツ編集", admin: true, editor: true, viewer: false },
  { name: "メンバー招待", admin: true, editor: false, viewer: false },
  { name: "課金管理", admin: true, editor: false, viewer: false },
  { name: "プロジェクト削除", admin: true, editor: false, viewer: false },
];

export default function RoleMatrix() {
  return (
    <div className="overflow-x-auto rounded-md border bg-background">
      <table className="w-full text-sm">
        <thead className="bg-muted/30">
          <tr className="text-xs">
            <th className="text-left px-3 py-2">権限</th>
            {roles.map((r) => <th key={r} className="text-center px-3 py-2">{r}</th>)}
          </tr>
        </thead>
        <tbody className="divide-y">
          {perms.map((p) => (
            <tr key={p.name}>
              <td className="px-3 py-2">{p.name}</td>
              {(["admin", "editor", "viewer"] as const).map((r) => (
                <td key={r} className="text-center px-3 py-2">
                  {p[r] ? <Check className="size-4 text-emerald-600 mx-auto" /> : <X className="size-4 text-muted-foreground/50 mx-auto" />}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
