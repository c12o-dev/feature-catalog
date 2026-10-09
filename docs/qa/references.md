# 参照サイト調査（Awwwards Sites of the Day）

Awwwards「Sites of the Day」から、暗色・タイポ主導・エディトリアル・インデックス型に近い最近の受賞サイトを選び、実ブラウザ（Playwright / Chromium、ヘッドレス）で計測した。数値は `getComputedStyle` / `getBoundingClientRect` / `document.getAnimations()` の実測値。目視やサンプリング間隔からの見積もりには（推定）を付けた。調査日: 2026-10-10。

計測上の注意:
- ブラウザはソフトウェア描画のため、WebGL を多用するサイトではプリローダー時間・遷移時間が実機より長めに出る可能性がある。
- ホバーの値は、`a` / `button` とその子孫に設定された CSS transition の computed 値を集計したもの。JS（GSAP など）で動かすホバーは拾えない。
- 「ヒーロー見出し」は、初期ビューポート内で最大の font-size を持つテキスト要素とした。

---

## 1. Gil Huybrecht

- URL: https://gilhuybrecht.com/
- SOTD: 2026-09-21（Awwwards の掲載ページに記載の日付）
- 性格: 黒背景のポートフォリオ。トップはプロジェクトのサムネイルを 8 列に並べたインデックスで、テキスト主体。Nuxt + Lenis。

**ヒーロー見出し**
- トップに大見出しはない。最上段のメタ情報（名前 / Services / Recognition）が最大で、**16.32px @1440**、11.61px @1024、**17px @390**。
- 1440 と 1024 の両方で 1.133vw になるので、デスクトップは vw 比例。ルート font-size も 9.6px @1440（= 0.667vw）、10px @390 で、rem ごと vw でスケールさせ、モバイルだけ固定値に切り替えている。
- 余白: ヘッダー下端 164px から最初のグリッド行（y≈450）まで約 285px の黒い空白。比は「空白 ÷ 本文サイズ ≈ 17」で、大見出しを置かず余白で間を取る構成。
- 下層の /profile には大きな本文型見出しがある: **67.2px @1440**（7rem、4.67vw）／**32px @390**。line-height 0.9、letter-spacing −0.02em、weight 500。ヘッダー下端から見出しまでは 38px（≈ 0.57 × 文字サイズ）。

**ホバー**
- `color, background-color, border-color, …` に **300ms / cubic-bezier(0.23, 1, 0.32, 1)**（easeOutQuint）。
- 遷移時に出るオーバーレイの `::before` は backdrop-filter と background-color を 300ms / cubic-bezier(0.19, 1, 0.22, 1)（easeOutExpo）で変化させる。

**ページ遷移**（/ → /profile）
- 全画面の黒い幕（`fixed inset-0 bg-black`）を使うフェード。不透明度は 0 → 1 に約 170〜300ms、短く保持したあと 1 → 0 に約 250ms。幕の表示は合計 **約 600〜700ms（推定）**。View Transitions API は使っていない。

**モバイル（390px）**
- 8 列グリッドが 2 列になる。ヘッダーの Services / Recognition / Available… は消え、「Gil Huybrecht / Profile, Email me」の 1 行だけが残る。
- 文字サイズはデスクトップの vw 比例をやめ、17px 固定に切り替わる。横スクロールは発生しない。

**ローディング**
- 黒い全画面プリローダーに、中央の小さな % カウンター（例: 「10%」）を出す。消えるまでの時間はデスクトップで 8.5〜10.9 秒、390px で 1.3 秒（2 回目の読み込みでキャッシュが効いた可能性あり）。ソフトウェア描画の影響が大きいので（推定）扱い。

---

## 2. Aspen Search

- URL: https://www.aspensearch.com/
- SOTD: 2026-09-15（Awwwards の掲載ページに記載の日付）
- 性格: 白地。罫線のグリッドタイルに巨大なサンセリフ（Suisse Intl）を置く。ヘッダーにテーマ切替（ライト/ダーク）あり。Next.js + Lenis。CSS に view-transition の記述がある。

