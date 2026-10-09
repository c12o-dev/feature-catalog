"use client";

import { useState } from "react";

export default function ProfileCard() {
  const [hov, setHov] = useState(false);
  return (
    <div className="text-sm leading-relaxed">
      Latest commit by <a onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} className="relative font-medium text-blue-600 cursor-pointer">
        @alice
        {hov && (
          <div className="absolute left-0 top-full mt-1 w-64 rounded-lg border bg-popover shadow-lg p-3 text-foreground z-10">
            <div className="flex items-center gap-3">
              <div className="size-12 rounded-full bg-rose-400 grid place-items-center text-white font-semibold">A</div>
              <div className="min-w-0">
                <div className="text-sm font-semibold">Alice Tanaka</div>
                <div className="text-xs text-muted-foreground">@alice · Engineer @acme</div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Building delightful developer tools. TypeScript / React / Rust.</p>
            <div className="flex gap-3 mt-2 text-xs">
              <span><strong>284</strong> following</span>
              <span><strong>1.2k</strong> followers</span>
            </div>
          </div>
        )}
      </a> at 10:32 today.
    </div>
  );
}
