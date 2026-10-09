export function TagList({ tags }: { tags: string[] }) {
  if (!tags.length) return null;
  return (
    <ul aria-label="特徴" className="flex flex-wrap gap-1.5">
      {tags.map((t) => (
        <li key={t} className="rounded-full border border-line-1 px-2.5 py-0.5 text-[11px] text-fg-3">
          {t}
        </li>
      ))}
    </ul>
  );
}
