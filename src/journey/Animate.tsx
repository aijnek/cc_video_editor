// ラーニングジャーニー 4/7: フレームで動きをつける
// 小さな画面には MyComp.tsx の実物のシーン (Intro / BarChart / Progress) を描画している
import {interpolate, Loop, Sequence, spring, useCurrentFrame} from 'remotion';
import {BarChart, clamp, Intro, Progress} from '../MyComp';
import narration from '../narration/Animate.json';
import {ACCENT, Code, MONO, narratedVideo, NextUp, Scene, Screen, SeriesTitle, useFadeIn, usePop} from './ui';

// 関数 fn(x) の形を折れ線で描き、cursor の位置に点を打つ
const Plot: React.FC<{
	fn: (x: number) => number;
	xMax: number;
	yMin: number;
	yMax: number;
	width: number;
	height: number;
	color: string;
	cursor?: number;
	band?: [number, number];
	guide?: number;
}> = ({fn, xMax, yMin, yMax, width, height, color, cursor, band, guide}) => {
	const px = (x: number) => (x / xMax) * width;
	const py = (y: number) => height - ((y - yMin) / (yMax - yMin)) * height;
	const points = Array.from({length: xMax + 1}, (_, x) => `${px(x)},${py(fn(x))}`).join(' ');
	return (
		<svg width={width} height={height} style={{background: '#111827', borderRadius: 12, overflow: 'visible'}}>
			{band ? (
				<rect x={px(band[0])} y={0} width={px(band[1]) - px(band[0])} height={height} fill="rgba(251,191,36,0.10)" />
			) : null}
			{guide !== undefined ? (
				<line x1={0} x2={width} y1={py(guide)} y2={py(guide)} stroke="#475569" strokeDasharray="8 8" strokeWidth={2} />
			) : null}
			<polyline points={points} fill="none" stroke={color} strokeWidth={5} />
			{cursor !== undefined ? (
				<>
					<line x1={px(cursor)} x2={px(cursor)} y1={0} y2={height} stroke="#64748b" strokeWidth={2} />
					<circle cx={px(cursor)} cy={py(fn(cursor))} r={12} fill={color} />
				</>
			) : null}
		</svg>
	);
};

const Title: React.FC = () => <SeriesTitle current="Animate" subtitle="frame から動きを計算する" />;

// 1. 見た目 = frame から計算した値
const BALL_START = 290;
const FrameIsTime: React.FC = () => {
	const frame = useCurrentFrame();
	const f = Math.min(180, Math.max(0, frame - BALL_START));
	const track = usePop(BALL_START - 40);
	const second = usePop(BALL_START + 190);
	return (
		<Scene title="「動かす」のではなく、毎フレーム計算する" caption="30 フレーム = 1 秒 (fps = 30)。">
			<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 50, marginTop: 20}}>
				<Code
					lines={['const frame = useCurrentFrame();', '', '<div style={{left: frame * 8}}>●</div>']}
					highlight={frame > BALL_START - 40 ? [2] : [0]}
					fontSize={36}
				/>
				<div style={{opacity: track, position: 'relative', width: 1440, height: 150}}>
					{Array.from({length: 7}, (_, s) => (
						<div key={s} style={{position: 'absolute', left: s * 240, top: 80, width: 2, height: 40, background: '#475569'}}>
							<div style={{position: 'absolute', top: 44, left: -20, width: 60, fontSize: 26, color: '#94a3b8'}}>{s}秒</div>
						</div>
					))}
					<div style={{position: 'absolute', left: 0, right: 0, top: 98, height: 4, background: '#334155'}} />
					<div
						style={{
							position: 'absolute',
							left: f * 8 - 30,
							top: 70,
							width: 60,
							height: 60,
							borderRadius: 30,
							background: ACCENT,
						}}
					/>
					<div style={{position: 'absolute', left: f * 8 - 80, top: 0, width: 160, textAlign: 'center', fontFamily: MONO, fontSize: 30}}>
						frame {f}
					</div>
				</div>
				<div style={{fontSize: 40, fontWeight: 800, color: ACCENT, opacity: second}}>30 フレームで 1 秒</div>
			</div>
		</Scene>
	);
};

