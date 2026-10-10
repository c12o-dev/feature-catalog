# Feature Catalog v2 公開設計（2026-10）

> 2026-10-09 作成。現行の実装（2026-04 の v1、未コミット）を公開品質まで引き上げるための設計書。
> 実装は本書の決定事項に従う。設計の再検討はしない。判断が要る点は §11「要確認」に隔離してある。
> 品質基準と自己検証の手順は `docs/design/quality-loop.md`。

## 0. Context

- 現状: Next.js 16.2 / React 19.2 / Tailwind v4 / shadcn(base-nova) で 25 カテゴリ・341 パターン・340 デモ（うち 19 は別デモの再利用）。`next build` と `output: "export"` は通る。ビルド成果物は `out/` 11MB。
- 用途: 個人の語彙索引であると同時に、c12o.net（ポートフォリオ）からリンクされる「魅せる」サイト。
- 目標品質: Awwwards / Webby / FWA の受賞水準。採点軸と合格ラインは quality-loop.md に定義。
- 配信: Cloudflare Pages（静的）。ポートフォリオ `c12o.net` と同じ運用。

### v1 で見つかっている不具合（必ず直す）

| # | 内容 | 場所 |
|---|---|---|
| B1 | ホームの「動くデモ」が 0 と表示（client モジュールのレジストリを Server Component で `Object.keys`） | `src/app/page.tsx` |
| B2 | ⌘K の「目的」選択が `#0` に飛ぶが id は `g0`。スクロールしない | `src/components/global-command.tsx` |
| B3 | パターン名「スレッド discussion」が 2 カテゴリで重複。アンカー衝突、逆引きが先勝ち | `src/data/categories.ts` |
| B4 | README の「230 パターン・36 デモ」が実態（341 / 340）と不一致 | `README.md` |
| B5 | lint エラー 5 件（`react-hooks/set-state-in-effect`） | form-restore / progress-bar / reduced-motion / streaming-text / timed-clipboard |
| B6 | `package-lock.json` が存在（方針は pnpm）。Turbopack が複数ロックファイル警告 | ルート |
| B7 | `setInterval` / `setTimeout` を持つデモ 37 件のうち 20 件に clear がない。アンマウント後の setState の温床 | `src/components/demos/*` |
| B8 | recharts の `width(-1)` 警告（ResponsiveContainer の初回計測）。コンソールを汚す | recharts 利用 6 件 |

## 1. コンセプト

**「このサイト自身が、カタログの一番良いデモである」**

- サイトのシェル（ヒーロー、ナビ、遷移、検索、404、フッター）で使う演出は、すべてカタログに載っているパターンで作る。
- **X-ray モード**（§4.7）を入れる。ON にするとサイトの UI 上に「これは §16-4 Scroll-driven animation」のようなラベルが浮き、クリックでそのパターンのページへ飛ぶ。自己言及が創造性の核になる。
- 見せ場は「シェル」、デモは「舞台」。シェルは大胆に、デモを載せるステージは無彩色で静かに。デモ同士が色やモーションで喧嘩しないこと。

## 2. 決定事項

