"use client";

import { useState } from "react";

const initial = `function fizzbuzz(n) {
  for (let i = 1; i <= n; i++) {
    if (i % 15 === 0) console.log("FizzBuzz");
    else if (i % 3 === 0) console.log("Fizz");
    else if (i % 5 === 0) console.log("Buzz");
    else console.log(i);
  }
}`;

export default function CodeEditor() {
  const [v, setV] = useState(initial);
  const lines = v.split("\n");
  return (
    <div className="rounded-md border bg-zinc-950 text-zinc-100 overflow-hidden">
      <div className="flex">
        <div className="bg-zinc-900 text-zinc-500 text-right text-xs font-mono py-3 px-2 select-none">
          {lines.map((_, i) => <div key={i}>{i + 1}</div>)}
        </div>
        <textarea
          value={v}
          onChange={(e) => setV(e.target.value)}
          spellCheck={false}
          className="flex-1 bg-transparent text-xs font-mono p-3 outline-none resize-none min-h-[10rem]"
        />
      </div>
    </div>
  );
}