// 2. interpolate: 範囲を別の範囲に変換する
const INTRO_START = 200;
const InterpolateScene: React.FC = () => {
	const frame = useCurrentFrame();
	const f = Math.max(0, frame - INTRO_START);
	const lineIn = usePop(120);
	const pos = (x: number) => 60 + ((Math.min(Math.max(x, 20), 60) - 20) / 40) * 560;
	return (
		<Scene title="interpolate: 範囲を変換する">
			<div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 70, marginTop: 20}}>
				<div style={{display: 'flex', flexDirection: 'column', gap: 40}}>
					<Code lines={['interpolate(frame, [30, 50], [0, 1])']} label="src/MyComp.tsx の Intro (サブタイトルの不透明度)" fontSize={34} />
					<svg width={680} height={260} style={{opacity: lineIn}}>
						<text x={0} y={40} fill="#94a3b8" fontSize={28}>frame</text>
						<line x1={60} x2={620} y1={60} y2={60} stroke="#475569" strokeWidth={3} />
						<text x={0} y={230} fill="#94a3b8" fontSize={28}>不透明度</text>
						<line x1={60} x2={620} y1={200} y2={200} stroke="#475569" strokeWidth={3} />
						{[
							[30, '30', '0'],
							[50, '50', '1'],
						].map(([x, a, b]) => (
							<g key={a as string}>
								<line x1={pos(x as number)} x2={pos(x as number)} y1={60} y2={200} stroke={ACCENT} strokeDasharray="6 6" strokeWidth={2} />
								<text x={pos(x as number) - 16} y={40} fill={ACCENT} fontSize={30}>{a}</text>
								<text x={pos(x as number) - 8} y={245} fill={ACCENT} fontSize={30}>{b}</text>
							</g>
						))}
						<circle cx={pos(f)} cy={60} r={12} fill="#60a5fa" />
						<circle cx={pos(f)} cy={200} r={12} fill="#60a5fa" opacity={0.3 + 0.7 * interpolate(f, [30, 50], [0, 1], clamp)} />
					</svg>
				</div>
				<div style={{textAlign: 'center'}}>
					<Screen width={720}>
						<Sequence from={INTRO_START}>
							<Intro />
						</Sequence>
					</Screen>
					<div style={{fontFamily: MONO, fontSize: 30, marginTop: 14, color: '#94a3b8'}}>Intro の frame = {f}</div>
				</div>
			</div>
		</Scene>
	);
};

// 3. clamp: 範囲の外で止める
const ClampScene: React.FC = () => {
	const frame = useCurrentFrame();
	const f = Math.min(100, Math.max(0, frame - 150));
	const free = (x: number) => interpolate(x, [30, 50], [0, 300]);
	const clamped = (x: number) => interpolate(x, [30, 50], [0, 300], clamp);
	const cols = [
		{label: 'clamp なし', fn: free, color: '#f87171', code: 'interpolate(frame, [30, 50], [0, 300])', at: 40},
		{label: 'clamp あり', fn: clamped, color: '#34d399', code: 'interpolate(..., clamp)', at: 240},
	];
	return (
		<Scene title="clamp: 範囲の端で止める" caption="clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}。このリポジトリでは基本的に必ず付ける。">
			<div style={{display: 'flex', justifyContent: 'center', gap: 90, marginTop: 10}}>
				{cols.map((c) => {
					const p = usePop(c.at);
					return (
						<div key={c.label} style={{opacity: p, display: 'flex', flexDirection: 'column', gap: 18, width: 720}}>
							<div style={{fontSize: 40, fontWeight: 800, color: c.color}}>{c.label}</div>
							<div style={{fontFamily: MONO, fontSize: 26, color: '#cbd5e1'}}>{c.code}</div>
							<Plot fn={c.fn} xMax={100} yMin={-500} yMax={800} width={720} height={260} color={c.color} cursor={f} band={[30, 50]} guide={300} />
							<div style={{position: 'relative', height: 70, background: '#111827', borderRadius: 12, overflow: 'hidden'}}>
								<div
									style={{
										position: 'absolute',
										left: 20 + c.fn(f) * (620 / 300) * 0.5,
										top: 10,
										width: 50,
										height: 50,
										borderRadius: 25,
										background: c.color,
									}}
								/>
								<div style={{position: 'absolute', left: 20 + 310, top: 0, bottom: 0, width: 2, background: '#475569'}} />
							</div>
						</div>
					);
				})}
			</div>
		</Scene>
	);
};

// 4. spring: ばねの動き
const SPRINGS = [
	{damping: 12, color: '#f472b6', note: '弾む (Intro のタイトル)', at: 200},
	{damping: 200, color: '#60a5fa', note: 'なめらかに止まる (棒グラフ)', at: 290},
];

