"use client";

const users = [
  // Stage chart tokens; the initial's colour is picked per token and stage for ≥ 4.5:1.
  { name: "Alice", color: "bg-chart-1 text-black" },
  { name: "Bob", color: "bg-chart-2 text-black" },
  { name: "Carol", color: "bg-chart-3 text-white dark:text-black" },
  { name: "Dan", color: "bg-chart-4 text-black" },
  { name: "Eve", color: "bg-chart-5 text-black" },
];

export default function PresenceAvatars() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex -space-x-2">
        {users.slice(0, 4).map((u) => (
          <div
            key={u.name}
            className={`relative size-8 rounded-full ${u.color} ring-2 ring-background flex items-center justify-center text-xs font-medium`}
            title={u.name}
          >
            {u.name[0]}
            <span className="absolute right-0 bottom-0 size-2 rounded-full bg-emerald-500 ring-1 ring-background" />
          </div>
        ))}
        <div className="relative size-8 rounded-full bg-muted ring-2 ring-background flex items-center justify-center text-[10px] font-medium text-muted-foreground">
          +{users.length - 4}
        </div>
      </div>
      <div className="text-sm text-muted-foreground">{users.length} 人がオンライン</div>
    </div>
  );
}
