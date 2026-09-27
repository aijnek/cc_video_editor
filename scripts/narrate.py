# HowItWorks のナレーション音声を Qwen3-TTS (MLX, ローカル実行) で生成する。
# 全シーンで同じお手本音声 (scripts/narration_anchor.wav) を参照させ、声・速さ・間をそろえる。
# 出力: public/narration/NN.wav と、各音声の長さ (フレーム数) を書いた src/narration.json
# 実行 (cc_video_editor で):
#   uv run --project ../qwen3-tts python scripts/narrate.py        # 全シーン
#   uv run --project ../qwen3-tts python scripts/narrate.py 0 3    # 指定したシーンだけ作り直す
# 読み間違いを避けるため、英単語はカタカナで書いている。
import json
import math
import os
import subprocess
import sys

import numpy as np
import soundfile as sf
from mlx_audio.tts.utils import load_model

MODEL = "mlx-community/Qwen3-TTS-12Hz-1.7B-Base-bf16"
# お手本: CustomVoice (話者 ono_anna, 落ち着いた解説トーンの指示) で生成したシーン1の音声と、その文
ANCHOR_AUDIO = "scripts/narration_anchor.wav"
ANCHOR_TEXT = "動画は、静止画をパラパラ漫画のように並べたものです。1秒間に30枚。リモーションは、フレーム番号をリアクトのコンポーネントに渡し、その番号の、1枚の絵を描かせます。"
SAMPLE_RATE = 24000
FPS = 30

NARRATION = [
    "今回は、リモーションの裏側を見ていきます。リアクトのコードが、どうやってエムピーフォーの動画になるのか、その仕組みを紹介します。",
    "動画は、静止画をパラパラ漫画のように並べたものです。1秒間に30枚。リモーションは、フレーム番号をリアクトのコンポーネントに渡し、その番号の、1枚の絵を描かせます。",
    "レンダーコマンドを実行すると、5つの段階が順番に進みます。バンドル、ブラウザで開く、設定を読む、1枚ずつ撮影、そして、動画に変換。つまり、ブラウザで描いて、撮って、つなぐ仕組みです。",
    "まず、自分のコードとライブラリを、ウェブパックで、一つのウェブページにまとめます。それをローカルサーバーで配信し、画面を持たないクロームで開きます。",
    "次に、ルートファイルのコンポジションを読み取ります。サイズは1920かける1080、1秒に30枚、長さは900フレーム。つまり、900枚撮影すればよい、と分かります。",
    "撮影は、6つのタブで同時に進みます。各タブは、フレーム番号をセットし、描画が終わるのを待って、スクリーンショットを撮る。これを繰り返します。空いたタブが次の番号を取りに行くので、完成する順番はバラバラです。",
    "撮り終えた900枚の画像は、番号順に並べて、エフエフエムペグに渡します。エフエフエムペグが圧縮して、1本のエムピーフォー動画にします。音声がある場合は、別に処理して合成されます。",
    "フレームは、別々のタブで、順不同に描かれます。そのため、前のフレームの状態や、マス・ランダムには頼れません。同じフレーム番号なら、必ず同じ絵になる。これが、クロード・エムディーにある禁止事項の理由です。",
    "まとめると、リアクトが絵の設計図、クロームがカメラ、エフエフエムペグが編集機です。ちなみに、スタジオのプレビューは、撮影もエンコードもせず、ブラウザでそのまま表示しているだけです。",
]

targets = [int(a) for a in sys.argv[1:]] or list(range(len(NARRATION)))
if targets != list(range(len(NARRATION))):
    with open("src/narration.json") as f:
        result = json.load(f)
else:
    result = [None] * len(NARRATION)

os.makedirs("public/narration", exist_ok=True)
model = load_model(MODEL)  # 1回だけロードして全文に使い回す

for i in targets:
    text = NARRATION[i]
    file = f"narration/{i:02d}.wav"
    raw = f"public/{file}.raw.wav"
    chunks = model.generate(
        text=text, ref_audio=ANCHOR_AUDIO, ref_text=ANCHOR_TEXT, lang_code="japanese"
    )
    audio = np.concatenate([np.array(r.audio) for r in chunks])
    sf.write(raw, audio, SAMPLE_RATE)
    # シーン間で音量をそろえる (Remotion 同梱の ffmpeg)
    subprocess.run(
        ["npx", "remotion", "ffmpeg", "-y", "-v", "error", "-i", raw,
         "-af", "loudnorm=I=-16:TP=-1.5", "-ar", str(SAMPLE_RATE), f"public/{file}"],
        check=True,
    )
    os.remove(raw)
    seconds = sf.info(f"public/{file}").duration
    print(f"{file}: {seconds:.1f}s ({len(text) / seconds:.1f} 文字/秒)", flush=True)
    result[i] = {"file": file, "frames": math.ceil(seconds * FPS)}

with open("src/narration.json", "w") as f:
    f.write(json.dumps(result, indent="\t", ensure_ascii=False) + "\n")