const SpringScene: React.FC = () => {
	const frame = useCurrentFrame();
	const loop = Math.max(0, frame - 120) % 75;
	return (
		<Scene title="spring: ばねのような動き" caption="0 から 1 へ自然に近づく値を返す。damping (減衰) で弾み方が変わる。">
			<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 30}}>
				<Code lines={['spring({fps, frame, config: {damping: 12}})']} fontSize={34} />
				<div style={{display: 'flex', gap: 80}}>
					{SPRINGS.map((s) => {
						const p = usePop(s.at);
						const fn = (x: number) => spring({fps: 30, frame: x, config: {damping: s.damping}});
						return (
							<div key={s.damping} style={{display: 'flex', alignItems: 'center', gap: 40, opacity: p}}>
								<div>
									<div style={{fontFamily: MONO, fontSize: 32, color: s.color, marginBottom: 10}}>damping: {s.damping}</div>
									<Plot fn={fn} xMax={60} yMin={0} yMax={1.5} width={460} height={220} color={s.color} cursor={Math.min(60, loop)} guide={1} />
									<div style={{fontSize: 28, color: '#cbd5e1', marginTop: 10}}>{s.note}</div>
								</div>
								<div
									style={{
										width: 160,
										height: 160,
										borderRadius: 24,
										background: s.color,
										transform: `scale(${fn(loop)})`,
									}}
								/>
							</div>
						);
					})}
				</div>
			</div>
		</Scene>
	);
};

// 5. frame から引いて遅らせる
const Delay: React.FC = () => {
	const frame = useCurrentFrame();
	const chartStart = 90;
	return (
		<Scene title="frame から引く = 動き始めを遅らせる">
			<div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 60, marginTop: 20}}>
				<div style={{display: 'flex', flexDirection: 'column', gap: 30}}>
					<Code
						label="src/MyComp.tsx の BarChart"
						lines={['DATA.map((d, i) => {', '  const p = spring({', '    fps,', '    frame: frame - 15 - i * 8,', '    config: {damping: 200},', '  });', '  // 高さ = d.value * 5 * p', '})']}
						highlight={frame > 200 ? [3] : []}
						fontSize={30}
					/>
					<div style={{fontSize: 34, color: ACCENT, fontWeight: 800, opacity: useFadeIn(200)}}>
						i 本目の棒は 15 + i × 8 フレーム遅れて伸び始める
					</div>
				</div>
				<Screen width={840}>
					<Sequence from={chartStart}>
						<BarChart />
					</Sequence>
				</Screen>
			</div>
		</Scene>
	);
};

// 6. useVideoConfig: 長さに合わせて動かす
const LENGTHS = [160, 300];

const VideoConfig: React.FC = () => (
	<Scene
		title="useVideoConfig: fps や長さを取り出す"
		caption="Sequence の中では durationInFrames はそのシーンの長さ。長さを変えても 100% で終わる。"
	>
		<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 30}}>
			<Code
				label="src/MyComp.tsx の Progress"
				lines={['const {durationInFrames} = useVideoConfig();', 'interpolate(frame, [10, durationInFrames - 40], [0, 1], clamp)']}
				fontSize={32}
			/>
			<div style={{display: 'flex', gap: 60, opacity: usePop(150)}}>
				{LENGTHS.map((len) => (
					<div key={len} style={{textAlign: 'center'}}>
						<Screen width={600}>
							<Sequence from={150}>
								<Loop durationInFrames={len}>
									<Progress />
								</Loop>
							</Sequence>
						</Screen>
						<div style={{fontFamily: MONO, fontSize: 32, marginTop: 12}}>
							シーンの長さ = <span style={{color: ACCENT}}>{len}</span> フレーム
						</div>
					</div>
				))}
			</div>
		</div>
	</Scene>
);

// 7. 次のステップ
const Next: React.FC = () => (
	<NextUp
		current="Animate"
		files={[
			{path: 'src/MyComp.tsx の Kinetic', note: 'Sequence で登場をずらしている'},
			{path: 'src/MyComp.tsx の MyComp', note: 'TransitionSeries でシーンを並べている'},
		]}
	/>
);

export const {Video: Animate, durationInFrames: ANIMATE_DURATION} = narratedVideo(
	[
		[Title, 240],
		[FrameIsTime, 240],
		[InterpolateScene, 240],
		[ClampScene, 240],
		[SpringScene, 240],
		[Delay, 240],
		[VideoConfig, 240],
		[Next, 240],
	],
	narration,
);
