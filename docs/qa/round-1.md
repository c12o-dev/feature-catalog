# QA Round 1 — 2026-10-10

計測ビルド: `a0d1781`（mobile ゲート追加後）。スクリーンショット 104 枚（`docs/qa/shots/`、gitignore）、Lighthouse 4 ページ。

## 1. 計測

```
pnpm run e2e    # smoke 379 / a11y 8 / stages 341 / keyboard 1 / mobile 350 → 1,079 件すべて通過
pnpm run shots  # 44 件通過（1440 / 390 × motion / reduced、+ dark stage、⌘K、X-ray）
pnpm run lhci   # 下表
```

| ページ | Perf | A11y | BP | SEO | FCP | LCP | CLS | TBT | JS | フォント |
|---|---|---|---|---|---|---|---|---|---|---|
| / | 88 | 100 | 100 | 100 | 1.31s | 1.39s | 0 | 452ms | 162KB | 61KB |
| /c/data-visualization | 94 | 100 | 100 | 100 | 1.38s | 2.06s | 0 | 240ms | 176KB | 48KB |
| /p/contribution-heatmap | 95 | 100 | 100 | 100 | 1.05s | 2.17s | 0 | 231ms | 176KB | 48KB |
| /g/experience | 89 | 100 | 100 | 100 | 1.36s | 2.11s | 0 | 401ms | 201KB | 43KB |

## 2. 自己採点（根拠はスクリーンショット名）

| 軸 | 自分 | 外部 | 採用 | 根拠 |
|---|---|---|---|---|
| Design | 8.2 | 7.4 | **7.4** | (+) `home-1440.png`: 明朝 96px の 3 行見出し＋琥珀の数字、右に 12 枚の Living Wall。`c_data-visualization-1440.png`: §01 / 和名 / 英名イタリックの三段組。(−) `p_contribution-heatmap-1440.png`: ステージ 22rem に対しデモが左上 1/4、白地の余白が主役になる。(−) 外部指摘のフルページ空白は撮影側の問題（§4）だが、採点時点の材料としては成立していない |
| Usability | 7.6 | 6.3 | **6.3** | (+) ⌘K、パンくず、TOC、prev/next、404 の再検索が揃う。(−) `c_data-visualization-1440.png`: 撮影手順（瞬間スクロール）で TOC が 06 から始まり「30 / 30」のまま → 実機でも瞬間ジャンプで再現する不具合だった。(−) `p_contribution-heatmap-1440.png`: ステージのツールバーがホバーまで見えない。(−) LCP が 3 ページで 1.8s 超 |
| Creativity | 8.4 | 7.6 | **7.6** | (+) `xray-home-1440.png`: Living Wall の各タイルに §番号ラベル、ページ全体パネルで skip link / cursor follower / view transitions が列挙される。(−) パネルがヒーロー本文に被る。隣接タイルのラベル（§09-17 と §01-14）が衝突。`xray-home-390.png`: ヘッダーのラベルがロゴに被る |
| Content | 8.0 | 7.2 | **7.2** | (+) `p_contribution-heatmap-1440-full.png`: notes が grid-flow-col / aria-label まで具体的、「このパターンが効く目的」の横串。(−) 外部はフルページで 4 件しか見えず残り 26 件の説明を確認できなかった（撮影側） |
| Structure & Navigation | 8.0 | 6.8 | **6.8** | 二層索引は明快（`categories-1440.png`, `goals-1440.png`）。TOC 不具合と撮影の空白 |
| Visual Design | 8.4 | 7.8 | **7.8** | `g_experience-1440.png` の二段見出し、`does-not-exist-1440.png` の透かし 404。`c_motion-1440-full.png` の二重露光（撮影側） |
| Functionality | 7.6 | 5.8 | **5.8** | A11y / BP / SEO 100、CLS 0、e2e 全通過。Perf 88〜95、LCP 超過 |
| Interactivity | 7.8 | 7.0 | **7.0** | `cmdk-1440.png`: 開いた直後の右ペインが空（今日のパターンを即プレビューしていない） |
| Overall Experience | 8.0 | 6.5 | **6.5** | 1 画面目は水準、スクロール先で空白（撮影側） |
| FWA 初見 5 秒 | 8.5 | 7.5 | **7.5** | `home-1440.png` の壁は効く。`home-390.png` は 1 画面目に壁がほぼ見えない |

外部採点（文脈なしの別エージェント、材料はスクリーンショットと Lighthouse のみ）が全軸で低く、1.0 以上の差は低い方を採用。

## 3. 指摘（S / A / B）と対応