| # | 決定 |
|---|---|
| D1 | テーマはダーク固定。サイト全体のライト/ダーク切替は廃止。代わりに**デモのステージだけ**ライト/ダークを切り替えられる（§4.4） |
| D2 | 色は c12o ファミリーのトークンを継承する（`--bg-0..3` / `--fg-1..4` / アクセント amber `#E8B458`）。加えて**カテゴリごとの色相**（§3.2）を持ち、ホームとカテゴリページでその色が「にじむ」 |
| D3 | 書体: 見出し＝Shippori Mincho B1（700）、本文＝Zen Kaku Gothic New（400/700）、数字・ラベル・索引＝JetBrains Mono Variable。Geist は外す。ポートフォリオと同じ `scripts/build-fonts.mjs` で自己ホスト |
| D4 | パターンに ASCII の `slug` を付与し、**パターン個別ページ `/p/[slug]`** を新設。カード内アンカーは `id={slug}` に変える（URL エンコードされた日本語ハッシュをやめる） |
| D5 | カード → 個別ページは React `<ViewTransition>` の shared element で遷移（`experimental.viewTransition: true`） |
| D6 | デモはビューポート到達時に描画（IntersectionObserver）。初期描画でマウントするデモはホームの Living Wall（§4.1）だけ |
| D7 | 「代表例」は `verified: true` のものだけ UI に出す。未検証は data に残し UI には出さない。`[unverified]` 表記は廃止 |
| D8 | 別デモ再利用 19 件は、意味が違うものは固有デモに作り直し、同一でよいものは `aliasOf` を持たせ UI に「〇〇と同じデモ」と明示（§5.3） |
| D9 | 各パターンに `notes`（実装のポイント 1〜2 文）、`libs`（使用ライブラリ）、`tags` を持たせ、個別ページに出す |
| D10 | 静的書き出し `output: "export"`。Cloudflare Pages に GitHub 連携でデプロイ。ドメインは `features.c12o.net`（確定） |
| D11 | パッケージマネージャは pnpm。`package-lock.json` を削除し `pnpm-lock.yaml` をコミット。`packageManager` を package.json に明記 |
| D12 | 外部ネットワークに出るデモは作らない（地図・決済・動画は UI モック）。公開サイトはサードパーティ読み込みゼロ（Cloudflare Web Analytics だけ任意） |
| D13 | `prefers-reduced-motion` を全演出で尊重。常時動く演出（Living Wall、カウンター、マーキー）は reduce 時に静止画＋手動再生ボタンに落とす |
| D14 | 名乗り・著作権は `Seu (c12o)`。フッターは `© 2026 Seu (c12o) · c12o.net / blog / GitHub` の形でポートフォリオと同型 |
| D15 | リポジトリは **公開**（`github.com/c12o-dev/feature-catalog`、MIT）。各デモのステージと個別ページに「ソースを見る」リンクを出す（§6.7）。公開前に README からローカルパスを消し、LICENSE と `author` を整える |

## 3. デザイン

### 3.1 方向

- **大きい活字、深い黒、ひと筋の琥珀。** 見出しは明朝の大サイズ（ヒーロー 72〜120px、`clamp` で可変）、索引番号はモノスペース。余白は広く、罫線は細く。
- 動きは「意味のある動き」だけ。入場は 1 回、ホバーは 120〜240ms、ページ遷移は 320〜480ms。`transform` と `opacity` 以外をアニメーションしない。
- グレイン（ノイズ）を背景に薄く敷く（SVG `feTurbulence`、opacity 0.04 前後）。カーソル追従光（§4.2）はデスクトップのみ。
- スクロールジャックはしない。横スクロールの強制もしない。

### 3.2 トークン

`src/styles/tokens.css` を新設し、ポートフォリオの `src/styles/tokens.css` を複製（冒頭に `mirrors portfolio src/styles/tokens.css @ <commit>` を書く）。shadcn の `:root` 変数はトークンに**マップ**する（`--background: var(--bg-0)` のように）。既存の shadcn コンポーネントはそのまま使えること。

カテゴリ色相（25 → 8 ファミリー、OKLCH の hue だけ変える）:

| hue | カテゴリ |
|---|---|
| 60 (amber) | 25 meta / 24 dev-features / 23 help |
| 25 (coral) | 12 engagement / 21 social / 7 notifications |
| 330 (rose) | 14 commerce / 11 trust |
| 290 (violet) | 3 ai-integration / 13 personalization |
| 250 (blue) | 1 data-visualization / 19 maps / 20 media |
| 200 (cyan) | 5 search-nav / 10 layout / 17 mobile |
| 150 (green) | 9 forms / 4 auth / 22 security |
| 100 (lime) | 2 onboarding / 6 collaboration / 8 content / 15 perf-feedback / 16 motion / 18 a11y |

カテゴリ色は `--cat-hue` として要素に付与し、`oklch(0.72 0.14 var(--cat-hue))` の形で使う。彩度は amber と同じ範囲に抑え、ダーク地で 4.5:1 を満たす明度に固定する。

### 3.3 書体と読み

- 和文は `build-fonts.mjs` が `public/fonts/` に unicode-range スライスを生成（gitignore）。`fonts.css` は非同期読み込み、`font-display: swap`。
- ヒーロー見出しに使うスライスだけ `<link rel="preload">`。
- 行長は本文 36〜40 字、`line-height` 1.8。英数字と和文の間はスペースではなく `font-feature-settings: "palt"` と `letter-spacing` で調整。
- 禁則とぶら下がり: `overflow-wrap: anywhere` は使わない。`word-break: auto-phrase` を見出しに適用（非対応ブラウザは無視される）。

