// ラーニングジャーニー 2/7: React 最小限入門
// 右側のプレビューには MyComp.tsx の実物のコンポーネント (ApiLabel / Word) を描画している
import {Sequence, useCurrentFrame} from 'remotion';
import {ApiLabel, Word, WORDS} from '../MyComp';
import narration from '../narration/ReactBasics.json';
import {ACCENT, Arrow, Box, Code, MONO, narratedVideo, NextUp, Scene, SeriesTitle, useFadeIn, usePop} from './ui';

// ApiLabel は親の左下に絶対配置されるので、位置の基準になる枠に入れて見せる
const Preview: React.FC<{children: React.ReactNode; width?: number; height?: number; opacity?: number}> = ({
	children,
	width = 640,
	height = 180,
	opacity = 1,
}) => (
	<div
		style={{
			position: 'relative',
			width,
			height,
			borderRadius: 16,
			background: 'linear-gradient(135deg, #1e3a8a, #7c3aed)',
			overflow: 'hidden',
			opacity,
		}}
	>
		{children}
	</div>
);

const Note: React.FC<{children: React.ReactNode; opacity: number; color?: string}> = ({
	children,
	opacity,
	color = ACCENT,
}) => (
	<div style={{fontSize: 34, fontWeight: 800, color, opacity, transform: `translateX(${(1 - opacity) * 20}px)`}}>
		{children}
	</div>
);

const Title: React.FC = () => <SeriesTitle current="ReactBasics" subtitle="コードを読むための最低限" />;

// 1. コンポーネント = 見た目を返す関数
const APILABEL_CODE = [
	'const ApiLabel = ({text}) => {',
	'  return (',
	'    <div style={{...}}>',
	'      {text}',
	'    </div>',
	'  );',
	'};',
];

const ComponentIsFunction: React.FC = () => {
	const frame = useCurrentFrame();
	const hl = frame < 150 ? [] : frame < 230 ? [0, 6] : frame < 290 ? [0] : [1, 2, 3, 4, 5];
	const preview = usePop(350);
	return (
		<Scene
			title="コンポーネント = 見た目を返す関数"
			caption="受け取った値 (text) をもとに、見た目 (div) を返す。"
		>
			<div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 50, height: '100%'}}>
				<div>
					<Code lines={APILABEL_CODE} label="src/MyComp.tsx (簡略化)" highlight={hl} fontSize={38} />
					<div style={{display: 'flex', gap: 30, marginTop: 20, height: 50}}>
						<Note opacity={useFadeIn(150)}>関数</Note>
						<Note opacity={useFadeIn(230)}>({'{text}'}) = 受け取る値</Note>
						<Note opacity={useFadeIn(290)}>return = 見た目</Note>
					</div>
				</div>
				<Arrow opacity={preview} />
				<Preview opacity={preview}>
					<ApiLabel text="spring() / interpolate()" />
				</Preview>
			</div>
		</Scene>
	);
};

// 2. JSX: HTML に似た書き方 + { } で JavaScript の値
const JSXScene: React.FC = () => {
	const tag = useFadeIn(170);
	const value = useFadeIn(300);
	const outer = useFadeIn(420);
	const inner = useFadeIn(470);
	const big = {fontFamily: MONO, fontSize: 56, whiteSpace: 'pre' as const};
	const mark = (on: number, color: string) => ({
		color: on > 0.5 ? color : '#e2e8f0',
		background: on > 0.5 ? `${color}22` : 'transparent',
		borderRadius: 8,
	});
	return (
		<Scene title="JSX: HTML に似た書き方" caption="CSS の font-size は、JSX では fontSize (単語の区切りを大文字に) と書く。">
			<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 50, marginTop: 70}}>
				<div style={big}>
					<span style={mark(tag, '#60a5fa')}>{'<div'}</span>
					{' style='}
					<span style={mark(outer, '#f472b6')}>{'{'}</span>
					<span style={mark(inner, '#34d399')}>{'{fontSize: 32}'}</span>
					<span style={mark(outer, '#f472b6')}>{'}'}</span>
					<span style={mark(tag, '#60a5fa')}>{'>'}</span>
					<span style={mark(value, ACCENT)}>{'{text}'}</span>
					<span style={mark(tag, '#60a5fa')}>{'</div>'}</span>
				</div>
				<div style={{display: 'flex', gap: 60}}>
					<Note opacity={tag} color="#60a5fa">
						{'<div> … </div>'} = HTML と同じタグ
					</Note>
					<Note opacity={value}>{'{text}'} = JavaScript の値を埋め込む</Note>
				</div>
				<div style={{display: 'flex', gap: 60}}>
					<Note opacity={outer} color="#f472b6">
						外側の {'{ }'} = 値を入れる印
					</Note>
					<Note opacity={inner} color="#34d399">
						内側の {'{ }'} = オブジェクト
					</Note>
				</div>
			</div>
		</Scene>
	);
};

