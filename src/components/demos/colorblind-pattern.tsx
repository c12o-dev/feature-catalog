"use client";

const items = [
  { color: "bg-emerald-500", icon: "✓", label: "Pass" },
  { color: "bg-amber-500", icon: "!", label: "Warn" },
  { color: "bg-red-500", icon: "✕", label: "Fail" },
];

export default function ColorblindPattern() {
  return (
    <div className="space-y-2">
      <div className="text-xs text-muted-foreground">色だけに頼らずアイコン/形でも区別</div>
      <div className="flex gap-2">
        {items.map((it) => (
          <div key={it.label} className={`flex items-center gap-1.5 rounded-md ${it.color} text-white px-3 py-1 text-sm`}>
            <span className="font-mono">{it.icon}</span>{it.label}
          </div>
        ))}
      </div>
    </div>
  );
}
