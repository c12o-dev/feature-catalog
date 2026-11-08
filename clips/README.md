# clips — デモの短い動画を作る

各パターンのデモを Playwright で操作しながら録画し、テロップを焼き込んだ正方形の MP4（X 投稿用）にする。
台本（何を操作して何を見せるか）だけが人の仕事で、下書きは AI が作る。録画・切り出し・字幕・書き出しは全自動。

## 使い方

```sh
pnpm run build                               # out/ を作る（配信サーバーは build.mjs が自分で立てる）
pnpm run clips -- like-button stepper        # 台本が無ければ下書き → 録画 → 書き出し → 確認シート
pnpm run clips -- --all --limit 20 --skip-existing
```

成果物は `tmp/clips/`（gitignore 済み）:

- `out/<slug>.mp4` — 1080x1080、H.264、無音 AAC、faststart。X にそのまま上げられる
- `review/<slug>.png` — 4 コマの確認シート。ここを目で見て台本を直す
- `raw/` — 録画の WebM と、テロップ時刻・切り出し範囲の JSON

個別に動かすなら `node clips/draft.mjs <slug>`、`node clips/record.mjs <slug>`、`node clips/render.mjs <slug>`、`node clips/sheet.mjs <slug>`。
`record.mjs` を単体で使うときは、先に `pnpm run build` と `node scripts/serve-out.mjs 3100` を自分で動かす（`build.mjs` だけがサーバーの面倒を見る）。別の URL を撮るなら `CLIPS_BASE=https://feature-catalog.c12o.net` のように指定する。

`--all` は `aliasOf` 付きのパターン（同じデモを別名で指すもの）を除いて回る。

## 台本

`clips/scenarios/<slug>.json`。書き方は `PROMPT.md`（AI に渡す仕様そのもの）。

- `draft.mjs` は `claude -p` にデモのソースとカタログの説明を渡して台本を作る。既にある台本は `--force` が無い限り上書きしないので、人が直した台本は守られる
- `post.ja` / `post.en` に X の本文案も入る。投稿はこのリポジトリの範囲外
- 手本として `command-palette` `toast` `otp-input` の 3 本を人が確認済み。下書きの精度はこの 3 本に引っ張られる

## 仕組みのメモ

- ヘッドレスはマウスカーソルを描かない。`record.mjs` が疑似カーソルを DOM に載せ、クリック前に滑らかに動かす
- 録画はビューポート 1:1 の画素でしか取れず `deviceScaleFactor` は効かない。1920x1080 のビューポートに CSS `zoom: 1.5` でページを拡大して描画し、実質の解像度を上げている（`CLIPS_ZOOM`）
- 切り出しは `crop: "demo"`（デモ領域）/ `"content"`（文字・入力・画像のある要素の外接矩形）/ `"viewport"`。`extend` で広げ、`toaster: "near-demo"` で sonner のトーストをデモ直下に寄せる
- テロップは `mark` の時刻から次の `mark` までを ASS 字幕にして ffmpeg の `ass` フィルタで焼く。フォントは IPAPGothic（`CLIPS_FONT`）
- 要 ffmpeg（libass 付き）と日本語フォント
