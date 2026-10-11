# Feature Catalog

モダン Web の UI パターン（ユーザーから見える機能）を、動くデモ付きで索引化したカタログです。
草チャート、コマンドパレット、AI ストリーミング表示、楽観的 UI など、25 カテゴリ・341 パターンを収録しています。

**https://feature-catalog.c12o.net**

## 何のためのサイトか

個人開発で「あの機能、何て呼ぶんだっけ」を引くための UI パターンの索引です。
コンポーネントライブラリではなく、何を作るかの選択肢を見渡すためのカタログとして作っています。

- **カテゴリで探す**: UI の形で 25 分類。
- **目的で探す**: 「フォームの離脱を減らしたい」のような問題文から逆引き。
- **⌘K**: パターン名・カテゴリ・目的を横断検索。

地図・決済・動画など外部サービスが必要なパターンは、通信しない UI モックで表現しています。

## スタック

- Next.js 16（App Router、静的書き出し）
- React 19 / TypeScript
- Tailwind CSS v4 / shadcn/ui（base-ui）
- recharts / motion / cmdk / sonner / react-hook-form / zod
- Cloudflare Pages

## 開発

```sh
pnpm install
pnpm run dev        # http://localhost:3000
pnpm run build      # out/ に静的書き出し
pnpm run lint
pnpm run typecheck
```

## 構成

```
src/
├── app/                 ルーティング（/, /categories, /c/[slug], /goals, /g/[slug]）
├── components/
│   ├── demos/           ライブデモ（1 パターン 1 ファイル）と registry.tsx
│   └── ui/              shadcn/ui
└── data/
    ├── categories.ts    カテゴリとパターン
    └── goals.ts         目的からの逆引き
docs/design/             設計書
```

## デモを追加する

1. `src/components/demos/your-demo.tsx` を作る（`"use client"`、default export、props なし）。
2. `src/components/demos/registry.tsx` に登録する。
3. `src/data/categories.ts` の該当パターンに `demo` を指定する。

## ライセンス

MIT © 2026 Seu (c12o)