### 3.4 ステージ（デモの枠）

- 背景 `--bg-1`、罫線 `--line-1`、角丸 `--radius-md`、内側パディング 24px。カテゴリ色は**使わない**。
- 右上にツールバー: ステージの light/dark 切替、リセット（デモを再マウント）、個別ページへのリンク、「ソースを見る」（§6.7）、X-ray 用のラベル。
- 幅 320px でもデモが崩れない。崩れるデモはデモ側を直す。

## 4. 情報設計と画面

```
/                      ホーム
/categories            カテゴリ索引
/c/[slug]              カテゴリ（25）
/p/[slug]              パターン個別（341）  ← 新設
/goals                 目的索引
/g/[slug]              目的（9）
/not-found             404
/sitemap.xml  /robots.txt  /opengraph-image（ルート）  /p/[slug]/opengraph-image
```

### 4.1 ホーム

1. **ヒーロー**: 左に見出し（「ユーザーから見える機能、341 の語彙」）と 1 文、右に **Living Wall**。Living Wall は 3×4 の小さなタイルで、各タイルが自律して動く軽量デモ（sparkline / contribution heatmap / progress ring / streaming text / counter / live badge / skeleton→content / toggle / emoji reaction / sortable list / waveform / gauge）。ホバーでパターン名とカテゴリ番号が浮く。クリックで `/p/[slug]` へ shared element 遷移。
2. **数字**: カテゴリ 25 / パターン 341 / 固有デモ 322 / 目的 28。`CounterTick` パターンで入場時にカウントアップ（reduce 時は即値）。数値は data から算出し、ハードコードしない。
3. **カテゴリ帯**: 25 カテゴリを横に並べた帯。ホバーで背景がそのカテゴリ色相ににじむ（§4.2）。
4. **目的から探す**: 問題文 6 つを大きな活字で。クリックで `/g/`。
5. **このサイトについて**: 3 段落。語彙索引であること、デモはモックを含むこと、X-ray モードの案内。
6. **フッター**: c12o.net / blog / GitHub リポジトリ / 「このページで使っているパターン」リンク（X-ray 起動）。

### 4.2 カーソルとにじみ

- デスクトップ（`pointer: fine`）のみ、カーソル位置に半径 480px の放射グラデーション（`--accent-glow`、opacity 0.12）を追従。`requestAnimationFrame` 1 本で `--mx/--my` を更新し、要素は CSS だけで追従する。
- カテゴリカードにホバーすると `--cat-hue` が `body` に伝播し、背景のグラデーション色が 480ms で遷移する。

### 4.3 カテゴリページ `/c/[slug]`

- 左（lg 以上）に **目次パネル**: パターン名一覧。スクロールに追従して現在位置をハイライトし、読んだ割合が細い進捗線で埋まる（AnchorToc / Scroll-driven パターンの dogfood）。
- 右にパターンカード縦並び。カードはビューポート到達でデモをマウント（D6）。画面外に出て 1 分経ったらアンマウントしてタイマーを止める。
- カードヘッダ: `§1-03` 形式の索引（mono）/ 名前（明朝）/ 説明 / タグ。下にステージ。
- 前後カテゴリへのナビをページ末尾に。

### 4.4 パターン個別ページ `/p/[slug]`

- 上: 索引・名前・説明。shared element はカードの名前とステージ枠。
- 中: ステージを大きく（最大幅 880px）。ツールバーで light/dark ステージ切替、リセット、「ソースを見る」（§6.7）。
- 下: `notes`（実装のポイント）、`libs`、`verified` な代表例、このパターンを参照している**目的**の一覧、同カテゴリの前後パターン、`aliasOf` があれば明示。
- OG 画像を `opengraph-image.tsx` で生成（1200×630、黒地にパターン名を明朝で大きく、右下に `features.c12o.net`。和文フォントは `fs.readFile` でスライスを埋め込む）。

### 4.5 目的ページ `/goals` `/g/[slug]`

- 問題文を主役に。該当パターンはチップではなく、名前＋1 行説明＋ミニステージ（デモがあれば小さく動く）の行にする。
- ⌘K からの遷移は `#g{i}` に合わせる（B2）。

### 4.6 ⌘K

- 既存の cmdk を拡張: 左に候補、右に**プレビュー枠**（選択中パターンのデモを即マウント）。
- 直近に開いたパターン 5 件（localStorage、try/catch）。
- 入力ゼロの状態では「今日のパターン」（日付シードで決定的に 1 件）を出す。

