"use client";

import { useState } from "react";
import { Image as ImageIcon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

export default function PasteUpload() {
  const [imgs, setImgs] = useState<string[]>([]);
  const [text, setText] = useState("ここに何か貼り付けてください...");
  const onPaste = (e: React.ClipboardEvent) => {
    const items = Array.from(e.clipboardData.items);
    for (const it of items) {
      if (it.type.startsWith("image/")) {
        const file = it.getAsFile();
        if (file) {
          const r = new FileReader();
          r.onload = () => setImgs((p) => [...p, r.result as string]);
          r.readAsDataURL(file);
        }
      }
    }
  };
  return (
    <div className="space-y-2">
      <Textarea value={text} onChange={(e) => setText(e.target.value)} onPaste={onPaste} rows={3} />
      <div className="text-xs text-muted-foreground flex items-center gap-1.5">
        <ImageIcon className="size-3.5" />クリップボードから画像を貼り付け可
      </div>
      {imgs.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element -- blob: URLs from the clipboard cannot go through next/image */}
          {imgs.map((src, i) => <img key={i} src={src} alt="" className="size-16 object-cover rounded border" />)}
        </div>
      )}
    </div>
  );
}
