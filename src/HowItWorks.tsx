import {AbsoluteFill, interpolate, random, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {clamp, FONT} from './MyComp';
import {ACCENT, Arrow, BG, Box, MONO, narratedVideo, Scene, Thumb, useFadeIn, usePop} from './journey/ui';
import narration from './narration/HowItWorks.json';

// 前回つくったサンプル動画 (MyComp) を解説対象にする。
// 数値は `npx remotion render --log=verbose` の実ログ (v4.0.529 / この Mac) に基づく。

const TAB_COLORS = ['#60a5fa', '#f472b6', '#34d399', '#fbbf24', '#a78bfa', '#fb923c'];

// 0. タイトル
const Title: React.FC = () => {
	const p = usePop(0);
	const sub = useFadeIn(25);
	return (
		<AbsoluteFill
			style={{
				background: 'linear-gradient(135deg, #0b1020, #1e3a8a)',
				justifyContent: 'center',
				alignItems: 'center',
				color: '#fff',
				fontFamily: FONT,
				gap: 30,
			}}
		>
			<div style={{fontSize: 120, fontWeight: 800, transform: `scale(${0.8 + p * 0.2})`, opacity: p}}>
				Remotion の裏側
			</div>
			<div style={{fontSize: 56, opacity: sub, color: '#cbd5e1'}}>
				React のコードが MP4 になるまで
			</div>
		</AbsoluteFill>
	);
};

// 1. 基本の考え方: frame 番号 → 1枚の絵
const FrameIdea: React.FC = () => {
	const frame = useCurrentFrame();
	const n = Math.floor(interpolate(frame, [30, 260], [0, 29], clamp)) * 30;
	const strip = [0, 150, 300, 450, 600, 750, 870];
	return (
		<Scene
			step="基本"
			title="動画 = 静止画のパラパラ漫画"
			caption="1秒 = 30枚。Remotion は frame 番号を React コンポーネントに渡し、その番号の「1枚の絵」を描かせる。"
		>
			<div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 50, marginTop: 20}}>
				<Box color="#60a5fa" style={{fontFamily: MONO, fontSize: 50}}>
					<div style={{color: '#94a3b8', fontSize: 34, marginBottom: 10}}>useCurrentFrame()</div>
					frame = <span style={{color: ACCENT}}>{String(n).padStart(3, ' ')}</span>
				</Box>
				<Arrow />
				<Box color="#60a5fa" style={{fontFamily: MONO, fontSize: 50}}>
					&lt;MyComp /&gt;
				</Box>
				<Arrow />
				<Thumb frame={n} width={640} />
			</div>
			<div style={{display: 'flex', justifyContent: 'center', gap: 16, marginTop: 50}}>
				{strip.map((f, i) => {
					const o = interpolate(frame, [30 + i * 30, 45 + i * 30], [0, 1], clamp);
					return (
						<div key={f} style={{opacity: o, textAlign: 'center'}}>
							<Thumb frame={f} width={220} />
							<div style={{fontFamily: MONO, fontSize: 26, color: '#94a3b8', marginTop: 6}}>frame {f}</div>
						</div>
					);
				})}
			</div>
		</Scene>
	);
};

// 2. 全体の流れ
const STEPS = [
	{no: '①', name: 'バンドル', tool: 'webpack'},
	{no: '②', name: 'ブラウザで開く', tool: 'Chrome Headless'},
	{no: '③', name: '設定を読む', tool: '<Composition>'},
	{no: '④', name: '1枚ずつ撮影', tool: '6タブ並列'},
	{no: '⑤', name: '動画に変換', tool: 'FFmpeg'},
];

