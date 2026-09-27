// ラーニングジャーニー 6/7: ナレーションの仕組み
import {Img, staticFile} from 'remotion';
import narration from '../narration/Narration.json';
import {ACCENT, Arrow, Box, Code, MONO, narratedVideo, NextUp, Scene, SeriesTitle, useFadeIn, usePop} from './ui';

const Title: React.FC = () => <SeriesTitle current="Narration" subtitle="このシリーズの声のつくり方" />;

// 1. 全体の流れ
const STEPS = [
	[
		{label: '原稿', sub: 'scripts/narration/*.txt', color: '#f472b6', at: 60},
		{label: 'narrate.py', sub: 'scripts/narrate.py', color: '#a78bfa', at: 110},
		{label: '音声合成', sub: 'Qwen3-TTS (ローカル)', color: '#a78bfa', at: 170},
		{label: '音量をそろえる', sub: 'ffmpeg loudnorm', color: '#a78bfa', at: 250},
	],
	[
		{label: '音声と長さ', sub: 'public/narration/*.wav\nsrc/narration/*.json', color: '#34d399', at: 320},
		{label: 'シーンの長さ', sub: 'narratedVideo', color: '#60a5fa', at: 420},
		{label: '音声を重ねる', sub: '<Audio>', color: '#60a5fa', at: 500},
	],
];

const Pipeline: React.FC = () => (
	<Scene title="全体の流れ">
		<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 60, marginTop: 40}}>
			{STEPS.map((row, r) => (
				<div key={r} style={{display: 'flex', alignItems: 'center', gap: 14}}>
					{row.map((s, i) => {
						const p = usePop(s.at);
						return (
							<div key={s.label} style={{display: 'flex', alignItems: 'center', gap: 14}}>
								<Box
									color={s.color}
									style={{
										width: r === 0 ? 360 : 440,
										textAlign: 'center',
										padding: '22px 14px',
										opacity: p,
										transform: `translateY(${(1 - p) * 30}px)`,
									}}
								>
									<div style={{fontSize: 40, fontWeight: 800}}>{s.label}</div>
									<div style={{fontFamily: MONO, fontSize: 20, color: '#94a3b8', marginTop: 10, whiteSpace: 'pre'}}>
										{s.sub}
									</div>
								</Box>
								{i < row.length - 1 ? <Arrow opacity={p} /> : null}
							</div>
						);
					})}
				</div>
			))}
			<div style={{fontSize: 34, color: '#94a3b8', opacity: useFadeIn(320)}}>
				上の段 = Python (qwen3-tts の環境) / 下の段 = Remotion の動画
			</div>
		</div>
	</Scene>
);

// 2. 原稿の書き方
const SCRIPT_LINES = [
	'このシリーズでは、7本の動画で、このリポジトリを…',
	'このリポジトリは、リアクトのコードから、動画を…',
	'中には、2本の動画が入っています。…',
	'…',
];
const KATAKANA = [
	['Remotion', 'リモーション'],
	['React', 'リアクト'],
	['FFmpeg', 'エフエフエムペグ'],
	['MP4', 'エムピーフォー'],
];

const Script: React.FC = () => (
	<Scene title="原稿: 1 行 = 1 シーン">
		<div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 80, height: '100%'}}>
			<div style={{display: 'flex', gap: 16}}>
				<div style={{fontFamily: MONO, fontSize: 30, lineHeight: 1.55, color: '#64748b', paddingTop: 66, textAlign: 'right'}}>
					{['シーン 1', 'シーン 2', 'シーン 3', ''].map((l, i) => (
						<div key={i}>{l || ' '}</div>
					))}
				</div>
				<Code label="scripts/narration/Overview.txt" lines={SCRIPT_LINES} fontSize={30} />
			</div>
			<div style={{opacity: usePop(220)}}>
				<div style={{fontSize: 36, fontWeight: 800, marginBottom: 20}}>英単語はカタカナで書く</div>
				{KATAKANA.map(([en, ja], i) => (
					<div key={en} style={{display: 'flex', gap: 24, fontSize: 36, marginBottom: 12, opacity: useFadeIn(240 + i * 15)}}>
						<span style={{fontFamily: MONO, width: 200, color: '#94a3b8'}}>{en}</span>
						<span>→</span>
						<span style={{color: ACCENT, fontWeight: 800}}>{ja}</span>
					</div>
				))}
			</div>
		</div>
	</Scene>
);