**ヒーロー見出し**
- 「Aspen」: **180.67px @1440**（12.55vw）、130.41px @1024（12.74vw）、**53.81px @390**（13.8vw）。line-height 1.0（モバイルは 0.8）、letter-spacing −4%、weight 450。
- 390px では、その下の「PLACING WINNERS.」が 79.32px（20.3vw）で、ファーストビュー下部の主役になる。
- 余白 @1440: ヒーローのタイル（y=60〜481、高さ 421px）の中で、見出し（y=280〜461）の上に **220px（≈ 1.22 × 文字サイズ）**、下に 20px。見出しをタイル左下に寄せて沈め、上側に余白を溜める配置。

**ホバー**
- 主力は **800ms / cubic-bezier(0.16, 1, 0.3, 1)**（easeOutExpo）で、`transform, color` を動かす要素が 23 個。
- 色系の transition は 600ms（同じイージング）。clip-path は 800ms / cubic-bezier(0.87, 0, 0.13, 1)（easeInOutExpo）。小さな transform は 200ms。
- 立ち上がりは速く、長く減速する easeOutExpo で、長めの尺を統一している。

**ページ遷移**
- 1 ページ構成で、ナビはすべて `/#about` などのアンカー。クリックすると Lenis のスムーズスクロールで 1,846px を **約 0.9〜1.0 秒（推定）** かけて移動する。ページを切り替える遷移はない。

**モバイル（390px）**
- 2×2 のタイル構成を正方形タイルのまま保つ。ナビは About / Clients / Testimonials / Team / Theme / Contact から、ミント色タイルの「Menu ≡」ひとつに畳まれる。
- 見出しは vw 比例（12.5〜13.8vw）でスケールし、ブレークポイントで行の構成を変える。横スクロールは発生しない。

**ローディング**
- プリローダーなし（全画面の被覆要素は検出されなかった）。タイル内の canvas によるディザ画像の描画と、テキストの出現アニメーションで段階的に見せる。

---

## 3. Maria Vasilyeva Portfolio

- URL: https://www.mariavasilyeva.com/
- SOTD: 2026-10-09（Awwwards の掲載ページに記載の日付）
- 性格: オフホワイト（#F9F9F9）地にセリフ体の大文字見出し（feat）、手書き注釈（suo）、等幅のサイドレール。罫線ベースのエディトリアルなレイアウト。canvas を 3 枚使用。

**ヒーロー見出し**（/about の「COMPOSING VISUAL NARRATIVES IN DIGITAL SPACE.」）
- **102.65px @1440** / **55.47px @390**。line-height 0.86、letter-spacing −0.02em、セリフ体の大文字。
- ルート font-size が 9.165px @1440、9.906px @390 と幅に応じて変わる（流体 rem）。見出しは約 11.2rem @1440、約 5.6rem @390。
- トップの最大テキストは手書き注釈「Scroll / More details」で、36.66px @1440、27.09px @1024、23.77px @390。
- 余白 @1440: 見出しブロックは y=347〜612。上には名前・肩書き・写真が罫線のあいだに並ぶ。見出しの下から本文までは約 58px（≈ 0.57 × 文字サイズ）、本文の下から「Scroll」までは約 70px。

**ホバー**
- テキストリンクは **letter-spacing を 1,400ms / cubic-bezier(0.16, 1, 0.3, 1)**（easeOutExpo）で変化させ、字間が広がる演出。margin を同じ尺で連動させる要素もある。
- 背景色の変化は 300ms / ease。

**ページ遷移**（/ → /about）
- 幕は使わない。SPA 内の遷移で、新しいページの要素が文字単位・行単位で入ってくる。300ms 時点では見出しが左からスライドインし、先頭文字が残像のように重なっていた。900ms 時点でほぼ定位置。
- `getAnimations()` で取れた値は、opacity 400ms / cubic-bezier(0.33, 1, 0.68, 1)、transform 1,200ms / cubic-bezier(0.7, 0.15, 0.25, 1)、transform 3,500ms / cubic-bezier(0.16, 1, 0.36, 1)、ほかに 1,600ms linear が 1 件。
- 体感上の主要部分は **約 1.2 秒（推定）**。