const Pipeline: React.FC = () => {
	const frame = useCurrentFrame();
	const active = Math.floor(interpolate(frame, [150, 340], [0, STEPS.length], clamp));
	return (
		<Scene
			title="npx remotion render の全体像"
			caption="コマンド1つで、この5段階が順番に走る。Remotion の正体は「ブラウザで描いて、撮って、つなぐ」仕組み。"
		>
			<div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, height: '100%'}}>
				{STEPS.map((s, i) => {
					const p = usePop(i * 8);
					const on = i === active;
					return (
						<div key={s.no} style={{display: 'flex', alignItems: 'center', gap: 12}}>
							<Box
								color={on ? ACCENT : '#334155'}
								style={{
									width: 290,
									height: 260,
									display: 'flex',
									flexDirection: 'column',
									justifyContent: 'center',
									alignItems: 'center',
									gap: 16,
									opacity: p,
									transform: `translateY(${(1 - p) * 40}px) scale(${on ? 1.08 : 1})`,
									background: on ? 'rgba(251,191,36,0.12)' : 'rgba(255,255,255,0.04)',
								}}
							>
								<div style={{fontSize: 60, color: on ? ACCENT : '#94a3b8'}}>{s.no}</div>
								<div style={{fontSize: 38, fontWeight: 800, whiteSpace: 'nowrap'}}>{s.name}</div>
								<div style={{fontSize: 26, fontFamily: MONO, color: '#94a3b8', whiteSpace: 'nowrap'}}>{s.tool}</div>
							</Box>
							{i < STEPS.length - 1 ? <Arrow opacity={p} /> : null}
						</div>
					);
				})}
			</div>
		</Scene>
	);
};

// 3. バンドル → ブラウザで開く
const FILES = ['src/index.ts', 'src/Root.tsx', 'src/MyComp.tsx', 'react', 'remotion'];

const Bundle: React.FC = () => {
	const frame = useCurrentFrame();
	const bundled = usePop(120);
	const opened = usePop(210);
	return (
		<Scene
			step="① ②"
			title="バンドルして、画面のない Chrome で開く"
			caption="自分のコードとライブラリを1つの Web ページにまとめ、ローカルサーバーから Chrome Headless Shell（画面なし Chrome）で開く。"
		>
			<div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 40, height: '100%'}}>
				<div style={{display: 'flex', flexDirection: 'column', gap: 16}}>
					{FILES.map((f, i) => {
						const inP = usePop(i * 6);
						const move = interpolate(frame, [60 + i * 4, 90], [0, 1], clamp);
						return (
							<div
								key={f}
								style={{
									fontFamily: MONO,
									fontSize: 32,
									padding: '10px 20px',
									borderRadius: 10,
									background: i < 3 ? '#1e3a8a' : '#3f3f46',
									opacity: inP * (1 - move * 0.7),
									transform: `translateX(${move * 120}px)`,
								}}
							>
								{f}
							</div>
						);
					})}
				</div>
				<Arrow />
				<Box color="#60a5fa" style={{fontSize: 44, fontWeight: 800, textAlign: 'center'}}>
					webpack
					<div style={{fontSize: 28, fontWeight: 400, color: '#94a3b8', marginTop: 8}}>まとめる</div>
				</Box>
				<Arrow opacity={bundled} />
				<div style={{opacity: bundled, transform: `scale(${0.8 + bundled * 0.2})`, fontFamily: MONO, fontSize: 32}}>
					<Box color="#34d399">
						index.html
						<br />
						bundle.js
					</Box>
				</div>
				<Arrow opacity={opened} />
				<div
					style={{
						opacity: opened,
						width: 460,
						borderRadius: 16,
						overflow: 'hidden',
						border: '4px solid #475569',
					}}
				>
					<div style={{background: '#334155', padding: '10px 16px', fontFamily: MONO, fontSize: 24, color: '#cbd5e1'}}>
						● ● ●  localhost:3000
					</div>
					<div style={{padding: 28, fontSize: 34, background: '#111827', textAlign: 'center'}}>
						Chrome
						<br />
						Headless Shell
						<div style={{fontSize: 24, color: '#94a3b8', marginTop: 8}}>画面に出さないブラウザ</div>
					</div>
				</div>
			</div>
		</Scene>
	);
};

// 4. <Composition> から撮影条件を読む
const CODE_LINES = [
	'<Composition',
	'  id="MyComp"',
	'  width={1920}',
	'  height={1080}',
	'  fps={30}',
	'  durationInFrames={900}',
	'/>',
];

const INFO = [
	{k: 'id', v: 'MyComp'},
	{k: 'サイズ', v: '1920 × 1080'},
	{k: 'fps', v: '30 枚/秒'},
	{k: '長さ', v: '900 フレーム'},
];

