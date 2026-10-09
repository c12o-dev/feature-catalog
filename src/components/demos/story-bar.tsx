"use client";

const users = [
  { name: "Alice", color: "from-rose-400 to-purple-500", new: true },
  { name: "Bob", color: "from-blue-400 to-cyan-500", new: true },
  { name: "Carol", color: "from-emerald-400 to-teal-500", new: false },
  { name: "Dan", color: "from-amber-400 to-rose-500", new: true },
  { name: "Eve", color: "from-indigo-400 to-pink-500", new: false },
];

export default function StoryBar() {
  return (
    <div className="overflow-x-auto -mx-2 px-2">
      <div className="flex gap-3 w-max">
        {users.map((u) => (
          <div key={u.name} className="flex flex-col items-center gap-1 w-16">
            <div className={`p-0.5 rounded-full ${u.new ? `bg-gradient-to-tr ${u.color}` : "bg-muted"}`}>
              <div className="rounded-full bg-background p-0.5">
                <div className="size-12 rounded-full bg-muted grid place-items-center text-xs font-medium text-muted-foreground">{u.name[0]}</div>
              </div>
            </div>
            <span className="text-xs truncate w-full text-center">{u.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
