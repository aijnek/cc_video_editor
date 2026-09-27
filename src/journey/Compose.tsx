// ラーニングジャーニー 5/7: シーンの並べ方とタイミング
// 小さな画面には MyComp.tsx の実物 (Kinetic と、MyComp 本体の fade の瞬間) を描画している
import {Loop, Sequence, useCurrentFrame} from 'remotion';
import {Kinetic, MyComp} from '../MyComp';
import narration from '../narration/Compose.json';
import {
	ACCENT,
	Code,
	MONO,
	NARRATION_START,
	NARRATION_TAIL,
	narratedVideo,
	NextUp,
	Scene,
	Screen,
	SeriesTitle,
	Thumb,
	useFadeIn,
	usePop,
} from './ui';

type Row = {label: string; from: number; dur: number; color: string; dashed?: boolean};

// 横軸 = フレーム。rows の各バーを from〜from+dur の位置に描く
const Timeline: React.FC<{total: number; width: number; rows: Row[]; playhead?: number; rowHeight?: number}> = ({
	total,
	width,
	rows,
	playhead,
	rowHeight = 56,
}) => {
	const x = (f: number) => (f / total) * width;
	return (
		<div style={{position: 'relative', width, height: rows.length * (rowHeight + 10) + 40}}>
			{rows.map((r, i) => (
				<div
					key={i}
					style={{
						position: 'absolute',
						left: x(r.from),
						top: i * (rowHeight + 10),
						width: x(r.dur),
						height: rowHeight,
						borderRadius: 10,
						background: r.dashed ? 'transparent' : `${r.color}33`,
						border: `3px ${r.dashed ? 'dashed' : 'solid'} ${r.color}`,
						display: 'flex',
						alignItems: 'center',
						padding: '0 12px',
						fontFamily: MONO,
						fontSize: 24,
						whiteSpace: 'nowrap',
						overflow: 'hidden',
						boxSizing: 'border-box',
					}}
				>
					{r.label}
				</div>
			))}
			<div style={{position: 'absolute', left: 0, right: 0, bottom: 20, height: 3, background: '#334155'}} />
			<div style={{position: 'absolute', left: 0, bottom: -14, fontSize: 24, color: '#94a3b8', fontFamily: MONO}}>0</div>
			<div style={{position: 'absolute', right: 0, bottom: -14, fontSize: 24, color: '#94a3b8', fontFamily: MONO}}>{total}</div>
			{playhead !== undefined ? (
				<div style={{position: 'absolute', left: x(playhead), top: -10, bottom: 10, width: 4, background: ACCENT}} />
			) : null}
		</div>
	);
};

const Title: React.FC = () => <SeriesTitle current="Compose" subtitle="いつ出して、いつ消すか" />;

// 1. Sequence: 出すタイミングを決める箱
const SequenceBasics: React.FC = () => {
	const frame = useCurrentFrame();
	const g = Math.max(0, frame - 120) % 60;
	const inside = g >= 10 && g < 30;
	const show = usePop(120);
	return (
		<Scene title="Sequence: 出すタイミングを決める箱">
			<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40}}>
				<Code
					lines={['<Sequence from={10} durationInFrames={20}>', '  <Child />  {/* useCurrentFrame() は 0〜19 */}', '</Sequence>']}
					highlight={frame > 330 ? [1] : [0]}
					fontSize={34}
				/>
				<div style={{opacity: show, display: 'flex', alignItems: 'center', gap: 70}}>
					<Timeline
						total={60}
						width={900}
						rows={[{label: 'Sequence', from: 10, dur: 20, color: '#60a5fa'}]}
						playhead={g}
					/>
					<div style={{fontFamily: MONO, fontSize: 36, lineHeight: 1.7}}>
						<div>
							全体の frame = <span style={{color: ACCENT}}>{g}</span>
						</div>
						<div style={{color: inside ? '#fff' : '#475569'}}>
							Sequence の中 = <span style={{color: inside ? '#60a5fa' : '#475569'}}>{inside ? g - 10 : '(表示されない)'}</span>
						</div>
					</div>
				</div>
			</div>
		</Scene>
	);
};