const ReadComposition: React.FC = () => {
	const frame = useCurrentFrame();
	const hl = Math.floor(interpolate(frame, [90, 330], [1, 6], clamp));
	const result = usePop(360);
	return (
		<Scene
			step="③"
			title="Root.tsx から撮影条件を読み取る"
			caption="ページ内の <Composition> を評価して「どのサイズで・何枚撮るか」を決める。これが撮影の設計図になる。"
		>
			<div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 60, height: '100%'}}>
				<Box color="#475569" style={{fontFamily: MONO, fontSize: 38, lineHeight: 1.6}}>
					{CODE_LINES.map((l, i) => (
						<div
							key={l}
							style={{
								color: i === hl ? ACCENT : '#e2e8f0',
								background: i === hl ? 'rgba(251,191,36,0.12)' : 'transparent',
								padding: '0 10px',
								whiteSpace: 'pre',
							}}
						>
							{l}
						</div>
					))}
				</Box>
				<Arrow />
				<div style={{display: 'flex', flexDirection: 'column', gap: 18}}>
					{INFO.map((row, i) => {
						const o = interpolate(frame, [120 + i * 45, 135 + i * 45], [0, 1], clamp);
						return (
							<div key={row.k} style={{display: 'flex', gap: 20, fontSize: 42, opacity: o}}>
								<div style={{width: 160, color: '#94a3b8'}}>{row.k}</div>
								<div style={{fontWeight: 800}}>{row.v}</div>
							</div>
						);
					})}
					<div
						style={{
							marginTop: 20,
							fontSize: 52,
							fontWeight: 800,
							color: ACCENT,
							opacity: result,
							transform: `scale(${0.8 + result * 0.2})`,
						}}
					>
						→ 900 枚撮影すればよい
					</div>
				</div>
			</div>
		</Scene>
	);
};

// 5. 複数タブで並列に撮影する
const TABS = 6;
const JOB_COUNT = 36;
const JOB_START = 30;

// 空いたタブから順に次のフレームを取りに行く、という動きをシミュレーションする
const JOBS = (() => {
	const free = new Array(TABS).fill(JOB_START);
	const jobs: {frame: number; tab: number; start: number; end: number}[] = [];
	for (let f = 0; f < JOB_COUNT; f++) {
		let tab = 0;
		for (let i = 1; i < TABS; i++) if (free[i] < free[tab]) tab = i;
		const start = free[tab];
		const end = start + 28 + Math.floor(random(`job-${f}`) * 22);
		jobs.push({frame: f, tab, start, end});
		free[tab] = end + 2;
	}
	return jobs;
})();

const phaseLabel = (p: number) =>
	p < 0.33 ? 'frame をセット' : p < 0.66 ? '描画完了を待つ' : 'スクリーンショット';

const Capture: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	return (
		<Scene
			step="④"
			title="6つのタブで同時に1枚ずつ撮影"
			caption="各タブが「frame を設定 → 描画完了を待つ → 撮影」を繰り返し、JPEG として保存。空いたタブが次の番号を取るので、完成順はバラバラ。"
		>
			<div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 80, height: '100%'}}>
				<div style={{display: 'flex', flexDirection: 'column', gap: 18}}>
					{new Array(TABS).fill(0).map((_, tab) => {
						const job = JOBS.find((j) => j.tab === tab && j.start <= frame && frame < j.end);
						const p = job ? (frame - job.start) / (job.end - job.start) : 0;
						return (
							<div key={tab} style={{display: 'flex', alignItems: 'center', gap: 20, fontSize: 32}}>
								<div style={{width: 110, fontFamily: MONO, color: TAB_COLORS[tab], fontWeight: 800}}>Tab {tab}</div>
								<div
									style={{
										width: 560,
										height: 64,
										borderRadius: 12,
										background: '#1e293b',
										position: 'relative',
										overflow: 'hidden',
									}}
								>
									<div
										style={{
											position: 'absolute',
											inset: 0,
											width: `${p * 100}%`,
											background: TAB_COLORS[tab],
											opacity: 0.35,
										}}
									/>
									<div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', padding: '0 20px', gap: 20}}>
										{job ? (
											<>
												<span style={{fontFamily: MONO, fontWeight: 800}}>frame {job.frame}</span>
												<span style={{color: '#cbd5e1'}}>{phaseLabel(p)}</span>
											</>
										) : (
											<span style={{color: '#64748b'}}>待機中</span>
										)}
									</div>
								</div>
							</div>
						);
					})}
				</div>
				<div style={{display: 'grid', gridTemplateColumns: 'repeat(6, 100px)', gap: 12}}>
					{JOBS.map((j) => {
						const p = spring({fps, frame: frame - j.end, config: {damping: 200}});
						return (
							<div
								key={j.frame}
								style={{
									width: 100,
									height: 72,
									borderRadius: 8,
									border: '2px dashed #334155',
									position: 'relative',
								}}
							>
								<div
									style={{
										position: 'absolute',
										inset: -2,
										borderRadius: 8,
										background: TAB_COLORS[j.tab],
										display: 'flex',
										justifyContent: 'center',
										alignItems: 'center',
										color: BG,
										fontFamily: MONO,
										fontWeight: 800,
										fontSize: 30,
										opacity: p,
										transform: `scale(${p})`,
									}}
								>
									{j.frame}
								</div>
							</div>
						);
					})}
					<div style={{gridColumn: '1 / -1', fontFamily: MONO, fontSize: 26, color: '#94a3b8', marginTop: 8}}>
						element-000.jpeg 〜 element-899.jpeg
					</div>
				</div>
			</div>
		</Scene>
	);
};

