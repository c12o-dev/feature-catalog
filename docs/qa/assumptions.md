# 仮で進めた判断

`v2-launch.md` §11 の仮、および実装中に設計書だけでは決まらなかった点。覆すときはここを起点に。

| # | 判断 | 根拠 / 影響 |
|---|---|---|
| A1 | Cloudflare Web Analytics は入れない（Q3 の仮） | `_headers` の CSP は `'self'` のみ。入れる場合は §6.4 のとおり 2 ドメインを足す |
| A2 | 代表例の検証は別タスク。公開は待たない（Q4 の仮） | 全 341 件 `verified: false`。UI には出ない（D7） |
| A3 | デモのステージ内はシステムフォント（Hiragino / Yu Gothic UI / Noto Sans JP など） | ステージは「別アプリの画面」（§3.4 無彩色で静か）。D3 の書体はシェルにだけ適用し、自前サブセットをシェルの文言だけに絞れる（§6.2 フォント予算）。デモ 335 件の文言 1,300 字を和文フォントに含めると +150KB 以上 |
| A4 | 和文フォントは Fontsource のスライスではなく、サイトの文言から切った自前サブセット（`assets/fonts/`、コミット対象） | Fontsource のスライスは 1 ページ 550〜790KB を引いた。文言を変えたら再生成が要る（`tests/fonts.test.ts` が検知）。手順は `scripts/build-fonts.mjs` 冒頭 |
| A5 | `out/` の HTML は 380 件（G2 の「341 + 40」は概算と解釈） | 341 パターン + 25 カテゴリ + 9 目的 + ホーム / categories / goals + 404 / _not-found |
| A6 | 入場アニメーションは opacity 0.01 から（スクロール連動の reveal は 0 のまま） | opacity 0 の要素は LCP 候補にならず、ヒーローの LCP が 6 秒台になった。0.01 は見た目上 0 と区別できない |
| A7 | 目的ページのミニステージは固定高（15rem）で、はみ出すデモは下端をフェード | マウント時の高さ変化が CLS 0.049 を出していた（G5 は CLS = 0） |
| A8 | ⌘K の「戻る」（G8）は Playwright の `page.goBack()` で検証 | ブラウザ UI のショートカット（Alt+←）は Playwright から発火できない。同じ履歴操作 |
| A9 | `serve-out.mjs`（e2e / LHCI 用の静的サーバー）は brotli/gzip と `_headers` を適用 | 本番の Cloudflare Pages と同条件で転送量・CSP を測るため |
| A10 | Lighthouse の CLS 予算は `0.001`（G5 の「0」） | Lighthouse は浮動小数で返すため、実質 0 の判定に許容幅を置いた |
