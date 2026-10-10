# デモ規約チェックリスト（G12）

> `pnpm run checklist`（`scripts/demo-checklist.mjs`）が生成。手で編集しない。生成日: 2026-10-10。対象 333 件（`src/components/demos/*.tsx`、`registry.tsx` と `_*` を除く）。
> 規約は `docs/design/v2-launch.md` §5.2。静的ヒューリスティックによる判定で、✓ は「違反を検出しなかった」の意味。

## 凡例

| 記号 | 意味 |
|---|---|
| ✓ | 静的検査で規約を満たす（または該当する違反を検出しなかった） |
| ✗ | 違反を検出（末尾の一覧に理由） |
| – | 該当なし、または静的に判定できない |

| # | 項目 | 検査内容 |
|---|---|---|
| 1 | "use client" / default export / props なし | 先頭に "use client"、`export default function X()`（引数なし） |
| 2 | 初期状態が決定的 | Math.random / Date.now / new Date() がモジュール直下・コンポーネント本体・useState 等の初期値にない（effect・ハンドラ内は可） |
| 3 | 1 クリックで動く / 自律動作は 10 秒以内に停止 | 静的検査不可（G9 の Playwright で確認） |
| 4 | タイマー・購読・イベントの cleanup | setInterval / setTimeout / addEventListener / Observer / rAF に対応する解除があるか（Promise 解決用 setTimeout、フォーカス移動のみの rAF は除外）。useEffect 内の同期 setState は lint（react-hooks/set-state-in-effect）で担保 |
| 5 | prefers-reduced-motion | motion/react なら useReducedMotion、rAF ループ・WAAPI・confetti なら useReducedMotion か prefers-reduced-motion。CSS のみの動きは motion-safe: か globals.css の D13 グローバル規則で停止 |
| 6 | 固定幅なし | `w-[≥320px]`・`min-w-[≥320px]`（overflow-x-auto 内は可）・inline width ≥ 320・svg/canvas の width 属性 ≥ 320（overflow-hidden 内は可） |
| 7 | 外部ネットワーク・外部フォント・外部画像なし | fetch / 外部 src・href / new Image / url(http / @import / @font-face / WebSocket 等（テンプレート文字列内の表示用コードは除外） |
| 8 | ライト／ダーク両ステージで読める | `dark:` は data-stage に追従する。light 固定の面（bg-white 等）で文字色が未指定、または濃色文字（text-black 等）で背景未指定の className を検出（装飾要素は除外） |
| 9 | recharts の ResponsiveContainer | `initialDimension` があるか、直前の親に h-* / style height がある |

## 一覧

| デモ | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| `account-delete` | ✓ | ✓ | – | – | ✓ | ✓ | ✓ | ✓ | – |
| `account-switcher` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `achievement` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `active-sessions` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `activity-feed` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `address-autocomplete` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `ai-compose` | ✓ | ✓ | – | ✓ | ✓ | ✓ | ✓ | ✓ | – |
| `ai-image` | ✓ | ✓ | – | ✓ | ✓ | ✓ | ✓ | ✓ | – |
| `ai-sidebar` | ✓ | ✓ | – | ✓ | – | ✓ | ✓ | ✓ | – |
| `ambient-orb` | ✓ | ✓ | – | – | ✓ | ✓ | ✓ | ✓ | – |
| `anchor-toc` | ✓ | ✓ | – | ✓ | ✓ | ✓ | ✓ | ✓ | – |
| `api-docs` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `api-key-manager` | ✓ | ✓ | – | ✓ | – | ✓ | ✓ | ✓ | – |
| `api-playground` | ✓ | ✓ | – | ✓ | ✓ | ✓ | ✓ | ✓ | – |
| `app-permissions` | ✓ | ✓ | – | ✓ | – | ✓ | ✓ | ✓ | – |
| `approval-flow` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `area-chart` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | ✓ |
| `aria-live` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `ask-anything` | ✓ | ✓ | – | ✓ | ✓ | ✓ | ✓ | ✓ | – |
| `audio-player` | ✓ | ✓ | – | ✓ | ✓ | ✓ | ✓ | ✓ | – |
| `audit-log` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `auto-caption` | ✓ | ✓ | – | ✓ | ✓ | ✓ | ✓ | ✓ | – |
| `auto-tag` | ✓ | ✓ | – | ✓ | ✓ | ✓ | ✓ | ✓ | – |
| `autocomplete` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `autosave` | ✓ | ✓ | – | ✓ | ✓ | ✓ | ✓ | ✓ | – |
| `award-badge` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `backup-codes` | ✓ | ✓ | – | ✓ | ✓ | ✓ | ✓ | ✓ | – |
| `badge-counter` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `banner-alert` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `block-mute` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `bookmark-button` | ✓ | ✓ | – | – | ✓ | ✓ | ✓ | ✓ | – |
| `bottom-nav` | ✓ | ✓ | – | – | ✓ | ✓ | ✓ | ✓ | – |
| `bottom-sheet` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `box-plot` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `breadcrumb` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `build-info-modal` | ✓ | ✓ | – | ✓ | ✓ | ✓ | ✓ | ✓ | – |
| `bullet-chart` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `bump-chart` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | ✓ |
| `calendar-heatmap` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `calendar-view` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `candlestick` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `card-feed` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `carousel` | ✓ | ✓ | – | – | ✓ | ✓ | ✓ | ✓ | – |
| `cart` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `case-study` | ✓ | ✓ | – | – | ✓ | ✓ | ✓ | ✓ | – |
| `changelog-popover` | ✓ | ✓ | – | ✓ | – | ✓ | ✓ | ✓ | – |
| `chapter-markers` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `chat-history` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `chat-overlay` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `checkout` | ✓ | ✓ | – | ✓ | ✓ | ✓ | ✓ | ✓ | – |
| `chord-diagram` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `citation` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `coachmark` | ✓ | ✓ | – | ✓ | – | ✓ | ✓ | ✓ | – |
| `code-editor` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `color-picker` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `colorblind-pattern` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `command-palette-demo` | ✓ | ✓ | – | – | ✓ | ✓ | ✓ | ✓ | – |
| `compare-slider` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `completion-meter` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `confetti-demo` | ✓ | ✓ | – | – | ✓ | ✓ | ✓ | ✓ | – |
| `connection-status` | ✓ | ✓ | – | ✓ | ✓ | ✓ | ✓ | ✓ | – |
| `contextual-help` | ✓ | ✓ | – | ✓ | – | ✓ | ✓ | ✓ | – |
| `contour` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `contribution-heatmap` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `cookie-banner` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `counter-tick` | ✓ | ✓ | – | ✓ | ✓ | ✓ | ✓ | ✓ | – |
| `coupon-input` | ✓ | ✓ | – | ✓ | ✓ | ✓ | ✓ | ✓ | – |
| `cursor-follower` | ✓ | ✓ | – | ✓ | ✓ | ✓ | ✓ | ✓ | – |
| `daily-quest` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `dashboard-grid` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `data-export` | ✓ | ✓ | – | ✓ | ✓ | ✓ | ✓ | ✓ | – |
| `data-table` | ✓ | ✓ | – | – | ✓ | ✓ | ✓ | ✓ | – |
| `date-picker` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `demo-mode` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `dendrogram` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `density-toggle` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `destructive-modal` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `dev-changelog` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `dev-usage` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | ✓ |
| `diff-viewer` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `dm-thread` | ✓ | ✓ | – | ✓ | – | ✓ | ✓ | ✓ | – |
| `drawer` | ✓ | ✓ | – | ✓ | ✓ | ✓ | ✓ | ✓ | – |
| `dropzone-upload` | ✓ | ✓ | – | ✓ | ✓ | ✓ | ✓ | ✓ | – |
| `edit-conflict` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `email-change` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `email-digest` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `embed-code` | ✓ | ✓ | – | ✓ | – | ✓ | ✓ | ✓ | – |
| `embed-iframe` | ✓ | ✓ | – | ✓ | ✓ | ✓ | ✓ | ✓ | – |
| `emoji-picker` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `emoji-reactions` | ✓ | ✓ | – | ✓ | – | ✓ | ✓ | ✓ | – |
| `empty-state` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `env-badge` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `env-switch` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `error-boundary` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `fab` | ✓ | ✓ | – | ✓ | ✓ | ✓ | ✓ | ✓ | – |
| `faceted-search` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `faq-accordion` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `favorites` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `feedback-button` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `filter-chips` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `flip-animation` | ✓ | ✓ | – | – | ✓ | ✓ | ✓ | ✓ | – |
| `focus-mode` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `focus-ring` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `follow-button` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `font-size` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `force-graph` | ✓ | ✓ | – | ✓ | ✓ | ✓ | ✓ | ✓ | – |
| `form-restore` | ✓ | ✓ | – | ✓ | – | ✓ | ✓ | ✓ | – |
| `funnel` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `gacha` | ✓ | ✓ | – | ✓ | ✓ | ✓ | ✓ | ✓ | – |
| `gantt-view` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `gantt` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `gauge` | ✓ | ✓ | – | ✓ | ✓ | ✓ | ✓ | ✓ | – |
| `geolocation` | ✓ | ✓ | – | ✓ | ✓ | ✓ | ✓ | ✓ | – |
| `gesture-nav` | ✓ | ✓ | – | – | ✓ | ✓ | ✓ | ✓ | – |
| `ghost-text` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `global-search` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `google-one-tap` | ✓ | ✓ | – | ✓ | ✓ | ✓ | ✓ | ✓ | – |
| `group-channel` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `guest-invite` | ✓ | ✓ | – | ✓ | – | ✓ | ✓ | ✓ | – |
| `guest-mode` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `haptic-demo` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `hashtag-chip` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `heatmap-matrix` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `help-widget` | ✓ | ✓ | – | ✓ | ✓ | ✓ | ✓ | ✓ | – |
| `hero-numbers` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `high-contrast` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `histogram` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | ✓ |
| `hover-micro` | ✓ | ✓ | – | – | ✓ | ✓ | ✓ | ✓ | – |
| `hover-peek` | ✓ | ✓ | – | ✓ | – | ✓ | ✓ | ✓ | – |
| `image-cropper` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `ime-safe-input` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `indeterminate-bar` | ✓ | ✓ | – | ✓ | – | ✓ | ✓ | ✓ | – |
| `infinite-scroll` | ✓ | ✓ | – | ✓ | ✓ | ✓ | ✓ | ✓ | – |
| `inline-ai` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `inline-comment` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `inline-validation` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `install-prompt` | ✓ | ✓ | – | ✓ | ✓ | ✓ | ✓ | ✓ | – |
| `integrations` | ✓ | ✓ | – | ✓ | ✓ | ✓ | ✓ | ✓ | – |
| `invite-code` | ✓ | ✓ | – | ✓ | ✓ | ✓ | ✓ | ✓ | – |
| `invite-form` | ✓ | ✓ | – | ✓ | – | ✓ | ✓ | ✓ | – |
| `invoice-list` | ✓ | ✓ | – | ✓ | ✓ | ✓ | ✓ | ✓ | – |
| `isochrone` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `json-viewer` | ✓ | ✓ | – | – | ✓ | ✓ | ✓ | ✓ | – |
| `jump-chips` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `kanban-board` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `knowledge-base` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `language-switcher` | ✓ | ✓ | – | ✓ | ✓ | ✓ | ✓ | ✓ | – |
| `lazy-image` | ✓ | ✓ | – | ✓ | ✓ | ✓ | ✓ | ✓ | – |
| `leaderboard` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `lightbox` | ✓ | ✓ | – | ✓ | ✓ | ✓ | ✓ | ✓ | – |
| `like-burst` | ✓ | ✓ | – | ✓ | ✓ | ✓ | ✓ | ✓ | – |
| `like-button` | ✓ | ✓ | – | – | ✓ | ✓ | ✓ | ✓ | – |
| `live-badge` | ✓ | ✓ | – | ✓ | ✓ | ✓ | ✓ | ✓ | – |
| `live-chat` | ✓ | ✓ | – | ✓ | ✓ | ✓ | ✓ | ✓ | – |
| `live-cursor` | ✓ | ✓ | – | ✓ | ✓ | ✓ | ✓ | ✓ | – |
| `lock-claim` | ✓ | ✓ | – | ✓ | ✓ | ✓ | ✓ | ✓ | – |
| `log-viewer` | ✓ | ✓ | – | ✓ | – | ✓ | ✓ | ✓ | – |
| `login-history` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `logo-wall` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `long-press-menu` | ✓ | ✓ | – | ✓ | ✓ | ✓ | ✓ | ✓ | – |
| `magic-link` | ✓ | ✓ | – | ✓ | ✓ | ✓ | ✓ | ✓ | – |
| `maintenance-banner` | ✓ | ✓ | – | ✓ | – | ✓ | ✓ | ✓ | – |
| `map-draw` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `map-heatmap` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `map-markers` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `markdown-editor` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `marker-cluster` | ✓ | ✓ | – | – | ✓ | ✓ | ✓ | ✓ | – |
| `masked-field` | ✓ | ✓ | – | ✓ | – | ✓ | ✓ | ✓ | – |
| `masonry-grid` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `measure-ruler` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `mega-menu` | ✓ | ✓ | – | ✓ | ✓ | ✓ | ✓ | ✓ | – |
| `mention-list` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `mention-picker` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `mindmap` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `modal-demo` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `multi-step-form` | ✓ | ✓ | – | – | ✓ | ✓ | ✓ | ✓ | – |
| `mutual-follow` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `named-review` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `notification-center` | ✓ | ✓ | – | ✓ | ✓ | ✓ | ✓ | ✓ | – |
| `notification-matrix` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `nps-survey` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `oauth-apps` | ✓ | ✓ | – | ✓ | – | ✓ | ✓ | ✓ | – |
| `offline-banner` | ✓ | ✓ | – | ✓ | – | ✓ | ✓ | ✓ | – |
| `ogp-preview` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `onboarding-checklist` | ✓ | ✓ | – | – | ✓ | ✓ | ✓ | ✓ | – |
| `optimistic-submit` | ✓ | ✓ | – | ✓ | ✓ | ✓ | ✓ | ✓ | – |
| `optimistic-ui` | ✓ | ✓ | – | ✓ | ✓ | ✓ | ✓ | ✓ | – |
| `otp-input` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `outline-panel` | ✓ | ✓ | – | – | ✓ | ✓ | ✓ | ✓ | – |
| `pagination` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `parallax` | ✓ | ✓ | – | – | ✓ | ✓ | ✓ | ✓ | – |
| `passkey-button` | ✓ | ✓ | – | ✓ | ✓ | ✓ | ✓ | ✓ | – |
| `password-reset` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `paste-upload` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `picture-in-picture` | ✓ | ✓ | – | ✓ | ✓ | ✓ | ✓ | ✓ | – |
| `pinned-views` | ✓ | ✓ | – | ✓ | – | ✓ | ✓ | ✓ | – |
| `pivot-table` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `playback-speed` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `poll` | ✓ | ✓ | – | – | ✓ | ✓ | ✓ | ✓ | – |
| `prefetch-on-hover` | ✓ | ✓ | – | ✓ | ✓ | ✓ | ✓ | ✓ | – |
| `presence-avatars` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `press-logo` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `price-simulator` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `pricing-table` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `proactive-chip` | ✓ | ✓ | – | ✓ | ✓ | ✓ | ✓ | ✓ | – |
| `product-tour` | ✓ | ✓ | – | ✓ | ✓ | ✓ | ✓ | ✓ | – |
| `profile-card` | ✓ | ✓ | – | ✓ | – | ✓ | ✓ | ✓ | – |
| `progress-bar` | ✓ | ✓ | – | ✓ | ✓ | ✓ | ✓ | ✓ | – |
| `progress-ring` | ✓ | ✓ | – | ✓ | – | ✓ | ✓ | ✓ | – |
| `prompt-library` | ✓ | ✓ | – | ✓ | – | ✓ | ✓ | ✓ | – |
| `pull-to-refresh` | ✓ | ✓ | – | ✓ | ✓ | ✓ | ✓ | ✓ | – |
| `push-permission` | ✓ | ✓ | – | ✓ | – | ✓ | ✓ | ✓ | – |
| `pwa-splash` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `query-builder` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `quote-post` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `range-slider` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `rate-limit` | ✓ | ✓ | – | ✓ | ✓ | ✓ | ✓ | ✓ | – |
| `reaction-picker` | ✓ | ✓ | – | ✓ | ✓ | ✓ | ✓ | ✓ | – |
| `read-aloud-toggle` | ✓ | ✓ | – | ✓ | ✓ | ✓ | ✓ | ✓ | – |
| `read-unread` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `reader-mode` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `recaptcha-mock` | ✓ | ✓ | – | ✓ | ✓ | ✓ | ✓ | ✓ | – |
| `recently-viewed` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `recommendation` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `reduced-motion` | ✓ | ✓ | – | ✓ | ✓ | ✓ | ✓ | ✓ | – |
| `reel-feed` | ✓ | ✓ | – | – | ✓ | ✓ | ✓ | ✓ | – |
| `referral` | ✓ | ✓ | – | ✓ | – | ✓ | ✓ | ✓ | – |
| `relative-time` | ✓ | ✓ | – | ✓ | – | ✓ | ✓ | ✓ | – |
| `renewal-reminder` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `replay-tour` | ✓ | ✓ | – | ✓ | ✓ | ✓ | ✓ | ✓ | – |
| `report-flag` | ✓ | ✓ | – | – | ✓ | ✓ | ✓ | ✓ | – |
| `repost-button` | ✓ | ✓ | – | ✓ | ✓ | ✓ | ✓ | ✓ | – |
| `review-score` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `rich-text-editor` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `role-matrix` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `route-polyline` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `route-share` | ✓ | ✓ | – | ✓ | – | ✓ | ✓ | ✓ | – |
| `safe-area` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `sankey` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `saved-view` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `scroll-driven` | ✓ | ✓ | – | ✓ | – | ✓ | ✓ | ✓ | – |
| `sdk-download` | ✓ | ✓ | – | ✓ | – | ✓ | ✓ | ✓ | – |
| `search-history` | ✓ | ✓ | – | ✓ | – | ✓ | ✓ | ✓ | – |
| `seek-thumbnail` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `segmented-control` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `semantic-search` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `service-status` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `share-link` | ✓ | ✓ | – | ✓ | – | ✓ | ✓ | ✓ | – |
| `shimmer` | ✓ | ✓ | – | – | ✓ | ✓ | ✓ | ✓ | – |
| `shortcuts-help` | ✓ | ✓ | – | ✓ | – | ✓ | ✓ | ✓ | – |
| `side-peek` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `sidebar-nav` | ✓ | ✓ | – | – | ✓ | ✓ | ✓ | ✓ | – |
| `signature-pad` | ✓ | ✓ | – | ✓ | – | ✓ | ✓ | ✓ | – |
| `skeleton-fade` | ✓ | ✓ | – | ✓ | ✓ | ✓ | ✓ | ✓ | – |
| `skeleton-loader` | ✓ | ✓ | – | ✓ | ✓ | ✓ | ✓ | ✓ | – |
| `skill-radar` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | ✓ |
| `skip-link` | ✓ | ✓ | – | – | ✓ | ✓ | ✓ | ✓ | – |
| `sleep-timer` | ✓ | ✓ | – | ✓ | – | ✓ | ✓ | ✓ | – |
| `snap-scroll` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `social-login` | ✓ | ✓ | – | ✓ | ✓ | ✓ | ✓ | ✓ | – |
| `soft-paywall` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `sortable-list` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `sparkline` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | ✓ |
| `spinner` | ✓ | ✓ | – | ✓ | ✓ | ✓ | ✓ | ✓ | – |
| `split-view` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `spring-scroll` | ✓ | ✓ | – | – | ✓ | ✓ | ✓ | ✓ | – |
| `sso-button` | ✓ | ✓ | – | ✓ | ✓ | ✓ | ✓ | ✓ | – |
| `stats-badge` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `status-badge` | ✓ | ✓ | – | ✓ | ✓ | ✓ | ✓ | ✓ | – |
| `status-page-link` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `status-page` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `stepper` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `sticky-shrink` | ✓ | ✓ | – | ✓ | ✓ | ✓ | ✓ | ✓ | – |
| `story-bar` | ✓ | ✓ | – | ✓ | ✓ | ✓ | ✓ | ✓ | – |
| `streak-badge` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `streaming-text` | ✓ | ✓ | – | ✓ | ✓ | ✓ | ✓ | ✓ | – |
| `street-view` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `subscription-manage` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `subtitles` | ✓ | ✓ | – | ✓ | ✓ | ✓ | ✓ | ✓ | – |
| `summarize-button` | ✓ | ✓ | – | ✓ | ✓ | ✓ | ✓ | ✓ | – |
| `support-ticket` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `suspense-fallback` | ✓ | ✓ | – | ✓ | – | ✓ | ✓ | ✓ | – |
| `swipe-action` | ✓ | ✓ | – | ✓ | ✓ | ✓ | ✓ | ✓ | – |
| `swr-indicator` | ✓ | ✓ | – | ✓ | ✓ | ✓ | ✓ | ✓ | – |
| `sync-indicator` | ✓ | ✓ | – | ✓ | ✓ | ✓ | ✓ | ✓ | – |
| `tab-bar` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `tag-input` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `testimonial-card` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `theme-toggle-demo` | ✓ | ✓ | – | ✓ | – | ✓ | ✓ | ✓ | – |
| `thread` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `thumbnail-strip` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `tilt-card` | ✓ | ✓ | – | – | ✓ | ✓ | ✓ | ✓ | – |
| `time-picker` | ✓ | ✓ | – | ✓ | – | ✓ | ✓ | ✓ | – |
| `timed-clipboard` | ✓ | ✓ | – | ✓ | ✓ | ✓ | ✓ | ✓ | – |
| `timeline` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `toast-demo` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `toast-slide` | ✓ | ✓ | – | ✓ | ✓ | ✓ | ✓ | ✓ | – |
| `toggle-switch` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `token-trace` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `topic-follow` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `totp-auth` | ✓ | – | – | ✓ | – | ✓ | ✓ | ✓ | – |
| `transcript-follow` | ✓ | ✓ | – | ✓ | ✓ | ✓ | ✓ | ✓ | – |
| `transparent-pricing` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `tree-view` | ✓ | ✓ | – | – | ✓ | ✓ | ✓ | ✓ | – |
| `treemap` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `trial-counter` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `trusted-device` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `two-factor-wizard` | ✓ | ✓ | – | ✓ | – | ✓ | ✓ | ✓ | – |
| `typeahead-search` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `upsell-hint` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `usage-meter` | ✓ | ✓ | – | – | ✓ | ✓ | ✓ | ✓ | – |
| `venn-diagram` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `verified-check` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `version-footer` | ✓ | ✓ | – | ✓ | ✓ | ✓ | ✓ | ✓ | – |
| `version-history` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `vertical-video` | ✓ | ✓ | – | ✓ | ✓ | ✓ | ✓ | ✓ | – |
| `video-player` | ✓ | ✓ | – | ✓ | ✓ | ✓ | ✓ | ✓ | – |
| `video-tutorial` | ✓ | ✓ | – | – | ✓ | ✓ | ✓ | ✓ | – |
| `view-transition` | ✓ | ✓ | – | ✓ | – | ✓ | ✓ | ✓ | – |
| `virtual-list` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `visibility-scope` | ✓ | ✓ | – | ✓ | ✓ | ✓ | ✓ | ✓ | – |
| `voice-mode` | ✓ | ✓ | – | ✓ | ✓ | ✓ | ✓ | ✓ | – |
| `wallet` | ✓ | ✓ | – | – | ✓ | ✓ | ✓ | ✓ | – |
| `waveform` | ✓ | ✓ | – | ✓ | ✓ | ✓ | ✓ | ✓ | – |
| `webhook-config` | ✓ | ✓ | – | ✓ | ✓ | ✓ | ✓ | ✓ | – |
| `webhook-logs` | ✓ | ✓ | – | ✓ | ✓ | ✓ | ✓ | ✓ | – |
| `welcome-modal` | ✓ | ✓ | – | – | ✓ | ✓ | ✓ | ✓ | – |
| `whats-new` | ✓ | ✓ | – | – | ✓ | ✓ | ✓ | ✓ | – |
| `wheel-picker` | ✓ | ✓ | – | – | ✓ | ✓ | ✓ | ✓ | – |
| `wizard-steps` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `word-cloud` | ✓ | ✓ | – | – | – | ✓ | ✓ | ✓ | – |
| `xp-bar` | ✓ | ✓ | – | ✓ | ✓ | ✓ | ✓ | ✓ | – |
| `zoom-pan` | ✓ | ✓ | – | ✓ | ✓ | ✓ | ✓ | ✓ | – |

## 集計

| # | ✓ | ✗ | – |
|---|--:|--:|--:|
| 1 | 333 | 0 | 0 |
| 2 | 332 | 0 | 1 |
| 3 | 0 | 0 | 333 |
| 4 | 127 | 0 | 206 |
| 5 | 121 | 0 | 212 |
| 6 | 333 | 0 | 0 |
| 7 | 333 | 0 | 0 |
| 8 | 333 | 0 | 0 |
| 9 | 6 | 0 | 327 |

- ✗ 合計: 0 件（0 デモ）
- 項目 5 で `motion-safe:` を書かず globals.css の D13 グローバル規則（`prefers-reduced-motion: reduce` で全要素の animation/transition を停止）に依存している CSS-only デモ: 43 件

## ✗ の一覧

なし。

## – の補足（項目 2: 乱数・現在時刻をネスト関数内で使用、呼び出し元は未確認）

| デモ | # | 補足 |
|---|:-:|---|
| `totp-auth` | 2 | L14 Date.now() が getSnapshot() 内（呼び出し元は未確認） |
