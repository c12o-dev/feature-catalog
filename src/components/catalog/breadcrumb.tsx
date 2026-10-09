import Link from "next/link";
import { Xray } from "@/components/shell/xray";

export function Breadcrumb({ items }: { items: { href?: string; label: string }[] }) {
  return (
    <Xray slug="breadcrumb" as="nav" place="tr" className="inline-block">
      <ol aria-label="現在地" className="flex flex-wrap items-center gap-2 font-mono text-[11px] tracking-wide text-fg-4">
        <li>
          <Link href="/" className="hover:text-fg-1">Home</Link>
        </li>
        {items.map((i) => (
          <li key={i.label} className="flex items-center gap-2">
            <span aria-hidden>/</span>
            {i.href ? (
              <Link href={i.href} className="hover:text-fg-1">{i.label}</Link>
            ) : (
              <span aria-current="page" className="text-fg-2">{i.label}</span>
            )}
          </li>
        ))}
      </ol>
    </Xray>
  );
}