// 6. FFmpeg で連番画像を動画に変換する
const Encode: React.FC = () => {
	const frame = useCurrentFrame();
	const done = usePop(150);
	const cmd = usePop(60);
	return (
		<Scene
			step="⑤"
			title="FFmpeg で連番画像を MP4 に変換"
			caption="番号順に並んだ 900 枚の JPEG を FFmpeg が H.264 で圧縮して1本の動画にする。<Audio> がある場合は音声も別に処理して合成される。"
		>
			<div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 50, marginTop: 30}}>
				<div style={{position: 'relative', width: 340, height: 240}}>
					{new Array(8).fill(0).map((_, i) => {
						const slide = interpolate(frame, [20 + i * 12, 40 + i * 12], [0, 1], clamp);
						return (
							<div
								key={i}
								style={{
									position: 'absolute',
									left: i * 14,
									top: i * 12,
									opacity: 1 - slide,
									transform: `translateX(${slide * 300}px) scale(${1 - slide * 0.5})`,
								}}
							>
								<Thumb frame={i * 120} width={240} />
							</div>
						);
					})}
				</div>
				<Arrow />
				<Box color="#34d399" style={{fontSize: 48, fontWeight: 800, textAlign: 'center'}}>
					FFmpeg
					<div style={{fontSize: 28, fontWeight: 400, color: '#94a3b8', marginTop: 8, fontFamily: MONO}}>libx264</div>
				</Box>
				<Arrow opacity={done} />
				<div style={{opacity: done, transform: `scale(${0.7 + done * 0.3})`, textAlign: 'center'}}>
					<Thumb frame={450} width={360} />
					<div style={{fontFamily: MONO, fontSize: 36, marginTop: 12, fontWeight: 800}}>video.mp4</div>
				</div>
			</div>
			<div
				style={{
					margin: '50px auto 0',
					width: 1500,
					fontFamily: MONO,
					fontSize: 30,
					lineHeight: 1.6,
					padding: '20px 30px',
					borderRadius: 14,
					background: '#111827',
					color: '#a7f3d0',
					opacity: cmd,
				}}
			>
				<span style={{color: '#64748b'}}># 実際に実行されたコマンド（抜粋）</span>
				<br />
				ffmpeg -r 30 -f image2 -s 1920x1080 -i element-%03d.jpeg
				<br />
				{'       '}-c:v libx264 -pix_fmt yuv420p -crf 18 video.mp4
			</div>
		</Scene>
	);
};

// 7. なぜ「決定的 (deterministic)」でなければならないのか
const DOTS = new Array(14).fill(0).map((_, i) => ({x: random(`dx-${i}`), y: random(`dy-${i}`)}));

