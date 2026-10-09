import type { SearchItem } from "@/lib/catalog";

let pending: Promise<SearchItem[]> | null = null;

/** Fetches /search-index.json once per page load; later calls share the same promise. */
export function loadSearchIndex(): Promise<SearchItem[]> {
  pending ??= fetch("/search-index.json")
    .then((r) => (r.ok ? (r.json() as Promise<SearchItem[]>) : []))
    .catch(() => {
      pending = null;
      return [];
    });
  return pending;
}
