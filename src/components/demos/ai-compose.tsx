"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const templates = ["丁寧な依頼メール", "謝罪文", "リリース告知", "面接の感謝メール"];
const sample: Record<string, string> = {
  "丁寧な依頼メール": "お世話になっております。標題の件につきまして、〜のご対応をお願いできますでしょうか。お忙しい中恐縮ですが、ご検討のほどよろしくお願いいたします。",
  "謝罪文": "先日はご迷惑をおかけし、誠に申し訳ございませんでした。原因究明と再発防止に努めております。",
  "リリース告知": "本日 v2.0 をリリースしました。新機能 X、Y、Z をぜひご活用ください。",
  "面接の感謝メール": "本日はお時間を頂きありがとうございました。お話を伺い、ますます貴社で働きたい気持ちが強まりました。",
};

export default function AiCompose() {
  const [text, setText] = useState("");
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5">
        {templates.map((t) => (
          <Button key={t} size="xs" variant="outline" onClick={() => setText(sample[t])}>
            <Sparkles className="size-3" />{t}
          </Button>
        ))}
      </div>
      <Textarea rows={5} value={text} onChange={(e) => setText(e.target.value)} placeholder="テンプレを選ぶか自由入力" />
    </div>
  );
}
