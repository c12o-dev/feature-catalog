"use client";

import { useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ReadAloudToggle() {
  const [on, setOn] = useState(false);
  const speak = () => {
    if ("speechSynthesis" in window) {
      const u = new SpeechSynthesisUtterance("これは読み上げのテストです。");
      u.lang = "ja-JP";
      speechSynthesis.speak(u);
    }
  };
  return (
    <div className="space-y-2 text-center">
      <Button size="sm" variant="outline" onClick={() => { setOn(!on); if (!on) speak(); }}>
        {on ? <><Volume2 className="size-4" />読み上げ ON</> : <><VolumeX className="size-4" />読み上げ OFF</>}
      </Button>
      <div className="text-xs text-muted-foreground">対応ブラウザで Web Speech API 使用</div>
    </div>
  );
}
