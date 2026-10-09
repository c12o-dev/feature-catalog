"use client";

export default function FocusRing() {
  return (
    <div className="space-y-3">
      <div className="text-xs text-muted-foreground">Tab で focus を移動するとリングが見えます</div>
      <div className="flex flex-wrap gap-2">
        <button className="rounded-md border bg-background px-3 py-1.5 text-sm focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none">Button A</button>
        <button className="rounded-md border bg-background px-3 py-1.5 text-sm focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none">Button B</button>
        <input className="rounded-md border bg-background px-3 py-1.5 text-sm focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none" placeholder="Input" />
        <a tabIndex={0} className="rounded-md text-blue-600 underline cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none px-1">Link</a>
      </div>
    </div>
  );
}
