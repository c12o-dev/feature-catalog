// 25 goals across 9 themes — problem-driven reverse lookup. Source: web-components-catalog/ideas/2026-04-26-feature-index-v2.md §3
// Each goal lists patterns by category §N from categories.ts

export type Goal = {
  title: string;
  patterns: string[]; // pattern names referencing categories.ts
  categoryRefs: string[]; // category ids
  external?: string;
};

export type Theme = {
  id: string;
  slug: string;
  name: string;
  goals: Goal[];
};

export const themes: Theme[] = [
  {
    id: "3.1",
    slug: "experience",
    name: "体験設計",
    goals: [
      {
        title: "初回起動の体験を整えたい",
        patterns: ["ウェルカムモーダル", "プロダクトツアー", "チェックリスト / クエスト", "空状態（イラスト付）", "サンプルデータ / デモモード", "アカウント完成度ゲージ"],
        categoryRefs: ["2"],
        external: "useronboard.com",
      },
      {
        title: "ロード待ちを快適にしたい",
        patterns: ["Skeleton loader", "Optimistic UI", "Prefetch on hover", "Suspense fallback", "Shimmer", "FLIP animation"],
        categoryRefs: ["15", "16"],
        external: "web.dev/perf",
      },
      {
        title: "ブランド体験を作りたい",
        patterns: ["Scroll-driven animation", "View Transitions API", "Hover micro-interaction", "Confetti", "Sticky header / shrink on scroll"],
        categoryRefs: ["16"],
        external: "awwwards.com",
      },
      {
        title: "AI を組み込みたい",
        patterns: ["AI サイドバー / コパイロット panel", "インライン AI suggestion", "\"Ask anything\" 検索", "要約ボタン", "ストリーミング表示", "Citation / 出典リンク"],
        categoryRefs: ["3"],
      },
    ],
  },
  {
    id: "3.2",
    slug: "input",
    name: "入力・フォーム",
    goals: [
      {
        title: "フォームの離脱を減らしたい",
        patterns: ["Inline validation", "Autosave (status 表示)", "マルチステップ wizard", "Form 復元 (戻ってきたら入力残ってる)", "Optimistic submit", "Skeleton loader"],
        categoryRefs: ["9", "15"],
        external: "baymard.com",
      },
      {
        title: "入力速度を上げたい",
        patterns: ["Autocomplete (タグ/型)", "Mention picker", "Emoji picker", "タグ入力 (chip 入力)", "リッチテキストエディタ (block)"],
        categoryRefs: ["9"],
      },
      {
        title: "大量データを編集させたい",
        patterns: ["テーブル (sortable/filter/group)", "ピボットテーブル", "Tree view", "ドラッグ&ドロップ upload"],
        categoryRefs: ["10", "9"],
      },
    ],
  },
  {
    id: "3.3",
    slug: "nav-search",
    name: "ナビ・検索",
    goals: [
      {
        title: "検索を高速にしたい",
        patterns: ["Command palette (Cmd+K)", "インスタント検索 / typeahead", "ファセット検索", "検索履歴 / 保存検索"],
        categoryRefs: ["5"],
        external: "algolia.com",
      },
      {
        title: "ナビ階層を整理したい",
        patterns: ["breadcrumb", "サイドバー nav", "tab bar", "anchor TOC (sticky)", "jump-to-section チップ"],
        categoryRefs: ["5"],
      },
      {
        title: "モバイルで使いやすくしたい",
        patterns: ["bottom nav", "Bottom sheet", "Pull to refresh", "Swipe action (リスト)", "Floating action button (FAB)", "Long press menu"],
        categoryRefs: ["5", "17"],
        external: "mobbin.com",
      },
    ],
  },
  {
    id: "3.4",
    slug: "auth-security",
    name: "認証・セキュリティ",
    goals: [
      {
        title: "ログイン障壁を下げたい",
        patterns: ["Passkey / WebAuthn", "ソーシャルログイン", "Magic link", "Sign in with Google one-tap"],
        categoryRefs: ["4"],
        external: "webauthn.guide",
      },
      {
        title: "アカウント安全性を伝えたい",
        patterns: ["アクティブセッション一覧 / sign out all", "ログイン履歴 / 不審アクセス通知", "二段階認証 setup wizard", "Trusted device 一覧"],
        categoryRefs: ["22"],
      },
      {
        title: "プライバシー透明性を出したい",
        patterns: ["Cookie 同意バナー (GDPR)", "データ export (GDPR/個情法)", "アカウント削除フロー (確認多段)", "公開範囲設定 (public/friends/private)"],
        categoryRefs: ["22"],
        external: "gdpr.eu",
      },
    ],
  },
  {
    id: "3.5",
    slug: "content-media",
    name: "コンテンツ・メディア",
    goals: [
      {
        title: "大量コンテンツを見せたい",
        patterns: ["無限スクロール", "Virtual list (windowing)", "Masonry グリッド", "ストーリーバー"],
        categoryRefs: ["8"],
      },
      {
        title: "メディアを見せたい",
        patterns: ["動画プレイヤー (custom controls)", "Picture-in-Picture", "チャプターマーカー", "Waveform 表示", "トランスクリプト追従 (karaoke 風)"],
        categoryRefs: ["20"],
        external: "mux.com",
      },
      {
        title: "地図・位置情報を扱いたい",
        patterns: ["マップ + マーカー (Mapbox/MapLibre)", "マーカークラスタリング", "ルート表示 (polyline)", "描画ツール (polygon/circle)", "isochrone (到達圏)"],
        categoryRefs: ["19"],
        external: "mapbox docs",
      },
    ],
  },
  {
    id: "3.6",
    slug: "social",
    name: "ソーシャル・コミュニティ",
    goals: [
      {
        title: "コラボさせたい",
        patterns: ["リアルタイムカーソル", "Presence avatar 集", "インラインコメント", "Mention (@user)", "スレッド discussion", "バージョン履歴 / restore"],
        categoryRefs: ["6"],
      },
      {
        title: "通知設計したい",
        patterns: ["In-app notification center", "バッジカウンタ", "トースト / snackbar", "バナー alert", "Push 通知 (Web Push)", "メール digest", "通知設定 matrix"],
        categoryRefs: ["7"],
      },
      {
        title: "SNS 共有・拡散を促したい",
        patterns: ["フォロー / アンフォロー", "シェア / リポスト", "引用 (quote)", "OGP リッチプレビュー", "Embed iframe (X/YT)", "ハッシュタグ"],
        categoryRefs: ["21"],
      },
    ],
  },
  {
    id: "3.7",
    slug: "trust-monetize",
    name: "信頼・収益化",
    goals: [
      {
        title: "信頼を伝えたい (LP)",
        patterns: ["Testimonial カード", "ロゴウォール", "数字 hero (\"10,000+ users\")", "レビュースコア (★)", "ステータスページ"],
        categoryRefs: ["11"],
      },
      {
        title: "リピート率を上げたい",
        patterns: ["Streak (連続)", "達成 / アチーブメント", "レベル / XP", "リーダーボード", "Daily quest", "Recommendation"],
        categoryRefs: ["12", "13"],
        external: "yu-kai chou octalysis",
      },
      {
        title: "パーソナライズしたい",
        patterns: ["ダーク / ライト切替 (system 追従可)", "レイアウト密度 (comfortable/compact)", "Bookmark / お気に入り", "Recently viewed", "Saved view / smart filter"],
        categoryRefs: ["13"],
      },
      {
        title: "課金フローを設計したい",
        patterns: ["Pricing table (toggle 月/年)", "Checkout (Stripe Elements 等)", "サブスク管理 (upgrade/cancel)", "Usage meter", "クーポン / promo code", "トライアル counter"],
        categoryRefs: ["14"],
        external: "stripe pricing",
      },
    ],
  },
  {
    id: "3.8",
    slug: "support-dev",
    name: "サポート・開発者",
    goals: [
      {
        title: "ヘルプ導線を作りたい",
        patterns: ["ヘルプ widget (右下バブル)", "FAQ アコーディオン", "検索可能ナレッジベース", "Live chat", "Contextual help (?)"],
        categoryRefs: ["23"],
      },
      {
        title: "開発者向け公開機能を作りたい",
        patterns: ["API key 管理 (生成/失効)", "Webhook 設定 + テスト送信", "API playground / cURL builder", "Embed code generator", "Rate limit indicator"],
        categoryRefs: ["24"],
      },
      {
        title: "システム状態を伝えたい",
        patterns: ["環境バッジ (staging/dev)", "バージョン表示 (footer)", "接続状態 indicator", "同期 indicator", "最終更新時刻 (relative)"],
        categoryRefs: ["25"],
      },
    ],
  },
  {
    id: "3.9",
    slug: "cross-cutting",
    name: "横串（複数カテゴリにまたがる）",
    goals: [
      {
        title: "アクセシビリティを担保したい",
        patterns: ["Skip to content link", "Visible focus ring", "ARIA live region", "prefers-reduced-motion 尊重", "色覚多様性配慮 (パターン併用)", "キーボードショートカット一覧 (?)"],
        categoryRefs: ["18"],
        external: "webaim.org",
      },
      {
        title: "データを直感的に見せたい",
        patterns: ["スパークライン", "草チャート / contribution heatmap", "プログレスリング", "ゲージ / ダイヤル", "状態 badge", "カウンターアニメ"],
        categoryRefs: ["1"],
        external: "observablehq.com",
      },
    ],
  },
];
