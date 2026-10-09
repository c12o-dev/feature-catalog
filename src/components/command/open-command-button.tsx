"use client";

import { OPEN_COMMAND_EVENT } from "./global-command";

export function OpenCommandButton({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <button type="button" className={className} onClick={() => window.dispatchEvent(new Event(OPEN_COMMAND_EVENT))}>
      {children}
    </button>
  );
}