// 2. 実例: Kinetic は単語ごとに 12 フレームずつずらす
const KINETIC_START = 150;
const KineticExample: React.FC = () => {
	const frame = useCurrentFrame();
	const f = Math.max(0, frame - KINETIC_START);
	const words = ['文字を', '1語ずつ', '動かす', 'ことも', '簡単'];
	return (
		<Scene title="実例: 1 語ずつ登場をずらす" caption={'layout="none" を付けると、Sequence が中身を画面全体に広げずに、文章の中に並べられる。'}>
			<div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 60}}>
				<div style={{display: 'flex', flexDirection: 'column', gap: 30}}>
					<Code
						label="src/MyComp.tsx の Kinetic"
						lines={['{WORDS.map((w, i) => (', '  <Sequence from={i * 12} layout="none">', '    <Word text={w.text} color={w.color} />', '  </Sequence>', '))}']}
						highlight={frame > 100 ? [1] : []}
						fontSize={28}
					/>
					<Timeline
						total={90}
						width={760}
						rowHeight={36}
						rows={words.map((w, i) => ({label: w, from: i * 12, dur: 90 - i * 12, color: '#f472b6'}))}
						playhead={Math.min(90, f)}
					/>
				</div>
				<div style={{textAlign: 'center'}}>
					<Screen width={820}>
						<Sequence from={KINETIC_START}>
							<Kinetic />
						</Sequence>
					</Screen>
					<div style={{fontFamily: MONO, fontSize: 28, marginTop: 12, color: '#94a3b8'}}>Kinetic の frame = {f}</div>
				</div>
			</div>
		</Scene>
	);
};

// 3. TransitionSeries: 重ねながらつなぐ
const Transitions: React.FC = () => {
	const screen = usePop(170);
	const series = usePop(360);
	return (
		<Scene title="TransitionSeries: 重ねながらつなぐ">
			<div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 60}}>
				<Code
					label="src/MyComp.tsx の MyComp (抜粋)"
					lines={[
						'<TransitionSeries>',
						'  <TransitionSeries.Sequence durationInFrames={160}>',
						'    <Intro />',
						'  </TransitionSeries.Sequence>',
						'  <TransitionSeries.Transition',
						'    timing={linearTiming({durationInFrames: 20})}',
						'    presentation={fade()} />',
						'  <TransitionSeries.Sequence durationInFrames={170}>',
						'    <Kinetic />',
						'  …',
					]}
					highlight={[4, 5, 6]}
					fontSize={26}
				/>
				<div style={{display: 'flex', flexDirection: 'column', gap: 24, alignItems: 'center'}}>
					<div style={{opacity: screen, textAlign: 'center'}}>
						{/* MyComp の 120〜180 フレーム (Intro → fade → Kinetic) を繰り返し再生 */}
						<Screen width={720}>
							<Loop durationInFrames={60}>
								<Sequence from={-120}>
									<MyComp />
								</Sequence>
							</Loop>
						</Screen>
						<div style={{fontSize: 28, marginTop: 10, color: '#94a3b8'}}>fade で重なる瞬間 (MyComp の 120〜180 フレーム)</div>
					</div>
					<div style={{fontSize: 32, opacity: series}}>
						重ねずに並べるだけなら <span style={{fontFamily: MONO, color: ACCENT}}>{'<Series>'}</span>
					</div>
				</div>
			</div>
		</Scene>
	);
};

// 4. 長さの計算: 重なる分だけ短くなる
const MYCOMP_SCENES = [
	{name: 'Intro', dur: 160},
	{name: 'Kinetic', dur: 170},
	{name: 'BarChart', dur: 190},
	{name: 'Particles', dur: 160},
	{name: 'Progress', dur: 160},
	{name: 'Outro', dur: 160},
];
const MYCOMP_ROWS: Row[] = MYCOMP_SCENES.map((s, i) => ({
	label: s.name,
	from: MYCOMP_SCENES.slice(0, i).reduce((sum, p) => sum + p.dur - 20, 0),
	dur: s.dur,
	color: ['#60a5fa', '#f472b6', '#34d399', '#a78bfa', '#fbbf24', '#fb923c'][i],
}));

const Duration: React.FC = () => {
	const formula = useFadeIn(260);
	return (
		<Scene title="重なる分だけ、全体は短くなる" caption="MyComp の 6 シーンとトランジション (各 20 フレーム) の配置。">
			<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40}}>
				<Timeline
					total={900}
					width={1600}
					rowHeight={44}
					rows={MYCOMP_ROWS.map((r, i) => ({...r, label: usePop(60 + i * 20) > 0.5 ? r.label : ''}))}
				/>
				<div style={{fontFamily: MONO, fontSize: 40, opacity: formula}}>
					160+170+190+160+160+160 = 1000 − 20 × 5 ={' '}
					<span style={{color: ACCENT, fontWeight: 800}}>900 フレーム (30 秒)</span>
				</div>
			</div>
		</Scene>
	);
};

// 5. このシリーズでは、シーンの長さをナレーションから決める
const BASE = 240;

