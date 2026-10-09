"use client";

export default function PwaSplash() {
  return (
    <div className="relative max-w-[200px] mx-auto h-72 rounded-3xl bg-zinc-950 p-1.5">
      <div className="relative h-full rounded-2xl bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 grid place-items-center text-white">
        <div className="text-center space-y-2">
          <div className="size-16 rounded-2xl bg-white/20 grid place-items-center font-bold text-xl mx-auto">FC</div>
          <div className="font-semibold">Feature Catalog</div>
          <div className="text-xs opacity-80">起動中...</div>
        </div>
      </div>
    </div>
  );
}