// 3. お手本方式
// 実験結果: 同じ文を 8 回生成したときの長さの幅 (秒)。お手本なし = CustomVoice (話者 ono_anna)
const SPREAD = [
	{text: 'タイトル', without: 2.6, with: 0.6},
	{text: 'シーン 4 の文', without: 5.9, with: 2.6},
	{text: 'シーン 7 の文', without: 5.1, with: 1.9},
];

const Anchor: React.FC = () => {
	const chart = usePop(420);
	return (
		<Scene title="お手本方式: 声と話し方をそろえる">
			<div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 80, height: '100%'}}>
				<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20}}>
					<div style={{display: 'flex', gap: 0, opacity: usePop(90)}}>
						<div
							style={{
								padding: '22px 28px',
								background: 'rgba(52,211,153,0.2)',
								border: '3px solid #34d399',
								borderRadius: '14px 0 0 14px',
								fontSize: 32,
								textAlign: 'center',
							}}
						>
							お手本音声
							<div style={{fontFamily: MONO, fontSize: 20, color: '#94a3b8', marginTop: 6}}>scripts/narration_anchor.wav</div>
						</div>
						<div
							style={{
								padding: '22px 28px',
								background: 'rgba(244,114,182,0.2)',
								border: '3px solid #f472b6',
								borderLeft: 'none',
								borderRadius: '0 14px 14px 0',
								fontSize: 32,
							}}
						>
							今回の原稿
						</div>
					</div>
					<div style={{fontSize: 28, color: '#94a3b8', opacity: useFadeIn(150)}}>お手本を「直前の発話」として前に置く</div>
					<div style={{fontSize: 50, color: '#64748b', opacity: useFadeIn(200)}}>↓</div>
					<Box color="#a78bfa" style={{textAlign: 'center', opacity: usePop(220)}}>
						<div style={{fontSize: 36, fontWeight: 800}}>Qwen3-TTS (Base)</div>
						<div style={{fontSize: 28, color: '#cbd5e1', marginTop: 8}}>お手本の続きとして話す</div>
					</Box>
				</div>
				<div style={{opacity: chart}}>
					<div style={{fontSize: 32, fontWeight: 800, marginBottom: 20}}>同じ文を 8 回生成したときの長さの幅</div>
					{SPREAD.map((s) => (
						<div key={s.text} style={{marginBottom: 22}}>
							<div style={{fontSize: 28, color: '#cbd5e1', marginBottom: 6}}>{s.text}</div>
							{[
								{v: s.without, color: '#f87171', label: 'お手本なし'},
								{v: s.with, color: '#34d399', label: 'お手本あり'},
							].map((b) => (
								<div key={b.label} style={{display: 'flex', alignItems: 'center', gap: 14, marginBottom: 4}}>
									<div style={{width: 150, fontSize: 24, color: '#94a3b8'}}>{b.label}</div>
									<div style={{width: b.v * 100 * chart, height: 28, background: b.color, borderRadius: 6}} />
									<div style={{fontFamily: MONO, fontSize: 26}}>{b.v} 秒</div>
								</div>
							))}
						</div>
					))}
				</div>
			</div>
		</Scene>
	);
};

// 4. 生成は毎回変わる → 生成した音声をコミットする
// 実験結果: 同じタイトル文を 8 回生成したときの長さ (秒)
const TAKES = {
	without: [6.2, 5.8, 7.4, 6.6, 7.3, 5.9, 8.5, 6.7],
	with: [6.6, 7.0, 6.7, 6.5, 6.9, 7.0, 6.9, 6.8],
};

