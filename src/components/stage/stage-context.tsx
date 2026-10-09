"use client";

import { createContext, useContext } from "react";

export type StageTheme = "light" | "dark";
export const StageContext = createContext<{ theme: StageTheme; setTheme: (t: StageTheme) => void } | null>(null);

/** Lets a demo (e.g. the theme toggle) read and switch the theme of the stage it sits on. */
export function useStage() {
  return useContext(StageContext);
}
