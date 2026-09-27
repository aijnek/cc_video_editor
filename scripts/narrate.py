# 動画のナレーション音声を Qwen3-TTS (MLX, ローカル実行) で生成する。
# 全動画・全シーンで同じお手本音声 (scripts/narration_anchor.wav) を参照させ、声・速さ・間をそろえる。
# 原稿: scripts/narration/<動画>.txt (1行 = 1シーン。読み間違いを避けるため英単語はカタカナで書く)
# 出力: public/narration/<動画>/NN.wav と、各音声の長さ (フレーム数) を書いた src/narration/<動画>.json
# 実行 (cc_video_editor で):
#   uv run --project ../qwen3-tts python scripts/narrate.py Overview        # 全シーン
#   uv run --project ../qwen3-tts python scripts/narrate.py Overview 0 3    # 指定したシーンだけ作り直す
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

video = sys.argv[1]
with open(f"scripts/narration/{video}.txt") as f:
    NARRATION = [line.strip() for line in f if line.strip()]
out_json = f"src/narration/{video}.json"

targets = [int(a) for a in sys.argv[2:]] or list(range(len(NARRATION)))
if targets != list(range(len(NARRATION))):
    with open(out_json) as f:
        result = json.load(f)
    result += [None] * (len(NARRATION) - len(result))  # 原稿の末尾にシーンを足した場合
else:
    result = [None] * len(NARRATION)

os.makedirs(f"public/narration/{video}", exist_ok=True)
model = load_model(MODEL)  # 1回だけロードして全文に使い回す

for i in targets:
    text = NARRATION[i]
    file = f"narration/{video}/{i:02d}.wav"
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

with open(out_json, "w") as f:
    f.write(json.dumps(result, indent="\t", ensure_ascii=False) + "\n")
