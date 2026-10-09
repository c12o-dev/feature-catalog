"use client";

const logos = ["Acme", "Globex", "Initech", "Soylent", "Umbrella", "Wayne", "Stark", "Wonka"];

export default function LogoWall() {
  return (
    <div className="space-y-3 text-center">
      <div className="text-xs text-muted-foreground uppercase tracking-wider">Trusted by</div>
      <div className="grid grid-cols-4 gap-3 items-center">
        {logos.map((l) => (
          <div key={l} className="text-sm font-bold tracking-tight text-muted-foreground/70 hover:text-foreground transition-colors">{l}</div>
        ))}
      </div>
    </div>
  );
}