const Variation: React.FC = () => {
	const cmd = usePop(330);
	return (
		<Scene title="生成は毎回変わる" caption="だから生成した音声 (public/narration/) と長さ (src/narration/) もコミットしている。">
			<div style={{display: 'flex', justifyContent: 'center', alignItems: 'flex-start', gap: 90}}>
				{(['without', 'with'] as const).map((k, c) => (
					<div key={k} style={{opacity: usePop(60 + c * 60)}}>
						<div style={{fontSize: 32, fontWeight: 800, marginBottom: 14, color: c === 0 ? '#f87171' : '#34d399'}}>
							同じ文を 8 回 ({c === 0 ? 'お手本なし' : 'お手本あり'})
						</div>
						{TAKES[k].map((d, i) => (
							<div key={i} style={{display: 'flex', alignItems: 'center', gap: 14, marginBottom: 8}}>
								<div style={{width: d * 80, height: 26, borderRadius: 6, background: c === 0 ? '#f87171' : '#34d399'}} />
								<div style={{fontFamily: MONO, fontSize: 24, color: '#cbd5e1'}}>{d.toFixed(1)} 秒</div>
							</div>
						))}
					</div>
				))}
			</div>
			<div style={{display: 'flex', justifyContent: 'center', marginTop: 30, opacity: cmd}}>
				<Code
					lines={['# 気になるシーンだけ作り直す (例: Overview のシーン 0 と 3)', 'uv run --project ../qwen3-tts python scripts/narrate.py Overview 0 3']}
					fontSize={28}
				/>
			</div>
		</Scene>
	);
};

// 5. 品質チェック
const CHECKS = [
	{title: '話す速さ', detail: '文字/秒。極端に遅い・速いシーンがないか', at: 80},
	{title: '不自然に長い無音', detail: '1.2 秒以上の無音がないか', at: 150},
	{title: '話し始めの息の音', detail: 'スペクトログラムで確認', at: 230},
];

const QualityCheck: React.FC = () => (
	<Scene title="作った音声をチェックする">
		<div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 70}}>
			<div style={{display: 'flex', flexDirection: 'column', gap: 22}}>
				{CHECKS.map((c) => (
					<Box key={c.title} color="#475569" style={{width: 620, opacity: usePop(c.at)}}>
						<div style={{fontSize: 38, fontWeight: 800}}>✓ {c.title}</div>
						<div style={{fontSize: 28, color: '#94a3b8', marginTop: 6}}>{c.detail}</div>
					</Box>
				))}
				<div style={{fontSize: 36, fontWeight: 800, color: ACCENT, opacity: usePop(330)}}>
					自然さは数値では分からない → 最後は人の耳で
				</div>
			</div>
			<div style={{display: 'flex', flexDirection: 'column', gap: 20, opacity: usePop(250)}}>
				{[
					{src: 'journey/spec_breath.png', label: '息の音あり: 声の前に雑音の塊', color: '#f87171'},
					{src: 'journey/spec_normal.png', label: '通常: 静かな区間のあと声が始まる', color: '#34d399'},
				].map((s) => (
					<div key={s.src}>
						<div style={{fontSize: 28, color: s.color, fontWeight: 800, marginBottom: 6}}>{s.label}</div>
						<Img src={staticFile(s.src)} style={{width: 720, borderRadius: 10, display: 'block'}} />
					</div>
				))}
				<div style={{fontSize: 24, color: '#94a3b8'}}>話し始めの 1.5 秒 (横 = 時間、縦 = 周波数)</div>
			</div>
		</div>
	</Scene>
);

// 6. 次のステップ
const Next: React.FC = () => (
	<NextUp
		current="Narration"
		files={[
			{path: 'scripts/narrate.py', note: '音声の生成・音量調整・長さの記録'},
			{path: 'scripts/narration/Overview.txt', note: '原稿の例 (1 行 = 1 シーン)'},
		]}
	/>
);

export const {Video: Narration, durationInFrames: NARRATION_DURATION} = narratedVideo(
	[
		[Title, 240],
		[Pipeline, 240],
		[Script, 240],
		[Anchor, 240],
		[Variation, 240],
		[QualityCheck, 240],
		[Next, 240],
	],
	narration,
);
