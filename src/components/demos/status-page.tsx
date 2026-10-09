"use client";

const services = [
  { name: "API", uptime: 99.99, status: "operational" },
  { name: "Web App", uptime: 99.97, status: "operational" },
  { name: "Database", uptime: 99.95, status: "operational" },
  { name: "Background Jobs", uptime: 99.42, status: "degraded" },
];

export default function StatusPage() {
  return (
    <div className="rounded-md border bg-background overflow-hidden">
      <div className="px-3 py-2 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 text-sm font-medium">All Systems Operational</div>
      <ul className="divide-y">
        {services.map((s) => (
          <li key={s.name} className="flex items-center gap-3 px-3 py-2.5">
            <span className={`size-2 rounded-full ${s.status === "operational" ? "bg-emerald-500" : "bg-amber-500"}`} />
            <span className="text-sm flex-1">{s.name}</span>
            <div className="flex gap-px">
              {Array.from({ length: 30 }, (_, i) => (
                <div key={i} className={`w-1 h-5 rounded-sm ${i === 28 && s.status === "degraded" ? "bg-amber-500" : "bg-emerald-500"}`} />
              ))}
            </div>
            <span className="text-xs text-muted-foreground tabular-nums w-14 text-right">{s.uptime}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