const FromNarration: React.FC = () => {
	const examples = [1, 3, 5].map((i) => ({i, audio: narration[i].frames}));
	const max = Math.max(...examples.map((e) => NARRATION_START + e.audio + NARRATION_TAIL), BASE) + 40;
	const scale = (f: number) => (f / max) * 1300;
	return (
		<Scene
			title="このシリーズ: 長さはナレーションから決まる"
			caption="この動画のシーンの例。黄色の線 = 決めておいた長さ (240 フレーム)。長いほうがシーンの長さになる。"
		>
			<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40}}>
				<Code
					label="src/journey/ui.tsx の narratedVideo"
					lines={['duration: Math.max(base, NARRATION_START + narration[i].frames + NARRATION_TAIL)']}
					fontSize={30}
				/>
				<div style={{display: 'flex', flexDirection: 'column', gap: 18}}>
					{examples.map((e, k) => {
						const p = usePop(120 + k * 30);
						return (
							<div key={e.i} style={{display: 'flex', alignItems: 'center', gap: 24, opacity: p}}>
								<div style={{width: 200, fontSize: 30, color: '#94a3b8'}}>シーン {e.i + 1}</div>
								<div style={{position: 'relative', height: 56, width: 1300, display: 'flex'}}>
									<div style={{width: scale(NARRATION_START), background: '#475569'}} />
									<div
										style={{
											width: scale(e.audio),
											background: '#a78bfa',
											display: 'flex',
											alignItems: 'center',
											paddingLeft: 12,
											fontSize: 24,
											whiteSpace: 'nowrap',
										}}
									>
										ナレーション {e.audio}f
									</div>
									<div style={{width: scale(NARRATION_TAIL), background: '#475569'}} />
									<div style={{position: 'absolute', left: scale(BASE), top: -8, bottom: -8, width: 4, background: ACCENT}} />
								</div>
							</div>
						);
					})}
				</div>
				<div style={{display: 'flex', gap: 40, fontSize: 28, color: '#94a3b8'}}>
					<span>
						<span style={{color: '#475569'}}>■</span> 前後の余白 (10f / 30f)
					</span>
					<span>
						<span style={{color: '#a78bfa'}}>■</span> 音声の長さ
					</span>
				</div>
			</div>
		</Scene>
	);
};

// 6. 入れ子の落とし穴: 子は親の長さを超えて表示されない
const Nesting: React.FC = () => {
	const bad = usePop(60);
	const why = usePop(300);
	return (
		<Scene title="注意: 子は親の長さを超えて表示されない">
			<div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 70}}>
				<div style={{display: 'flex', flexDirection: 'column', gap: 30, opacity: bad}}>
					<Code
						label="3 本目で最初に試した方法"
						lines={['<Sequence durationInFrames={300}>  {/* 親: シーン */}', '  <Freeze frame={600}>', '    <MyComp />  {/* 中のシーンは 600f 以降 */}', '  </Freeze>', '</Sequence>']}
						fontSize={28}
					/>
					<Timeline
						total={900}
						width={900}
						rowHeight={44}
						rows={[
							{label: '親 (300f)', from: 0, dur: 300, color: '#60a5fa'},
							{label: '子 (600f〜)', from: 600, dur: 160, color: '#f87171', dashed: true},
						]}
					/>
					<div style={{fontSize: 32, color: '#f87171', fontWeight: 800}}>親の 300f を超える子は描かれない</div>
				</div>
				<div style={{textAlign: 'center', opacity: why}}>
					<div style={{fontSize: 32, marginBottom: 16}}>だから事前に書き出した静止画を使う</div>
					<Thumb frame={600} width={560} />
					<div style={{fontFamily: MONO, fontSize: 28, marginTop: 12, color: '#94a3b8'}}>public/mycomp/600.jpeg</div>
				</div>
			</div>
		</Scene>
	);
};

// 7. 次のステップ
const Next: React.FC = () => (
	<NextUp
		current="Compose"
		files={[
			{path: 'src/journey/ui.tsx', note: 'narratedVideo: シーンと音声を並べる関数'},
			{path: 'src/MyComp.tsx の MyComp', note: 'TransitionSeries の実例'},
		]}
	/>
);

export const {Video: Compose, durationInFrames: COMPOSE_DURATION} = narratedVideo(
	[
		[Title, 240],
		[SequenceBasics, BASE],
		[KineticExample, BASE],
		[Transitions, BASE],
		[Duration, BASE],
		[FromNarration, BASE],
		[Nesting, BASE],
		[Next, BASE],
	],
	narration,
);