**モバイル（390px）**
- 左右の縦書きサイドレール（名前・肩書き / MENU・SOUND・ANNOTATIONS）が、上下の横向きバーに置き換わる（上「▶ MARIA VASILYEVA / MENU」、下「ANNOTATIONS / SOUND」）。
- 見出しは 3 行から 5 行に折り返し、中央揃えを保つ。文字サイズはルート font-size の流体スケールと rem 指定で調整している。横スクロールは発生しない。

**ローディング**
- タイポグラフィで見せるプリローダー。濃灰（#141414 前後）の地に「LOADING THE PLAYLIST / IT MIGHT TAKE SOME TIME / …」をセリフ体で積み、文字を走らせる演出と「▶ 100%」のカウンターを出す。
- 100% 表示は約 1.2 秒で出るが、演出が終わって本体が出るまでは **約 6.0 秒**。

---

## 4. Pensatori Irrazionali

- URL: https://pensatori-irrazionali.com/
- SOTD: 2026-09-20（Site of the Day + Developer Award。サイト内のニュース欄にも記載あり）
- 性格: 明るいグレー地に 3D 画像のヒーロー。プリローダーと遷移の幕は #111 の暗色。巨大なディスプレイ書体（ballet）でセクション見出しを置く。Next.js（Tailwind）+ Lenis、View Transitions API を使用。

**ヒーロー見出し**
- ファーストビューは画像のみで、テキスト見出しはない（h1 は視覚的に隠した 16px のロゴテキスト）。
- 最初に出る大見出しはセクション見出し「Works (01)」で、**256px @1440**、256px @1024、**128px @390**。line-height 1.0。1440 と 1024 で同じ値なので vw 比例ではなく、ブレークポイントで段階的に切り替えている（2 段階）。
- 余白: ヒーロー画像（ほぼ全高）のあとに見出しが続く。見出しの上端はスクロール 0 の状態で y=1080 @1440（= 4.2 × 文字サイズ）。

**ホバー**（Tailwind 系の値）
- `transform` は 300ms / cubic-bezier(0, 0, 0.2, 1)、`width, height` は 300ms / cubic-bezier(0.4, 0, 0.2, 1)、色系と `all` は **200ms / cubic-bezier(0, 0, 0.2, 1)**。
- 子要素の transform には 150ms のものもある。一部は 300ms / cubic-bezier(0.2, 0, 0, 1)。
- 全体として **150〜300ms** の短い尺で、ease-out 系。

**ページ遷移**（/ → /work）
- **View Transitions API**。CSS 側で既定アニメーションを無効にし、WAAPI で駆動している。`::view-transition` の背景は #111。
- 新しいページは `translateY(100%) scale(0.85)` から下からせり上がり、旧ページ（z-index 100）は 1,200ms、新ページは 1,800ms（タイミング関数は linear で、イージングはキーフレームに含めていると推定）。
- `:active-view-transition` は約 2.8 秒間有効だった（ページ読み込みを含む）。

**モバイル（390px）**
- ヘッダーは「Open navigation menu」のハンバーガーと SNS アイコンだけになる。デスクトップのサウンド切替やニュースパネルは消える。
- ディスプレイ見出しは 256px から 128px に半減（ブレークポイントで切替）。横スクロールは発生しない。

**ローディング**
- #111 の全画面プリローダー。「IDENTITY / MODULE 01」「OPTION SET 1」などの文字がスクランブル（グリッチ）しながら切り替わる。消えるまで 4.8 秒 @1024、7.2 秒 @1440。

---

## 補足: Jesper Landberg（計測が限定的）