| # | 重大度 | 画面 | 内容 | 対応 |
|---|---|---|---|---|
| 1 | S | `home-*-full.png` | 「UI のかたちで引く」「困りごとから引く」「このサイトについて」の本文が真っ黒 | **撮影側**: `.reveal`（scroll-driven の入場）が Playwright のフルページ撮影ではスクロールしないため進まない。撮影時に `animation: none` を注入（`tests/e2e/shots.spec.ts`） |
| 2 | S | `c_data-visualization-*-full.png` | 「30 / 30」のうち 4 件しか描画されず 10,000px 空白 | **撮影側**: `content-visibility: auto` のカードは Chromium の fullPage 撮影でスキップされたまま。ビューポートをページ高さに広げて撮る方式に変更 |
| 3 | S | `c_motion-1440-full.png` | ヘッダー・TOC・フッターの二重露光 | **撮影側**: sticky 要素の fullPage 合成。#2 と同じ変更で解消 |
| 4 | A | `goals-1440-full.png`, `c_motion-1440-reduced-full.png` | 2 テーマで描画が止まる | #1 と同じ |
| 5 | A | Lighthouse | Perf 88 / 89、LCP 2.0〜2.2s | `docs/qa/remaining.md` R1（見出しフォント到着で決まる。人の判断待ち） |
| 6 | A | `p_contribution-heatmap-1440.png` | ステージの余白がデモの 3 倍 | hero ステージを 22rem → 16rem、デモを縦中央に |
| 7 | A | `p_*-1440.png` vs `-390.png` | ステージのツールバーが 1440 ではホバーまで出ない | 常時表示に |
| 8 | A | `xray-home-1440.png`, `xray-home-390.png` | パネルが本文に被る、ラベル衝突、ヘッダーのラベルがロゴに被る | パネルは右下の折りたたみピル（既定は閉）。ラベルは自分の枠内で切り詰め（`max-w-[calc(100%-0.5rem)]`）。ヘッダーのラベルはヘッダー直下に吊る（`place="below"`） |
| 9 | A | `c_data-visualization-1440.png` | TOC が先頭で 06 から始まり「30 / 30」 | 現在地を IntersectionObserver の差分ではなく、要素位置から毎回再計算（＋ scroll での再計算）。瞬間ジャンプでも正しくなることを確認 |
| 10 | B | `cmdk-1440.png` | 開いた直後の右ペインが空 | 索引到着時に再マウントし「今日のパターン」を既定選択。入力は autoFocus で焦点維持 |
| 11 | B | `home-390.png` | 1 画面目に壁が見えない | モバイルのヒーロー上余白と行間を詰めた（壁 1 行目が覗く程度。根本は見出しの 3 行） |
| 12 | B | `does-not-exist-390.png` | プレースホルダが切れる | 短文化 |
| 13 | B | `p_*-full.png` | prev/next の片側が空の枠 | 「カテゴリの先頭です / 末尾です」でカテゴリへ戻るリンクに |
| 14 | B | `categories-1440.png` | カテゴリ色が静止画で分からない | §番号を常時カテゴリ色に |
| 15 | B | `c_motion-1440.png` | scroll-driven デモの初期状態で進捗バーが見えない | 未対応（Round 2 で再評価） |
| 16 | B | フッター | 「334 の動くデモ」と「動くデモ付き」の不一致 | 未対応（デモ無し 7 件の明示は Round 2 で判断） |

自分で見つけた追加分: mobile ゲートで `prompt-library` / `api-playground` が 390 でステージからはみ出し（grid 子要素の `min-w-0` 欠落）→ 修正。`content-visibility` の予約幅で `/c` が 390 で横スクロール → 高さだけ予約に変更。

## 4. ゲート

| ゲート | 結果 | 値 |
|---|---|---|
| G1 lint / typecheck / test | pass | 0 / 0 / 13 passed |
| G2 build | pass | 380 HTML（341 + 39） |
| G3 コンソール | pass | 379 ルート error 0 / warning 0 |
| G4 Lighthouse ≥ 95 | **fail** | Perf 88 / 94 / 95 / 89 |
| G5 CWV | **fail** | LCP 1.39 / 2.06 / 2.17 / 2.11s、CLS 0、TBT 452 / 240 / 231 / 401ms |
| G6 予算 | pass（JS・フォント） | JS 162〜201KB、フォント 43〜61KB |
| G7 axe | pass | 8 ページ + 全 341 ステージ × 2 テーマで serious / critical 0 |
| G8 キーボード | pass | `tests/e2e/keyboard.spec.ts` |
| G9 reduced-motion | pass | `-reduced` スクリーンショットで Living Wall 静止、入場アニメなし |
| G10 モバイル | pass | `tests/e2e/mobile.spec.ts`（横スクロール 0、全デモがステージ内） |
| G11 ステージ両対応 | pass | stages プロジェクト（axe）＋ `-darkstage` スクリーンショット |
| G12 デモ規約 | pass | `docs/qa/demo-checklist.md` ✗ 0 件 |

G4 / G5 は `remaining.md` R1・R2 のとおり人の判断待ち。それ以外は Round 2 で再採点する。
