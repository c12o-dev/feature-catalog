"use client";

const endpoints = [
  { method: "GET", path: "/api/users", color: "bg-blue-500" },
  { method: "POST", path: "/api/users", color: "bg-emerald-500" },
  { method: "GET", path: "/api/users/{id}", color: "bg-blue-500" },
  { method: "PUT", path: "/api/users/{id}", color: "bg-amber-500" },
  { method: "DELETE", path: "/api/users/{id}", color: "bg-red-500" },
];

export default function ApiDocs() {
  return (
    <div className="grid grid-cols-3 gap-2 h-44">
      <aside className="rounded-md border bg-background p-2 text-xs space-y-0.5 overflow-y-auto">
        <div className="font-medium mb-1">Users</div>
        {endpoints.map((e, i) => (
          <div key={i} className="flex items-center gap-1.5 px-1 py-0.5 rounded hover:bg-accent cursor-pointer">
            <span className={`text-[8px] font-bold text-white ${e.color} rounded px-1 w-12 text-center`}>{e.method}</span>
            <span className="font-mono truncate">{e.path}</span>
          </div>
        ))}
      </aside>
      <div className="rounded-md border bg-background p-3 text-xs col-span-2 overflow-y-auto">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-bold text-white bg-blue-500 rounded px-1.5">GET</span>
          <code>/api/users/{`{id}`}</code>
        </div>
        <div className="text-muted-foreground">指定 ID のユーザーを取得します。</div>
      </div>
    </div>
  );
}
