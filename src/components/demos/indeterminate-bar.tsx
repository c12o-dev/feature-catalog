"use client";

export default function IndeterminateBar() {
  return (
    <div className="space-y-2 max-w-md">
      <div className="text-xs">処理中...</div>
      <div className="h-1 rounded-full bg-muted overflow-hidden relative">
        <div className="absolute inset-y-0 w-1/3 bg-primary animate-[indeterminate_1.5s_ease-in-out_infinite]" />
      </div>
      <style>{`@keyframes indeterminate { 0% { left: -33%; } 100% { left: 100%; } }`}</style>
    </div>
  );
}
