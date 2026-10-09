"use client";

const data = [
  { name: "AAPL", v: 35, color: "bg-emerald-600" },
  { name: "MSFT", v: 28, color: "bg-emerald-500" },
  { name: "GOOG", v: 18, color: "bg-emerald-400" },
  { name: "AMZN", v: 12, color: "bg-red-400" },
  { name: "META", v: 9, color: "bg-red-500" },
  { name: "NVDA", v: 22, color: "bg-emerald-700" },
];

export default function Treemap() {
  return (
    <div className="grid grid-cols-6 gap-1 h-48">
      <div className="col-span-3 row-span-2 bg-emerald-600 text-white p-2 rounded flex flex-col justify-end">
        <div className="font-semibold">{data[0].name}</div>
        <div className="text-xs opacity-80">+{data[0].v}%</div>
      </div>
      <div className="col-span-3 bg-emerald-700 text-white p-2 rounded flex flex-col justify-end">
        <div className="font-semibold">{data[5].name}</div>
        <div className="text-xs opacity-80">+{data[5].v}%</div>
      </div>
      <div className="col-span-2 bg-emerald-500 text-white p-2 rounded flex flex-col justify-end">
        <div className="font-semibold text-sm">{data[1].name}</div>
        <div className="text-[10px] opacity-80">+{data[1].v}%</div>
      </div>
      <div className="bg-emerald-400 text-white p-1 rounded flex flex-col justify-end">
        <div className="text-xs font-semibold">{data[2].name}</div>
      </div>
      <div className="col-span-2 bg-red-400 text-white p-2 rounded flex flex-col justify-end">
        <div className="font-semibold text-sm">{data[3].name}</div>
        <div className="text-[10px] opacity-80">−{data[3].v}%</div>
      </div>
      <div className="col-span-2 bg-red-500 text-white p-1 rounded flex flex-col justify-end">
        <div className="text-xs font-semibold">{data[4].name}</div>
      </div>
    </div>
  );
}
