"use client";

const msgs = [
  { u: "viewer1", c: "text-purple-300", t: "PogChamp" },
  { u: "subscriber99", c: "text-blue-300", t: "ナイスプレイ！" },
  { u: "alice", c: "text-rose-300", t: "lol" },
  { u: "fan_42", c: "text-emerald-300", t: "💯" },
  { u: "newbie", c: "text-amber-300", t: "初見です" },
];

export default function ChatOverlay() {
  return (
    <div className="grid grid-cols-3 h-44 rounded-md border bg-zinc-900 text-white overflow-hidden">
      <div className="col-span-2 grid place-items-center text-zinc-500 text-xs border-r border-zinc-800">[ 配信動画 ]</div>
      <div className="p-2 text-xs space-y-1 overflow-y-auto">
        {msgs.map((m, i) => (
          <div key={i}><span className={`font-semibold ${m.c}`}>{m.u}:</span> {m.t}</div>
        ))}
      </div>
    </div>
  );
}