const DotBox: React.FC<{good: boolean}> = ({good}) => {
	const frame = useCurrentFrame();
	// Math.random() の再現: 描くたびに値が変わる様子を frame ごとに違う seed で表す
	const jitter = Math.floor(frame / 3);
	return (
		<div style={{textAlign: 'center'}}>
			<div style={{fontFamily: MONO, fontSize: 36, marginBottom: 14}}>
				{good ? "random('seed')" : 'Math.random()'}
			</div>
			<svg width={520} height={300} style={{background: '#111827', borderRadius: 16}}>
				{DOTS.map((d, i) => {
					const x = good ? d.x : random(`bad-x-${i}-${jitter}`);
					const y = good ? d.y : random(`bad-y-${i}-${jitter}`);
					return (
						<circle
							key={i}
							cx={30 + x * 460 + (good ? Math.sin((frame + i * 9) / 15) * 12 : 0)}
							cy={30 + y * 240}
							r={14}
							fill={TAB_COLORS[i % TAB_COLORS.length]}
						/>
					);
				})}
			</svg>
			<div style={{fontSize: 38, fontWeight: 800, marginTop: 14, color: good ? '#34d399' : '#f87171'}}>
				{good ? '○ どのタブでも同じ絵' : '× タブごとに違う絵 → チラつく'}
			</div>
		</div>
	);
};

const Deterministic: React.FC = () => {
	const logIn = useFadeIn(10);
	const boxes = useFadeIn(80);
	return (
		<Scene
			title="だから「同じ frame → 同じ絵」が必須"
			caption="フレームは別々のタブで順不同に描かれるので、前のフレームの状態 (useState) や Math.random() に頼れない。これが CLAUDE.md の禁止事項の理由。"
		>
			<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 36}}>
				<div style={{fontFamily: MONO, fontSize: 34, lineHeight: 1.6, opacity: logIn}}>
					<span style={{color: '#64748b'}}># 実際のログ: 各タブが担当したフレーム</span>
					<br />
					<span style={{color: TAB_COLORS[0]}}>Tab 0</span>: 0 → 7 → 14 → 20 …
					<br />
					<span style={{color: TAB_COLORS[1]}}>Tab 1</span>: 1 → 10 → 18 → 22 …
				</div>
				<div style={{display: 'flex', gap: 100, opacity: boxes}}>
					<DotBox good={false} />
					<DotBox good />
				</div>
			</div>
		</Scene>
	);
};

// 8. まとめ
const ROLES = [
	{who: 'React', role: '絵の設計図', desc: 'frame 番号 → 1枚の絵', color: '#60a5fa'},
	{who: 'Chrome', role: 'カメラ', desc: '1枚ずつ撮影', color: '#f472b6'},
	{who: 'FFmpeg', role: '編集機', desc: '連番画像 → MP4', color: '#34d399'},
];

const Summary: React.FC = () => {
	const note = useFadeIn(260);
	return (
		<Scene title="まとめ">
			<div style={{display: 'flex', justifyContent: 'center', gap: 50, marginTop: 40}}>
				{ROLES.map((r, i) => {
					const p = usePop(30 + i * 70);
					return (
						<Box
							key={r.who}
							color={r.color}
							style={{
								width: 460,
								textAlign: 'center',
								opacity: p,
								transform: `translateY(${(1 - p) * 50}px)`,
							}}
						>
							<div style={{fontSize: 64, fontWeight: 800, color: r.color}}>{r.who}</div>
							<div style={{fontSize: 48, fontWeight: 800, margin: '12px 0'}}>= {r.role}</div>
							<div style={{fontSize: 32, color: '#cbd5e1'}}>{r.desc}</div>
						</Box>
					);
				})}
			</div>
			<div
				style={{
					margin: '70px auto 0',
					width: 1500,
					fontSize: 38,
					lineHeight: 1.6,
					color: '#cbd5e1',
					textAlign: 'center',
					opacity: note,
				}}
			>
				ちなみに Studio のプレビューは撮影もエンコードもせず、
				<br />
				同じコンポーネントの frame を進めながらブラウザにそのまま表示しているだけ。
			</div>
		</Scene>
	);
};

// 全体構成
export const {Video: HowItWorks, durationInFrames: HOW_IT_WORKS_DURATION} = narratedVideo(
	[
		[Title, 150],
		[FrameIdea, 300],
		[Pipeline, 300],
		[Bundle, 240],
		[ReadComposition, 240],
		[Capture, 390],
		[Encode, 270],
		[Deterministic, 300],
		[Summary, 300],
	],
	narration,
);
