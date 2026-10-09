"use client";

const rows = [
  { time: "10:32:14", user: "alice", action: "user.update", target: "user/42", ip: "10.0.1.5" },
  { time: "10:28:09", user: "bob", action: "project.create", target: "project/p_9k2", ip: "10.0.1.7" },
  { time: "10:15:42", user: "alice", action: "billing.upgrade", target: "plan/team", ip: "10.0.1.5" },
  { time: "09:54:01", user: "system", action: "key.rotate", target: "api_key/k_4f", ip: "internal" },
  { time: "09:42:38", user: "carol", action: "user.invite", target: "dan@example.com", ip: "10.0.1.9" },
];

export default function AuditLog() {
  return (
    <div className="overflow-x-auto rounded-md border bg-background font-mono text-xs">
      <table className="w-full">
        <thead className="bg-muted/30 text-[10px] uppercase tracking-wide text-muted-foreground">
          <tr><th className="text-left p-2">time</th><th className="text-left p-2">user</th><th className="text-left p-2">action</th><th className="text-left p-2">target</th><th className="text-left p-2">ip</th></tr>
        </thead>
        <tbody className="divide-y">
          {rows.map((r, i) => (
            <tr key={i} className="hover:bg-accent">
              <td className="p-2 text-muted-foreground tabular-nums">{r.time}</td>
              <td className="p-2">{r.user}</td>
              <td className="p-2 text-blue-600">{r.action}</td>
              <td className="p-2 text-muted-foreground">{r.target}</td>
              <td className="p-2 text-muted-foreground">{r.ip}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