// 3. props: コンポーネントに渡す値
const LABELS = ['spring() / interpolate()', '<Sequence from={...}>', "random('seed') + <svg>"];

const Props: React.FC = () => {
	const fn = useFadeIn(400);
	return (
		<Scene title="props: コンポーネントに渡す値">
			<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22, marginTop: 20}}>
				{LABELS.map((t, i) => {
					const p = usePop(120 + i * 80);
					return (
						<div key={t} style={{display: 'flex', alignItems: 'center', gap: 30, opacity: p}}>
							<div style={{fontFamily: MONO, fontSize: 30, width: 860, whiteSpace: 'pre'}}>
								{'<ApiLabel '}
								<span style={{color: ACCENT}}>{`text="${t}"`}</span>
								{' />'}
							</div>
							<div style={{fontSize: 50, color: '#64748b'}}>→</div>
							<Preview width={620} height={120}>
								<ApiLabel text={t} />
							</Preview>
						</div>
					);
				})}
				<div style={{fontSize: 38, marginTop: 20, opacity: fn}}>
					関数の引数と同じ:{' '}
					<span style={{fontFamily: MONO, color: ACCENT}}>ApiLabel({'{'}text: "…"{'}'})</span>
				</div>
			</div>
		</Scene>
	);
};

// 4. 組み合わせ: タグのように書いて入れ子にする
const TREE: {name: string; depth: number; note?: string}[] = [
	{name: '<MyComp>', depth: 0, note: '動画全体'},
	{name: '<TransitionSeries>', depth: 1, note: 'シーンを順番に並べる'},
	{name: '<Intro>', depth: 2},
	{name: '<Kinetic>', depth: 2},
	{name: '<Word> × 5', depth: 3},
	{name: '<ApiLabel>', depth: 3},
	{name: '<BarChart>', depth: 2},
	{name: '…', depth: 2},
];

const Compose: React.FC = () => {
	const code = usePop(20);
	return (
		<Scene title="部品を組み合わせる" caption="自分で作ったコンポーネントも、HTML のタグと同じように書ける。">
			<div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 80, height: '100%'}}>
				<div style={{opacity: code}}>
					<Code
						label="src/MyComp.tsx の Kinetic (簡略化)"
						lines={['<AbsoluteFill>', '  <Word text="文字を" … />', '  <Word text="1語ずつ" … />', '  …', '  <ApiLabel text="…" />', '</AbsoluteFill>']}
						fontSize={32}
					/>
				</div>
				<Arrow opacity={usePop(150)} />
				<div style={{display: 'flex', flexDirection: 'column', gap: 10}}>
					{TREE.map((n, i) => {
						const p = usePop(170 + i * 14);
						const on = n.name === '<Kinetic>' || n.depth === 3;
						return (
							<div
								key={n.name}
								style={{
									marginLeft: n.depth * 60,
									display: 'flex',
									alignItems: 'baseline',
									gap: 20,
									opacity: p,
									transform: `translateX(${(1 - p) * 30}px)`,
								}}
							>
								<span
									style={{
										fontFamily: MONO,
										fontSize: 34,
										padding: '4px 16px',
										borderRadius: 10,
										border: `3px solid ${on ? ACCENT : '#475569'}`,
									}}
								>
									{n.name}
								</span>
								{n.note ? <span style={{fontSize: 28, color: '#94a3b8'}}>{n.note}</span> : null}
							</div>
						);
					})}
				</div>
			</div>
		</Scene>
	);
};

