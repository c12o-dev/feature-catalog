import { SITE, categoryList, entries, stats, themes } from "@/lib/catalog";

/** /llms.txt (index) and /llms-full.txt (index + 使いどころ), per https://llmstxt.org */
export function llmsText(full: boolean) {
  const out = [
    `# ${SITE.name}`,
    "",
    `> ${SITE.description}`,
    "",
    `UI パターン（機能パターン）は、ユーザーから見える機能の「よくある作りの型」のこと。このサイトは ${stats.categories} カテゴリ・${stats.patterns} パターンを、それぞれ動くデモ付きで説明する索引で、コンポーネントライブラリではない。各パターンのページには一行説明・使いどころ・実装メモ・デモがある。目的（「フォームの離脱を減らしたい」など）からの逆引きは ${stats.themes} テーマ・${stats.goals} 項目。`,
    "",
    `作者: ${SITE.author}（${SITE.portal}）。ソース: ${SITE.repo}`,
    "",
  ];
  if (!full) out.push(`- [全文版（各パターンの使いどころ付き）](${SITE.url}/llms-full.txt)`, "");

  for (const c of categoryList) {
    out.push(`## ${c.code} ${c.name}（${c.en}）`, "", `- [${c.name}のパターン一覧](${SITE.url}/c/${c.slug})`);
    for (const e of entries.filter((x) => x.category === c)) {
      out.push(`- [${e.name}](${SITE.url}/p/${e.slug}): ${e.description}${full && e.when ? e.when : ""}`);
    }
    out.push("");
  }

  out.push("## 目的から探す", "");
  for (const t of themes) out.push(`- [${t.name}](${SITE.url}/g/${t.slug}): ${t.goals.map((g) => g.title).join("、")}`);
  out.push("");
  return out.join("\n");
}

export const textResponse = (body: string) => new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