### 4.7 X-ray モード

- ヘッダの「X」トグル、または `?x-ray=1`、またはキーボード `x` 2 回。
- ON のとき、`data-pattern="scroll-driven"` 属性を持つシェル要素に角ラベル（mono、カテゴリ色）が重なる。ラベルは `/p/[slug]` へのリンク。
- 対象: ヘッダ（sticky shrink）、⌘K（command palette）、Living Wall（各タイル）、カウンター、目次（anchor toc）、カーソル光（cursor follower）、ページ遷移（view transitions）、404（empty state）、トースト、テーマ切替（ステージ）、スケルトン、グレイン（ambient）。最低 12 箇所。
- 状態は URL に持ち、リロードで維持。

### 4.8 404

- `EmptyState` パターンの dogfood。入力欄付きで、打つとその場で ⌘K と同じ検索が走る。

## 5. データとデモ

### 5.1 データ型

```ts
type Pattern = {
  slug: string;            // ASCII, kebab, サイト内で一意
  name: string;
  description: string;
  tags?: string[];
  example?: { text: string; verified: boolean };
  demo?: string;           // registry key
  aliasOf?: string;        // 別パターンの slug（デモ共有時）
  notes?: string;          // 実装のポイント 1〜2 文
  libs?: string[];         // "recharts" など
};
```

- `slug` は英語名から機械生成せず、人が決める（例: `contribution-heatmap`, `skill-radar`）。重複は型テストで落とす。
- `goals.ts` の `patterns` は名前ではなく `slug` で参照する。
- データ整合性テスト（Vitest）: slug 一意 / demo が registry に存在 / registry のキーが全て使われている / goals の参照が解決する / aliasOf が解決する / `verified: true` の example は空でない。

### 5.2 デモの共通規約

1. `"use client"`、default export、props なし。
2. 初期状態は決定的（乱数は seed 固定）。
3. 1 クリック以内に何かが動く。自律して動くデモは 10 秒以内にループまたは停止。
4. タイマー・購読・イベントは必ず cleanup。`useEffect` 内で同期 setState しない（B5）。
5. `prefers-reduced-motion` を見る。`motion` ライブラリは `useReducedMotion`、CSS は `motion-safe:` 変種。
6. ステージ幅 320px で崩れない。固定幅を持たない。
7. 外部ネットワーク・外部フォント・外部画像を使わない。
8. ライトステージ／ダークステージの両方で読める（`dark:` 変種ではなく、ステージの `data-stage` に追従する変種を使う）。
9. recharts は `ResponsiveContainer` に `initialDimension` を渡すか、親の高さを固定して B8 を消す。

### 5.3 別デモ再利用 19 件の扱い

固有化する（意味が違う）:
`vertical-video`（縦動画はスワイプ縦送り）、`tree-view`（サイドバーではなく展開ツリー）、`skeleton-fade`（skeleton→content のクロスフェード）、`toast-slide`（出入りの方向）、`like-burst`（連打バースト）、`map-heatmap`（等高線ではなく点密度）、`gantt-view`（ガントとは別の「ビュー切替」）、`optimistic-ui`（submit ではなくリスト操作の楽観更新）、`reaction-picker`（絵文字リアクション表示とは別の選択 UI）。

`aliasOf` で明示して残す:
`bottom-sheet-mobile` / `font-resize` / `notification-perm-prompt` / `personal-audit-log` / `replay-tooltip` / `sns-reaction` / `social-thread` / `ambient-orb` / `street-view` / `version-footer`（後ろ 3 つは中身を確認して、固有化できるなら固有化）。

### 5.4 代表例の検証

- 341 件の `example` を `verified: false` で持ち越し、別タスクで検証する。検証は「そのサービスにその機能が現在あるか」を公式ページで確認できたものだけ `true`。
- 公開は検証完了を待たない（D7）。

## 6. 技術

### 6.1 設定

```ts
// next.config.ts
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  experimental: { viewTransition: true },
  turbopack: { root: __dirname },
};
```