// 5. 繰り返し: 配列の map
const MAP_CODE = [
	'const WORDS = [',
	"  {text: '文字を', color: '#fde68a'},",
	"  {text: '1語ずつ', color: '#fca5a5'},",
	'  …',
	'];',
	'',
	'{WORDS.map((w) => (',
	'  <Word key={w.text}',
	'        text={w.text} color={w.color} />',
	'))}',
];

const MapScene: React.FC = () => {
	const frame = useCurrentFrame();
	const hl = frame < 120 ? [] : frame < 380 ? [6, 7, 8, 9] : [7];
	return (
		<Scene
			title="同じ部品を並べる: map"
			caption="実際の Kinetic では、Sequence で 1 語ずつ登場をずらしている (5 本目で説明)。"
		>
			<div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 50, height: '100%'}}>
				<div>
					<Code lines={MAP_CODE} label="src/MyComp.tsx (簡略化)" highlight={hl} fontSize={30} />
					<div style={{height: 50, marginTop: 16}}>
						<Note opacity={useFadeIn(380)}>key = 要素を見分ける目印</Note>
					</div>
				</div>
				<Arrow opacity={usePop(200)} />
				<Box
					color="#475569"
					style={{
						width: 820,
						height: 260,
						background: '#0f172a',
						display: 'flex',
						flexWrap: 'wrap',
						alignItems: 'center',
						justifyContent: 'center',
						fontSize: 64,
						fontWeight: 800,
					}}
				>
					{WORDS.map((w, i) => (
						<Sequence key={w.text} from={200 + i * 12} layout="none">
							<Word text={w.text} color={w.color} />
						</Sequence>
					))}
				</Box>
			</div>
		</Scene>
	);
};

// 6. フック: use で始まる関数
const Hooks: React.FC = () => {
	const frame = useCurrentFrame();
	const counter = usePop(150);
	const bar = useFadeIn(270);
	const ng = usePop(380);
	return (
		<Scene title="フック: use で始まる関数" caption="useCurrentFrame() の使い方は 4 本目「フレームで動きをつける」で詳しく。">
			<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 44, marginTop: 30}}>
				<div style={{display: 'flex', alignItems: 'center', gap: 50}}>
					<Code lines={['const frame = useCurrentFrame();']} fontSize={40} />
					<Arrow opacity={counter} />
					<div style={{fontFamily: MONO, fontSize: 56, opacity: counter}}>
						frame = <span style={{color: ACCENT}}>{frame}</span>
					</div>
				</div>
				<div style={{display: 'flex', alignItems: 'center', gap: 30, opacity: bar}}>
					<div style={{fontFamily: MONO, fontSize: 32, color: '#cbd5e1', width: 560}}>
						{'width: frame * 2 (例)'}
					</div>
					<div style={{width: 900, height: 40, background: '#1e293b', borderRadius: 10}}>
						<div style={{width: Math.min(900, Math.max(0, (frame - 270) * 2)), height: 40, background: ACCENT, borderRadius: 10}} />
					</div>
				</div>
				<div style={{display: 'flex', gap: 40, alignItems: 'center', opacity: ng}}>
					{['useState', 'onClick'].map((t) => (
						<div
							key={t}
							style={{
								fontFamily: MONO,
								fontSize: 40,
								padding: '8px 28px',
								borderRadius: 12,
								border: '3px solid #f87171',
								color: '#f87171',
								textDecoration: 'line-through',
							}}
						>
							{t}
						</div>
					))}
					<div style={{fontSize: 34, color: '#f87171', fontWeight: 800}}>クリックなどの操作は使わない</div>
				</div>
			</div>
		</Scene>
	);
};

// 7. 次のステップ
const Next: React.FC = () => (
	<NextUp
		current="ReactBasics"
		files={[
			{path: 'src/MyComp.tsx', note: 'ApiLabel と Word を探す'},
			{path: 'src/MyComp.tsx の Kinetic', note: 'WORDS.map で Word を並べている箇所'},
		]}
	/>
);

export const {Video: ReactBasics, durationInFrames: REACT_BASICS_DURATION} = narratedVideo(
	[
		[Title, 240],
		[ComponentIsFunction, 240],
		[JSXScene, 240],
		[Props, 240],
		[Compose, 240],
		[MapScene, 240],
		[Hooks, 240],
		[Next, 240],
	],
	narration,
);
