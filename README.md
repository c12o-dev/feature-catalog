# Feature Catalog

モダン Web の「ユーザーから見える機能」を**動くデモ付き**でカタログ化した個人参照サイト。
草チャート・スキルマップ・コマンドパレット・AI ストリーミング表示など、25 カテゴリ・**230 パターン全てが動くデモ**として実装済。

## スタック (2026-04 時点)

- Next.js 16.2 (App Router, Turbopack, RSC)
- React 19.2
- TypeScript 5.9
- Tailwind CSS v4 (CSS-first config)
- shadcn/ui v4.5 (base-nova preset, base-ui based)
- recharts / motion / cmdk / sonner / react-hook-form / zod / next-themes / canvas-confetti / lucide-react

## 構成

```
src/
├── app/
│   ├── page.tsx              # ホーム
│   ├── categories/page.tsx   # カテゴリ一覧
│   ├── goals/page.tsx        # 目的別一覧
│   ├── c/[slug]/page.tsx     # カテゴリ詳細 (25 ページ静的生成)
│   └── g/[slug]/page.tsx     # 目的詳細 (9 ページ静的生成)
├── components/
│   ├── site-header.tsx       # ヘッダー + ⌘K + テーマ切替
│   ├── global-command.tsx    # 全パターン横断検索 (cmdk)
│   ├── pattern-card.tsx      # パターン表示 + デモ埋め込み
│   ├── theme-provider.tsx    # next-themes
│   ├── theme-toggle.tsx      # ダーク / ライト切替
│   ├── demos/
│   │   ├── registry.tsx      # demo 名 → component の dynamic import map
│   │   └── *.tsx             # 36 個のライブデモ実装
│   └── ui/                   # shadcn/ui コンポーネント
└── data/
    ├── categories.ts         # 25 カテゴリ・230+ パターン
    └── goals.ts              # 9 テーマ・25 目的（v2 逆引き）
```

## 起動

```sh
npm install
npm run dev   # http://localhost:3000
npm run build # 静的生成 (40 ページ)
```

## 機能

- **カテゴリ別ブラウズ** (/c/[slug]): UI form factor で 25 分類
- **目的別ブラウズ** (/g/[slug]): 「フォーム離脱を減らしたい」等、問題ステートメントから逆引き
- **⌘K グローバル検索**: パターン名・カテゴリ・目的を横断検索
- **ライブデモ**: 230 パターン全てが動くデモ付き（草チャート・スキルマップ・コマンドパレット・AI ストリーミング・トースト・confetti・各種チャート・カレンダー・kanban・rich text editor・地図・動画 player 等）。Mapbox/Stripe/動画等の外部サービス必須パターンは UI mock で表現。
- **ダーク / ライト切替**: system 追従可
- **静的生成**: 40 ページ全て pre-render

## デモ実装一覧

230 パターン全てに demo が紐付いており、`/c/[slug]` ページで対応する PatternCard 内に動くデモが描画されます。
各カテゴリのデモ数は categories.ts の `patterns[].demo` を参照。実装ファイルは `src/components/demos/` 配下。

## データソース

- `src/data/categories.ts` ← `/home/sei/idea/web-components-catalog/ideas/2026-04-26-feature-patterns-catalog.md`
- `src/data/goals.ts` ← `/home/sei/idea/web-components-catalog/ideas/2026-04-26-feature-index-v2.md` §3

`代表例` カラムの値は記憶ベース ([unverified 2026-04-26])。引用前に裏取り推奨。

## 新しいデモを追加する

1. `src/components/demos/your-demo.tsx` を作成（`"use client"` 必須）
2. `src/components/demos/registry.tsx` に `YourDemo: d(() => import("./your-demo"))` を追加
3. `src/data/categories.ts` の該当パターンに `demo: "YourDemo"` を追加

## デプロイ

Cloudflare Pages（静的書き出し）等で配信可。`next build` 後の静的アセットを使う。