- `trailingSlash` は付けない（Pages は `/c/auth` → `c/auth.html` を解決する）。
- `src/app/sitemap.ts` / `robots.ts` / `opengraph-image.tsx` を静的生成。`metadataBase` は `https://features.c12o.net`。
- `metadata.title` は `{ default: "Feature Catalog", template: "%s · Feature Catalog" }`。
- JSON-LD: ルートに `WebSite`、`/p/[slug]` に `CreativeWork`（`isPartOf`）。
- `public/` の Next デフォルト SVG を削除。favicon は SVG（amber の「§」）＋ `apple-touch-icon.png` 180px。

### 6.2 パフォーマンス予算

| 指標 | 予算（モバイル、Slow 4G 相当） |
|---|---|
| LCP | ≤ 1.8s（ホーム）。/c・/p・/g は ≤ 2.5s（2026-10-10 決定、見出しフォントの到着が支配するため） |
| CLS | 0（フォント swap による揺れはフォールバック `size-adjust` で吸収） |
| INP | ≤ 200ms |
| ホームの初期 JS（gzip、デモ除く） | ≤ 180KB |
| カテゴリページの初期 JS（デモ除く） | ≤ 200KB |
| 1 デモあたりの chunk | ≤ 40KB（recharts 系は共有 chunk に寄せる） |
| フォント初回転送 | ≤ 120KB（ヒーローの見出しスライス＋本文 1 スライス） |
| Lighthouse（モバイル） | Performance / Accessibility / Best Practices / SEO すべて ≥ 95 |

### 6.3 アクセシビリティ

- WCAG 2.2 AA。コントラスト 4.5:1（大きい活字 3:1）。
- すべての操作がキーボードで完結。`focus-visible` リングはアクセント色、2px、オフセット 2px。
- スキップリンク、ランドマーク、見出し階層（h1 は 1 つ）。
- Living Wall とカーソル光は `aria-hidden`。X-ray ラベルはリンクとして読める。
- `prefers-reduced-motion` で: ページ遷移はクロスフェードのみ、Living Wall は静止＋再生ボタン、カウンターは即値、グレインは静止。
- axe（serious / critical）0 件。

### 6.4 配信（Cloudflare Pages）

- プロジェクト名 `feature-catalog`、GitHub `main` 連携。Build command `pnpm run build`、Output `out`、`NODE_VERSION=22`。
- `wrangler.jsonc` を置き `pages_build_output_dir: "./out"`。`pnpm run preview` = `wrangler pages dev out`。
- `public/_headers`:

```
/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; frame-ancestors 'none'
/_next/static/*
  Cache-Control: public, max-age=31536000, immutable
/fonts/*
  Cache-Control: public, max-age=31536000, immutable
```

  Next は inline script を出すため `script-src` に `'unsafe-inline'` が要る。nonce 方式は静的配信では不可。これは既知の妥協として README に書く。
- `public/.well-known/security.txt`（ポートフォリオと同文、Expires 2027-09）。
- Cloudflare Web Analytics は任意。入れるなら `_headers` の `script-src` と `connect-src` に `static.cloudflareinsights.com` / `cloudflareinsights.com` を追加。

### 6.5 CI とテスト

- `.github/workflows/ci.yml`: `pnpm install --frozen-lockfile` → `pnpm run lint` → `pnpm run typecheck` → `pnpm run test` → `pnpm run build` → Playwright smoke → Lighthouse CI（予算 §6.2 を `lighthouserc.json` に）。
- Vitest: データ整合性（§5.1）。
- Playwright: 全ルートを 1 回ずつ開いてコンソールエラー 0 を確認（341 件は並列 8 で 2 分以内）。代表 8 ページで axe。1440 / 390 幅のスクリーンショットを `docs/qa/shots/` に保存（gitignore）。
- Dependabot（npm、週次）。

### 6.6 スクリプト

```json
"scripts": {
  "dev": "node scripts/build-fonts.mjs && next dev",
  "build": "node scripts/build-fonts.mjs && next build",
  "preview": "wrangler pages dev out",
  "lint": "eslint",
  "typecheck": "tsc --noEmit",
  "test": "vitest run",
  "e2e": "playwright test",
  "shots": "playwright test --project=shots",
  "lhci": "lhci autorun",
  "check": "pnpm run lint && pnpm run typecheck && pnpm run test && pnpm run build && pnpm run e2e && pnpm run lhci"
}
```

### 6.7 公開リポジトリ

