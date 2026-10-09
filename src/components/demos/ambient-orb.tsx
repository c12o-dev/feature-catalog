"use client";

export default function AmbientOrb() {
  return (
    <div className="relative h-44 rounded-md border bg-zinc-950 overflow-hidden">
      <div className="absolute size-48 rounded-full bg-blue-500 blur-3xl opacity-50 animate-[orbA_8s_ease-in-out_infinite]" style={{ top: "-2rem", left: "-2rem" }} />
      <div className="absolute size-48 rounded-full bg-purple-500 blur-3xl opacity-50 animate-[orbB_10s_ease-in-out_infinite]" style={{ bottom: "-2rem", right: "-2rem" }} />
      <div className="relative h-full grid place-items-center text-white">Ambient orb</div>
      <style>{`@keyframes orbA { 0%,100% { transform: translate(0,0); } 50% { transform: translate(40px, 30px); } } @keyframes orbB { 0%,100% { transform: translate(0,0); } 50% { transform: translate(-30px, -40px); } }`}</style>
    </div>
  );
}
