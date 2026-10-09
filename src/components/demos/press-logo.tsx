"use client";

const press = ["TechCrunch", "Wired", "ProductHunt", "Hacker News", "The Verge"];

export default function PressLogo() {
  return (
    <div className="text-center space-y-2">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">As featured in</div>
      <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
        {press.map((p) => (
          <span key={p} className="font-serif italic text-muted-foreground/80 text-sm">{p}</span>
        ))}
      </div>
    </div>
  );
}
