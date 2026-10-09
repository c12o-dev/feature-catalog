// 9 themes / 28 goals — problem-driven reverse lookup. `patterns` are slugs from ./categories.ts.

export type Goal = {
  title: string;
  patterns: string[];
  categoryRefs: string[];
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
        patterns: ["welcome-modal", "product-tour", "onboarding-checklist", "empty-state", "demo-mode", "completion-meter"],
        categoryRefs: ["2"],
        external: "useronboard.com",
      },
      {
        title: "ロード待ちを快適にしたい",
        patterns: ["skeleton-loader", "optimistic-ui", "prefetch-on-hover", "suspense-fallback", "shimmer", "flip-animation"],
        categoryRefs: ["15", "16"],
        external: "web.dev/perf",
      },
      {
        title: "ブランド体験を作りたい",
        patterns: ["scroll-driven", "view-transition", "hover-micro", "confetti", "sticky-shrink"],
        categoryRefs: ["16"],
        external: "awwwards.com",
      },
      {
        title: "AI を組み込みたい",
        patterns: ["ai-sidebar", "inline-ai", "ask-anything", "summarize-button", "streaming-text", "citation"],
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
        patterns: ["inline-validation", "autosave", "multi-step-form", "form-restore", "optimistic-submit", "skeleton-loader"],
        categoryRefs: ["9", "15"],
        external: "baymard.com",
      },
      {
        title: "入力速度を上げたい",
        patterns: ["autocomplete", "mention-picker", "emoji-picker", "tag-input", "rich-text-editor"],
        categoryRefs: ["9"],
      },
      {
        title: "大量データを編集させたい",
        patterns: ["data-table", "pivot-table", "tree-view", "dropzone-upload"],
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
        patterns: ["command-palette", "typeahead-search", "faceted-search", "search-history"],
        categoryRefs: ["5"],
        external: "algolia.com",
      },
      {
        title: "ナビ階層を整理したい",
        patterns: ["breadcrumb", "sidebar-nav", "tab-bar", "anchor-toc", "jump-chips"],
        categoryRefs: ["5"],
      },
      {
        title: "モバイルで使いやすくしたい",
        patterns: ["bottom-nav", "bottom-sheet-mobile", "pull-to-refresh", "swipe-action", "fab", "long-press-menu"],
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
        patterns: ["passkey-button", "social-login", "magic-link", "google-one-tap"],
        categoryRefs: ["4"],
        external: "webauthn.guide",
      },
      {
        title: "アカウント安全性を伝えたい",
        patterns: ["active-sessions", "login-history", "two-factor-wizard", "trusted-device"],
        categoryRefs: ["22"],
      },
      {
        title: "プライバシー透明性を出したい",
        patterns: ["cookie-banner", "data-export", "account-delete", "visibility-scope"],
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
        patterns: ["infinite-scroll", "virtual-list", "masonry-grid", "story-bar"],
        categoryRefs: ["8"],
      },
      {
        title: "メディアを見せたい",
        patterns: ["video-player", "picture-in-picture", "chapter-markers", "waveform", "transcript-follow"],
        categoryRefs: ["20"],
        external: "mux.com",
      },
      {
        title: "地図・位置情報を扱いたい",
        patterns: ["map-markers", "marker-cluster", "route-polyline", "map-draw", "isochrone"],
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
        patterns: ["live-cursor", "presence-avatars", "inline-comment", "mention-list", "thread", "version-history"],
        categoryRefs: ["6"],
      },
      {
        title: "通知設計したい",
        patterns: ["notification-center", "badge-counter", "toast", "banner-alert", "push-permission", "email-digest", "notification-matrix"],
        categoryRefs: ["7"],
      },
      {
        title: "SNS 共有・拡散を促したい",
        patterns: ["follow-button", "repost-button", "quote-post", "ogp-preview", "embed-iframe", "hashtag-chip"],
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
        patterns: ["testimonial-card", "logo-wall", "hero-numbers", "review-score", "status-page"],
        categoryRefs: ["11"],
      },
      {
        title: "リピート率を上げたい",
        patterns: ["streak-badge", "achievement", "xp-bar", "leaderboard", "daily-quest", "recommendation"],
        categoryRefs: ["12", "13"],
        external: "yu-kai chou octalysis",
      },
      {
        title: "パーソナライズしたい",
        patterns: ["theme-toggle", "density-toggle", "favorites", "recently-viewed", "saved-view"],
        categoryRefs: ["13"],
      },
      {
        title: "課金フローを設計したい",
        patterns: ["pricing-table", "checkout", "subscription-manage", "usage-meter", "coupon-input", "trial-counter"],
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
        patterns: ["help-widget", "faq-accordion", "knowledge-base", "live-chat", "contextual-help"],
        categoryRefs: ["23"],
      },
      {
        title: "開発者向け公開機能を作りたい",
        patterns: ["api-key-manager", "webhook-config", "api-playground", "embed-code", "rate-limit"],
        categoryRefs: ["24"],
      },
      {
        title: "システム状態を伝えたい",
        patterns: ["env-badge", "version-footer", "connection-status", "sync-indicator", "relative-time"],
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
        patterns: ["skip-link", "focus-ring", "aria-live", "reduced-motion", "colorblind-pattern", "shortcuts-help"],
        categoryRefs: ["18"],
        external: "webaim.org",
      },
      {
        title: "データを直感的に見せたい",
        patterns: ["sparkline", "contribution-heatmap", "progress-ring", "gauge", "status-badge", "counter-tick"],
        categoryRefs: ["1"],
        external: "observablehq.com",
      },
    ],
  },
];
