"use client";

const colors = ["from-blue-400 to-cyan-400", "from-emerald-400 to-lime-400", "from-amber-400 to-rose-400", "from-purple-400 to-pink-400", "from-indigo-400 to-blue-400", "from-teal-400 to-emerald-400", "from-rose-400 to-amber-400", "from-cyan-400 to-blue-400"];

export default function ThumbnailStrip() {
  return (
    <div className="space-y-2">
      <div className="text-xs text-muted-foreground">タイムライン上のフレーム一覧</div>
      <div className="overflow-x-auto -mx-2 px-2">
        <div className="flex gap-1 w-max">
          {colors.map((c, i) => (
            <div key={i} className="relative">
              <div className={`w-20 aspect-video rounded bg-gradient-to-br ${c}`} />
              <div className="absolute bottom-0 right-0 bg-black/70 text-white text-[9px] px-1 rounded-tl tabular-nums">{i * 30}s</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
