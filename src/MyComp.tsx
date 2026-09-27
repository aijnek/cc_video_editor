import {
	AbsoluteFill,
	Sequence,
	interpolate,
	random,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import {linearTiming, springTiming, TransitionSeries} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {slide} from '@remotion/transitions/slide';
import {wipe} from '@remotion/transitions/wipe';
import {flip} from '@remotion/transitions/flip';
import {clockWipe} from '@remotion/transitions/clock-wipe';

export const FONT = '"Hiragino Sans", "Noto Sans JP", sans-serif';
export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// 各シーンの左下に「このシーンで使っている機能」を表示するラベル
export const ApiLabel: React.FC<{text: string}> = ({text}) => {
	const frame = useCurrentFrame();
	const opacity = interpolate(frame, [10, 25], [0, 1], clamp);
	return (
		<div
			style={{
				position: 'absolute',
				left: 60,
				bottom: 50,
				padding: '12px 24px',
				borderRadius: 12,
				background: 'rgba(0,0,0,0.45)',
				color: '#fff',
				fontFamily: 'Menlo, monospace',
				fontSize: 32,
				opacity,
			}}
		>
			{text}
		</div>
	);
};

// 1. タイトル: spring で弾むように登場、interpolate でフェード
const Intro: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const scale = spring({fps, frame, config: {damping: 12}});
	const subOpacity = interpolate(frame, [30, 50], [0, 1], clamp);
	const subY = interpolate(frame, [30, 50], [30, 0], clamp);
	return (
		<AbsoluteFill
			style={{
				background: 'linear-gradient(135deg, #1e3a8a, #7c3aed)',
				justifyContent: 'center',
				alignItems: 'center',
				fontFamily: FONT,
				color: '#fff',
			}}
		>
			<div style={{fontSize: 150, fontWeight: 800, transform: `scale(${scale})`}}>
				Remotion
			</div>
			<div
				style={{
					fontSize: 56,
					opacity: subOpacity,
					transform: `translateY(${subY}px)`,
				}}
			>
				React のコードで動画をつくる
			</div>
			<ApiLabel text="spring() / interpolate()" />
		</AbsoluteFill>
	);
};

// 2. キネティックタイポグラフィ: 単語ごとに Sequence で登場タイミングをずらす
export const Word: React.FC<{text: string; color: string}> = ({text, color}) => {
	const frame = useCurrentFrame(); // Sequence 内なので 0 から数え直される
	const {fps} = useVideoConfig();
	const progress = spring({fps, frame, config: {damping: 200}});
	return (
		<span
			style={{
				display: 'inline-block',
				margin: '0 20px',
				color,
				opacity: progress,
				transform: `translateY(${(1 - progress) * 80}px)`,
			}}
		>
			{text}
		</span>
	);
};

export const WORDS = [
	{text: '文字を', color: '#fde68a'},
	{text: '1語ずつ', color: '#fca5a5'},
	{text: '動かす', color: '#93c5fd'},
	{text: 'ことも', color: '#86efac'},
	{text: '簡単', color: '#f0abfc'},
];

const Kinetic: React.FC = () => {
	return (
		<AbsoluteFill style={{background: '#0f172a', fontFamily: FONT}}>
			<AbsoluteFill
				style={{
					flexDirection: 'row',
					justifyContent: 'center',
					alignItems: 'center',
					fontSize: 110,
					fontWeight: 800,
				}}
			>
				{WORDS.map((w, i) => (
					<Sequence key={w.text} from={i * 12} layout="none">
						<Word text={w.text} color={w.color} />
					</Sequence>
				))}
			</AbsoluteFill>
			<ApiLabel text="<Sequence from={...}>" />
		</AbsoluteFill>
	);
};

// 3. データの可視化: 棒グラフが順番に伸び、数値もカウントアップする
const DATA = [
	{label: '1月', value: 32},
	{label: '2月', value: 48},
	{label: '3月', value: 41},
	{label: '4月', value: 67},
	{label: '5月', value: 85},
	{label: '6月', value: 100},
];

const BarChart: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	return (
		<AbsoluteFill style={{background: '#f8fafc', fontFamily: FONT, padding: 100}}>
			<div style={{fontSize: 64, fontWeight: 800, color: '#0f172a'}}>
				データからグラフ動画を生成
			</div>
			<div
				style={{
					flex: 1,
					display: 'flex',
					alignItems: 'flex-end',
					gap: 50,
					padding: '40px 100px 60px',
				}}
			>
				{DATA.map((d, i) => {
					const p = spring({fps, frame: frame - 15 - i * 8, config: {damping: 200}});
					return (
						<div
							key={d.label}
							style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center'}}
						>
							<div style={{fontSize: 40, fontWeight: 700, color: '#334155'}}>
								{Math.round(d.value * p)}
							</div>
							<div
								style={{
									width: '100%',
									height: d.value * 5 * p,
									borderRadius: '12px 12px 0 0',
									background: `hsl(${220 + i * 18}, 80%, 58%)`,
								}}
							/>
							<div style={{fontSize: 36, marginTop: 12, color: '#475569'}}>{d.label}</div>
						</div>
					);
				})}
			</div>
			<ApiLabel text="配列データ × spring()" />
		</AbsoluteFill>
	);
};

