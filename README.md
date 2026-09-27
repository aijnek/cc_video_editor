# cc_video_editor

[Remotion](https://www.remotion.dev/) で React のコードから動画をつくるサンプルです。

| Composition | 内容 | 長さ |
|---|---|---|
| `MyComp` | Remotion でできること (spring / Sequence / TransitionSeries など) のショーケース | 30 秒 |
| `HowItWorks` | レンダリングの仕組み (バンドル → Chrome で撮影 → FFmpeg で動画化) の解説。ラーニングジャーニー 3 本目も兼ねる | 約 2 分 36 秒 |
| `Overview` | ラーニングジャーニー (このリポジトリを理解するための動画シリーズ、全 7 本) の 1 本目「全体像」 | 約 2 分 7 秒 |
| `ReactBasics` | ラーニングジャーニー 2 本目「React 最小限入門」 | 約 2 分 3 秒 |
| `Animate` | ラーニングジャーニー 4 本目「フレームで動きをつける」 | 約 1 分 58 秒 |
| `Compose` | ラーニングジャーニー 5 本目「シーンの並べ方とタイミング」 | 約 1 分 52 秒 |
| `Narration` | ラーニングジャーニー 6 本目「ナレーションの仕組み」 | 約 1 分 56 秒 |
| `Practice` | ラーニングジャーニー 7 本目「実践：新しいシーンを追加」 | 約 1 分 56 秒 |

## 使い方

```bash
npm install
npm run studio   # ブラウザでプレビュー・編集
```

動画の書き出し:

```bash
npx remotion render MyComp out/video.mp4
npx remotion render HowItWorks out/how-it-works.mp4
npx remotion render Overview out/01-overview.mp4
npx remotion render ReactBasics out/02-react-basics.mp4
npx remotion render Animate out/04-animate.mp4
npx remotion render Compose out/05-compose.mp4
npx remotion render Narration out/06-narration.mp4
npx remotion render Practice out/07-practice.mp4
```

## ナレーション (ローカル TTS)

ナレーション付き動画の音声は、音声合成モデル [Qwen3-TTS](https://huggingface.co/mlx-community/Qwen3-TTS-12Hz-1.7B-Base-bf16) を [MLX](https://github.com/ml-explore/mlx) で**ローカル実行**して生成しています (外部 API は使いません)。

- お手本音声 `scripts/narration_anchor.wav` を全シーンで参照させ、声・速さ・間をそろえています
- 原稿は `scripts/narration/<動画>.txt` (1 行 = 1 シーン)。生成した音声は `public/narration/<動画>/`、各音声の長さは `src/narration/<動画>.json` に保存され、シーンの長さは音声に合わせて自動で決まります
- 生成は毎回結果が変わるため、生成済みの音声もリポジトリに含めています

作り直す場合は、Apple Silicon の Mac で [qwen3_tts_mlx](https://github.com/aijnek/qwen3_tts_mlx) を隣のディレクトリ (`../qwen3-tts`) に置いてセットアップしたうえで:

```bash
uv run --project ../qwen3-tts python scripts/narrate.py Overview        # 全シーン
uv run --project ../qwen3-tts python scripts/narrate.py Overview 0 3    # 指定したシーンだけ
```

## 構成

```
src/MyComp.tsx       サンプル動画
src/HowItWorks.tsx   解説動画
src/Root.tsx         Composition の登録
src/journey/         ラーニングジャーニーの動画と共通部品
scripts/narrate.py   ナレーション生成
scripts/narration/   ナレーション原稿
public/mycomp/       解説動画で使う MyComp の静止画 (30 フレームごと)
public/narration/    ナレーション音声
```
