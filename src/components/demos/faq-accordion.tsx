"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const items = [
  { q: "Free プランで使える機能は？", a: "1 プロジェクトと 100 MB のストレージ、基本的な機能すべてが含まれます。コミュニティサポートが利用可能です。" },
  { q: "プランはいつでも変更できますか？", a: "はい、ダッシュボードからいつでも upgrade / downgrade できます。日割り計算が適用されます。" },
  { q: "データはどこに保存されますか？", a: "AWS Tokyo (ap-northeast-1) リージョンに保存され、暗号化されます。GDPR / 個情法に準拠しています。" },
  { q: "API はありますか？", a: "Pro 以上で REST / GraphQL API が利用できます。Webhooks もサポートします。" },
];

export default function FaqAccordion() {
  return (
    <Accordion className="w-full">
      {items.map((it, i) => (
        <AccordionItem key={i} value={`i${i}`}>
          <AccordionTrigger>{it.q}</AccordionTrigger>
          <AccordionContent>{it.a}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
