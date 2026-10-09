"use client";

const users = [
  { name: "Alice", color: "bg-rose-400" },
  { name: "Bob", color: "bg-amber-400" },
  { name: "Carol", color: "bg-emerald-400" },
  { name: "Dan", color: "bg-blue-400" },
  { name: "Eve", color: "bg-purple-400" },
];

export default function PresenceAvatars() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex -space-x-2">
        {users.slice(0, 4).map((u) => (
          <div
            key={u.name}
            className={`relative size-8 rounded-full ${u.color} ring-2 ring-background flex items-center justify-center text-xs font-medium text-white`}
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