- URL: http://jesperlandberg.com/ 、SOTD: 2026-09-29
- 黒背景で UI がほぼすべて WebGL（canvas）描画。DOM のテキストは画面外に置いたアクセシビリティ用の代替だけ（h1 28px @390 / 26.88px @1440 は不可視）。見出しサイズやホバーの CSS 値は計測できなかった。
- 確認できたこと:
  - Profile は URL を変えず、3D シーン内のオーバーレイとして開く（リング状オブジェクトの中に本文）。
  - モバイルではカードのカルーセルが縦積みのカードリストになる。
  - プリローダーは黒地の中央に小さなインジケーターだけを出す。
  - DOM 側の transition は opacity の 300ms / 500ms、cubic-bezier(0, 0, 0.2, 1)。
- 遷移時間はソフトウェア描画では 1 フレームに 2 秒以上かかり、計測不能。

---

## 観察レンジ

| 項目 | 観察レンジ | 内訳（サイト別） | 自サイト |
|---|---|---|---|
| ヒーロー見出し px @1440 | 約 16〜256px（大見出しを置くサイトでは 100〜256px） | Gil 16.3（トップ）/ 67.2（下層）、Aspen 180.7、Maria 102.6、Pensatori 256（セクション見出し） | |
| ヒーロー見出し px @390 | 約 17〜128px（大見出しを置くサイトでは 54〜128px） | Gil 17 / 32、Aspen 53.8（下の主役見出しは 79.3）、Maria 55.5、Pensatori 128 | |
| @390 / @1440 の比 | 0.30〜0.54 | Aspen 0.30、Gil（下層）0.48、Maria 0.54、Pensatori 0.50 | |
| 文字スケール方式 | vw 比例、流体 rem、ブレークポイント段階切替 | Gil: rem = 0.667vw（モバイル固定）、Aspen: 約 12.5vw、Maria: 流体ルート font-size + rem、Pensatori: px 固定 2 段階 | |
| 見出し周りの余白 | 見出し上 1.2〜4.2 × 文字サイズ、見出し下から次要素まで 0.1〜0.6 × | Aspen 上 1.22× / 下 0.11×、Maria 下 0.57×、Gil 下層 上 0.57×、Pensatori 上 4.2× | |
| ホバー時間 ms | 150〜1,400（中心は 200〜300 と 600〜800 の 2 群） | Pensatori 150〜300、Gil 300、Aspen 600〜800、Maria 1,400（字間） | |
| イージング | ease-out 系に集中。easeOutExpo / easeOutQuint、Tailwind の ease-out | cubic-bezier(0.16,1,0.3,1)（Aspen・Maria）、(0.23,1,0.32,1)（Gil）、(0,0,0.2,1)（Pensatori）、強調部のみ easeInOutExpo (0.87,0,0.13,1)（Aspen の clip-path） | |
| ページ遷移の種類 / ms | 黒幕フェード、View Transition のスライド、文字単位の入場、アンカーへのスムーズスクロール。約 600〜2,000ms | Gil: 黒幕フェード 約 600〜700（推定）、Pensatori: VT せり上がり + 縮小 旧 1,200 / 新 1,800、Maria: 幕なしで文字・行が入場 約 1,200（推定）、Aspen: 1 ページ構成でスムーズスクロール 約 900〜1,000（推定） | |
| ローディング表示 | 4 サイト中 3 サイトが全画面プリローダー（暗色地 + % やタイポ演出）、4.8〜10.9 秒。なしは 1 サイト（段階的に出現） | Gil: 黒 + % 8.5〜10.9 秒（推定）、Maria: タイポ演出 約 6.0 秒、Pensatori: スクランブル文字 4.8〜7.2 秒、Aspen: なし | |
| モバイルのナビ | ハンバーガーまたは「Menu」1 個に集約、もしくは要素を間引いて 1 行に | Aspen「Menu」タイル、Pensatori ハンバーガー、Maria 上下バー、Gil 3 リンクの 1 行 | |
