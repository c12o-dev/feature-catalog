"use client";

import { useId, useState } from "react";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

type Addr = { zip: string; pref: string; line: string };

const ALL: Addr[] = [
  { zip: "160-0023", pref: "東京都", line: "新宿区西新宿 2-8-1" },
  { zip: "160-0022", pref: "東京都", line: "新宿区新宿 3-38-1" },
  { zip: "150-0043", pref: "東京都", line: "渋谷区道玄坂 1-2-3" },
  { zip: "150-0041", pref: "東京都", line: "渋谷区神南 1-19-11" },
  { zip: "100-0005", pref: "東京都", line: "千代田区丸の内 1-9-1" },
  { zip: "220-0011", pref: "神奈川県", line: "横浜市西区高島 2-19-12" },
  { zip: "530-0001", pref: "大阪府", line: "大阪市北区梅田 3-1-1" },
  { zip: "460-0008", pref: "愛知県", line: "名古屋市中区栄 3-5-1" },
  { zip: "812-0012", pref: "福岡県", line: "福岡市博多区博多駅中央街 1-1" },
];

const full = (a: Addr) => `${a.pref}${a.line}`;

function Highlight({ text, q }: { text: string; q: string }) {
  const i = q ? text.indexOf(q) : -1;
  if (i < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <mark className="rounded-sm bg-amber-200/70 text-inherit dark:bg-amber-500/30">{text.slice(i, i + q.length)}</mark>
      {text.slice(i + q.length)}
    </>
  );
}

export default function AddressAutocomplete() {
  const id = useId();
  const listId = `${id}-list`;
  const [v, setV] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [picked, setPicked] = useState<Addr | null>(null);

  const q = v.trim().replace(/-/g, "");
  const matches =
    q.length >= 2 ? ALL.filter((a) => full(a).includes(v.trim()) || a.zip.replace("-", "").startsWith(q)).slice(0, 6) : [];
  const show = open && matches.length > 0;

  const choose = (a: Addr) => {
    setV(full(a));
    setPicked(a);
    setOpen(false);
    setActive(-1);
  };

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      if (matches.length) setActive((i) => (i + 1) % matches.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setOpen(true);
      if (matches.length) setActive((i) => (i <= 0 ? matches.length - 1 : i - 1));
    } else if (e.key === "Enter" && show && active >= 0) {
      e.preventDefault();
      choose(matches[active]);
    } else if (e.key === "Escape") {
      setOpen(false);
      setActive(-1);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md space-y-3">
      <div className="relative min-h-64">
        <label htmlFor={`${id}-input`} className="mb-1.5 block text-xs font-medium">
          お届け先住所
        </label>
        <div className="relative">
          <div className="flex items-center gap-2 rounded-md border bg-background px-3 focus-within:ring-2 focus-within:ring-ring/50">
            <MapPin className="size-4 shrink-0 text-muted-foreground" aria-hidden />
            <input
              id={`${id}-input`}
              role="combobox"
              aria-expanded={show}
              aria-controls={listId}
              aria-autocomplete="list"
              aria-activedescendant={show && active >= 0 ? `${id}-opt-${active}` : undefined}
              autoComplete="off"
              value={v}
              onChange={(e) => {
                setV(e.target.value);
                setPicked(null);
                setOpen(true);
                setActive(-1);
              }}
              onFocus={() => setOpen(true)}
              onBlur={() => setOpen(false)}
              onKeyDown={onKey}
              placeholder="郵便番号 or 住所（例: 新宿、150）"
              className="h-9 min-w-0 flex-1 bg-transparent text-sm outline-none"
            />
          </div>
          <ul
            id={listId}
            role="listbox"
            aria-label="住所の候補"
            hidden={!show}
            className="absolute top-full right-0 left-0 z-10 mt-1 max-h-52 overflow-y-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md"
          >
            {matches.map((a, i) => (
              <li
                key={a.zip + a.line}
                id={`${id}-opt-${i}`}
                role="option"
                aria-selected={i === active}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => choose(a)}
                onMouseEnter={() => setActive(i)}
                className={cn(
                  "flex cursor-pointer flex-col rounded-sm px-2 py-1.5 text-sm",
                  i === active && "bg-accent text-accent-foreground",
                )}
              >
                <span className="truncate">
                  <Highlight text={full(a)} q={v.trim()} />
                </span>
                <span className="text-xs text-muted-foreground tabular-nums">〒{a.zip}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-3 rounded-md border border-dashed p-3 text-xs" aria-live="polite">
          {picked ? (
            <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1">
              <dt className="text-muted-foreground">郵便番号</dt>
              <dd className="tabular-nums">〒{picked.zip}</dd>
              <dt className="text-muted-foreground">都道府県</dt>
              <dd>{picked.pref}</dd>
              <dt className="text-muted-foreground">市区町村以下</dt>
              <dd>{picked.line}</dd>
            </dl>
          ) : (
            <p className="text-muted-foreground">2 文字以上入力すると候補が出ます。↑↓ で移動、Enter で確定、Esc で閉じる</p>
          )}
        </div>
      </div>
    </div>
  );
}
