# Fonts

このディレクトリのフォントは、Fontsource 経由で取得した次の書体を、このサイトの文言に合わせてサブセット化したものです。

| 書体 | 用途 | 取得元 | ライセンス |
|---|---|---|---|
| Shippori Mincho B1（700） | 見出し、OG 画像 | `@fontsource/shippori-mincho-b1` 5.3.0 | [SIL OFL 1.1](LICENSE-shippori-mincho-b1.txt) |
| JetBrains Mono（可変） | 索引番号 | `@fontsource-variable/jetbrains-mono` 5.3.0 | [SIL OFL 1.1](LICENSE-jetbrains-mono.txt) |
| Zen Kaku Gothic New（400） | OG 画像 | `@fontsource/zen-kaku-gothic-new` 5.3.0 | [SIL OFL 1.1](LICENSE-zen-kaku-gothic-new.txt) |

- `*.woff2` と `fonts.css` はサイト配信用、`og/*.woff` は OG 画像の生成用です。
- `@font-face` のファミリー名はページ群ごとに分けています（例: `Shippori Mincho B1 c-forms`）。どの書体にも Reserved Font Name の指定はありません。
- 再生成の手順は `scripts/fonts/subset.py` の冒頭にあります。
