/** Splits text into characters that rise in one after another on load (CSS only). */
export function RiseText({ text, delay = 0, step = 28, className }: { text: string; delay?: number; step?: number; className?: string }) {
  return (
    <span className={className} aria-label={text}>
      {Array.from(text).map((ch, i) => (
        <span key={i} aria-hidden className="rise-wrap">
          <span className="rise-char" style={{ animationDelay: `${delay + i * step}ms` }}>
            {ch === " " ? " " : ch}
          </span>
        </span>
      ))}
    </span>
  );
}