// 4. パーティクル: random(seed) で毎回同じ「ランダム」配置を再現
const PARTICLES = new Array(120).fill(0).map((_, i) => ({
	x: random(`x-${i}`) * 1920,
	y: random(`y-${i}`) * 1080,
	r: 4 + random(`r-${i}`) * 18,
	speed: 0.5 + random(`s-${i}`) * 2.5,
	hue: 160 + random(`h-${i}`) * 120,
}));

const Particles: React.FC = () => {
	const frame = useCurrentFrame();
	const textOpacity = interpolate(frame, [20, 40], [0, 1], clamp);
	return (
		<AbsoluteFill style={{background: '#020617', fontFamily: FONT}}>
			<svg width={1920} height={1080}>
				{PARTICLES.map((p, i) => (
					<circle
						key={i}
						cx={p.x + Math.sin((frame + i * 10) / 20) * 30}
						cy={(p.y - frame * p.speed * 3 + 1080 * 2) % 1080}
						r={p.r}
						fill={`hsla(${p.hue}, 90%, 60%, 0.7)`}
					/>
				))}
			</svg>
			<AbsoluteFill
				style={{
					justifyContent: 'center',
					alignItems: 'center',
					color: '#fff',
					fontSize: 90,
					fontWeight: 800,
					opacity: textOpacity,
					textShadow: '0 0 30px rgba(0,0,0,0.8)',
				}}
			>
				SVG で自由に描画
			</AbsoluteFill>
			<ApiLabel text="random('seed') + <svg>" />
		</AbsoluteFill>
	);
};

// 5. 図形アニメーション: 円を描き、回転させ、進捗をパーセント表示
const Progress: React.FC = () => {
	const frame = useCurrentFrame();
	const {durationInFrames} = useVideoConfig();
	const radius = 250;
	const circumference = 2 * Math.PI * radius;
	const progress = interpolate(frame, [10, durationInFrames - 40], [0, 1], clamp);
	return (
		<AbsoluteFill
			style={{
				background: 'linear-gradient(135deg, #064e3b, #0e7490)',
				justifyContent: 'center',
				alignItems: 'center',
				fontFamily: FONT,
			}}
		>
			<svg width={640} height={640} style={{transform: `rotate(${frame * 0.5 - 90}deg)`}}>
				<circle cx={320} cy={320} r={radius} stroke="rgba(255,255,255,0.2)" strokeWidth={40} fill="none" />
				<circle
					cx={320}
					cy={320}
					r={radius}
					stroke="#fde047"
					strokeWidth={40}
					fill="none"
					strokeLinecap="round"
					strokeDasharray={circumference}
					strokeDashoffset={circumference * (1 - progress)}
				/>
			</svg>
			<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', color: '#fff'}}>
				<div style={{fontSize: 160, fontWeight: 800}}>{Math.round(progress * 100)}%</div>
			</AbsoluteFill>
			<ApiLabel text="useVideoConfig() + interpolate()" />
		</AbsoluteFill>
	);
};

// 6. エンディング
const Outro: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const lines = ['シーンの切り替えも', 'TransitionSeries で', 'fade / slide / wipe / flip …'];
	return (
		<AbsoluteFill
			style={{
				background: 'linear-gradient(135deg, #7c2d12, #be185d)',
				justifyContent: 'center',
				alignItems: 'center',
				fontFamily: FONT,
				color: '#fff',
				gap: 20,
			}}
		>
			{lines.map((line, i) => {
				const p = spring({fps, frame: frame - i * 10, config: {damping: 200}});
				return (
					<div
						key={line}
						style={{
							fontSize: 80,
							fontWeight: 800,
							opacity: p,
							transform: `translateX(${(1 - p) * -200}px)`,
						}}
					>
						{line}
					</div>
				);
			})}
			<ApiLabel text="<TransitionSeries>" />
		</AbsoluteFill>
	);
};

// 全体構成: 6 シーン合計 1000f − トランジション 5×20f = 900f (30 秒)
export const MyComp: React.FC = () => {
	const t = linearTiming({durationInFrames: 20});
	return (
		<TransitionSeries>
			<TransitionSeries.Sequence durationInFrames={160}>
				<Intro />
			</TransitionSeries.Sequence>
			<TransitionSeries.Transition timing={t} presentation={fade()} />
			<TransitionSeries.Sequence durationInFrames={170}>
				<Kinetic />
			</TransitionSeries.Sequence>
			<TransitionSeries.Transition timing={t} presentation={slide({direction: 'from-right'})} />
			<TransitionSeries.Sequence durationInFrames={190}>
				<BarChart />
			</TransitionSeries.Sequence>
			<TransitionSeries.Transition timing={t} presentation={wipe({direction: 'from-left'})} />
			<TransitionSeries.Sequence durationInFrames={160}>
				<Particles />
			</TransitionSeries.Sequence>
			<TransitionSeries.Transition
				timing={t}
				presentation={clockWipe({width: 1920, height: 1080})}
			/>
			<TransitionSeries.Sequence durationInFrames={160}>
				<Progress />
			</TransitionSeries.Sequence>
			<TransitionSeries.Transition
				timing={springTiming({config: {damping: 200}, durationInFrames: 20})}
				presentation={flip()}
			/>
			<TransitionSeries.Sequence durationInFrames={160}>
				<Outro />
			</TransitionSeries.Sequence>
		</TransitionSeries>
	);
};