- リポジトリ: `github.com/c12o-dev/feature-catalog`（public）。まだ remote がないので Phase 0 で作る（`gh repo create c12o-dev/feature-catalog --public --source=. --push`）。
- `LICENSE`: MIT、`Copyright (c) 2026 Seu`。
- `package.json`: `"author": "Seu (https://c12o.net)"`, `"license": "MIT"`, `"repository"` を追加。
- README を公開向けに書き直す。ローカルパス（`/home/sei/...`）と「記憶ベース」の注記を消し、データの出典は「個人メモから整理」とだけ書く。スタック、構成、起動、デモの追加手順、デプロイ、ライセンスの順。
- 「ソースを見る」リンクは `https://github.com/c12o-dev/feature-catalog/blob/main/src/components/demos/<file>.tsx`。registry のキーからファイル名を引けるよう、registry に `file` を持たせる（`{ load, file }`）。
- 公開前チェック: `git log -p` に秘密情報がないこと（初期コミットのみなので問題なし）、`.env*` が gitignore 済み、`docs/qa/shots/` が gitignore 済み。

## 7. ポートフォリオとの接続

- `portfolio/docs/content/projects/feature-catalog.txt` に本文（なぜ作ったか・判断・技術）。`src/data/projects.ts` に項目追加、`public/screenshots/feature-catalog.webp`（16:9、ホームのヒーロー＋Living Wall）。
- 本サイトのフッターから c12o.net、blog、GitHub リポジトリへ。ヘッダには外部リンクを置かない。
- GitHub プロフィール README の表にも追加（ポートフォリオ D12 と同じ運用）。

## 8. 実装フェーズ

| Phase | 内容 | 完了条件 |
|---|---|---|
| 0 | 現状を `v1` としてコミット。pnpm 移行（D11）。LICENSE・README・`author` を公開向けに整え、GitHub に public で作成して push（§6.7）。B1〜B6 修正 | `pnpm run lint` / `typecheck` / `build` が全部通り、GitHub に main がある |
| 1 | データ: slug 付与、重複解消、`aliasOf` / `notes` / `libs` / `example.verified`。Vitest 整合性テスト。`/p/[slug]` 新設 | 341 ページ生成、テスト緑 |
| 2 | トークン・書体・ステージ・レイアウトの差し替え（§3）。ダーク固定、ステージ切替 | 全ページが新トークンで描画、ライト残骸ゼロ |
| 3 | ホーム（Living Wall、カウンター、にじみ）、カテゴリ目次、⌘K プレビュー、View Transitions、404 | §4 の各画面が仕様どおり |
| 4 | X-ray モード | 12 箇所以上にラベル |
| 5 | デモ規約準拠（§5.2）の総点検、19 件の固有化/明示、B7・B8 | 全デモがチェックリスト合格 |
| 6 | メタ・OG・sitemap・robots・JSON-LD・favicon・`_headers`・security.txt | Lighthouse SEO 100 |
| 7 | CI・Playwright・LHCI・Dependabot | CI 緑、予算内 |
| 8 | 品質ループ（quality-loop.md）を合格まで回す | 合格条件到達 |
| 9 | Cloudflare Pages 作成、`features.c12o.net` 接続、ポートフォリオ側の項目追加 | 本番 URL で全ゲート合格 |

Phase 0 と 1 は他に先行する。2〜4 は並行可。8 は 2〜7 の後。

## 9. 書かないこと・やらないこと

- 英語版。`lang="ja"` のまま。
- 認証・コメント・いいね等のサーバー機能。静的のみ。
- 外部サービスの埋め込み（地図タイル、動画、決済）。モックで表現する方針は維持。
- 「代表例」の未検証表示（D7）。
- 実務経歴や案件の話。ポートフォリオの「盛らない線」をここでも守る。

## 10. 用語

- **ステージ**: デモを載せる無彩色の枠。
- **Living Wall**: ホームのヒーロー右に置く、自律して動く小デモのタイル群。
- **X-ray モード**: サイトの UI に、使っているパターンのラベルを重ねる表示モード。
- **固有デモ**: `aliasOf` を持たないデモ。

## 11. 要確認（本人の判断待ち。決まるまで括弧内の仮で進める）

確定済み（2026-10-09）: ドメインは `features.c12o.net`（D10）、リポジトリは公開（D15）。

| # | 項目 | 仮 |
|---|---|---|
| Q3 | Cloudflare Web Analytics を入れるか | 入れない |
| Q4 | 代表例の検証を誰がやるか | 別タスク。公開は待たない |
