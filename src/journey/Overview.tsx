// ラーニングジャーニー 1/7: 全体像
import {Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {clamp} from '../MyComp';
import narration from '../narration/Overview.json';
import {
	ACCENT,
	Arrow,
	Box,
	MONO,
	narratedVideo,
	NextUp,
	Scene,
	SeriesTitle,
	Thumb,
	useFadeIn,
	usePop,
} from './ui';

const Title: React.FC = () => (
	<SeriesTitle current="Overview" subtitle="このリポジトリは何をしているか" />
);

// 1. コードから動画をつくる
const CodeToVideo: React.FC = () => {
	const video = usePop(60);
	const chips = ['文字', '図形', '動き'];
	return (
		<Scene
			title="React のコードから動画をつくる"
			caption="動画編集ソフトは使わない。見た目も動きも、すべてコードで書く。"
		>
			<div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 50, marginTop: 30}}>
				<Box color="#60a5fa" style={{fontFamily: MONO, fontSize: 34, lineHeight: 1.6, whiteSpace: 'pre'}}>
					<span style={{color: '#94a3b8'}}>{'// src/MyComp.tsx (抜粋)'}</span>
					{'\n'}
					{'const scale = '}
					<span style={{color: ACCENT}}>spring</span>
					{'({fps, frame});\n\n'}
					{'<div style={{\n  fontSize: 150,\n  transform: `scale(${scale})`,\n}}>\n  Remotion\n</div>'}
				</Box>
				<Arrow opacity={video} />
				<div style={{opacity: video, transform: `scale(${0.85 + video * 0.15})`}}>
					<Thumb frame={60} width={640} />
				</div>
			</div>
			<div style={{display: 'flex', justifyContent: 'center', gap: 30, marginTop: 50}}>
				{chips.map((c, i) => {
					const p = usePop(190 + i * 18);
					return (
						<div
							key={c}
							style={{
								fontSize: 44,
								fontWeight: 800,
								padding: '10px 40px',
								borderRadius: 999,
								background: 'rgba(96,165,250,0.18)',
								opacity: p,
								transform: `scale(${p})`,
							}}
						>
							{c}
						</div>
					);
				})}
				<div style={{fontSize: 44, alignSelf: 'center', opacity: useFadeIn(250)}}>もコードで</div>
			</div>
		</Scene>
	);
};

// 2. 入っている 2 本の動画
const VIDEOS = [
	{id: 'MyComp', desc: 'できることのサンプル (30秒)', file: 'src/MyComp.tsx', img: 'mycomp/450.jpeg'},
	{id: 'HowItWorks', desc: '仕組みの解説 (ナレーション付き)', file: 'src/HowItWorks.tsx', img: 'journey/howitworks.jpeg'},
];

const TwoVideos: React.FC = () => {
	const self = useFadeIn(330);
	return (
		<Scene title="入っている動画">
			<div style={{display: 'flex', justifyContent: 'center', gap: 70, marginTop: 10}}>
				{VIDEOS.map((v, i) => {
					const p = usePop(40 + i * 150);
					return (
						<div key={v.id} style={{width: 720, opacity: p, transform: `translateY(${(1 - p) * 40}px)`}}>
							<Img src={staticFile(v.img)} style={{width: 720, borderRadius: 14, display: 'block'}} />
							<div style={{fontFamily: MONO, fontSize: 44, fontWeight: 800, marginTop: 18}}>{v.id}</div>
							<div style={{fontSize: 34, color: '#cbd5e1', marginTop: 6}}>{v.desc}</div>
							<div style={{fontFamily: MONO, fontSize: 28, color: '#94a3b8', marginTop: 6}}>{v.file}</div>
						</div>
					);
				})}
			</div>
			<div
				style={{
					textAlign: 'center',
					fontSize: 40,
					marginTop: 50,
					opacity: self,
				}}
			>
				いま見ている <span style={{fontFamily: MONO, color: ACCENT}}>Overview</span> も同じ仕組み{' '}
				<span style={{fontFamily: MONO, fontSize: 30, color: '#94a3b8'}}>(src/journey/Overview.tsx)</span>
			</div>
		</Scene>
	);
};

// 3. フォルダの役割
const FOLDERS = [
	{
		dir: 'src/',
		role: '動画のコード',
		color: '#60a5fa',
		items: ['index.ts', 'Root.tsx', 'MyComp.tsx', 'HowItWorks.tsx', 'journey/  (このシリーズ)'],
		at: 80,
	},
	{
		dir: 'public/',
		role: '素材 (画像・音声)',
		color: '#34d399',
		items: ['mycomp/  (静止画)', 'narration/  (音声)'],
		at: 160,
	},
	{
		dir: 'scripts/',
		role: 'ナレーション生成',
		color: '#f472b6',
		items: ['narrate.py', 'narration/  (原稿)'],
		at: 250,
	},
];

const Folders: React.FC = () => (
	<Scene title="フォルダの役割">
		<div style={{display: 'flex', justifyContent: 'center', gap: 50, marginTop: 40}}>
			{FOLDERS.map((f) => {
				const p = usePop(f.at);
				return (
					<Box
						key={f.dir}
						color={f.color}
						style={{width: 520, opacity: 0.25 + p * 0.75, transform: `translateY(${(1 - p) * 30}px)`}}
					>
						<div style={{fontFamily: MONO, fontSize: 52, fontWeight: 800, color: f.color}}>{f.dir}</div>
						<div style={{fontSize: 40, fontWeight: 800, margin: '8px 0 24px'}}>{f.role}</div>
						{f.items.map((it) => (
							<div key={it} style={{fontFamily: MONO, fontSize: 30, color: '#cbd5e1', lineHeight: 1.7, whiteSpace: 'pre'}}>
								{it}
							</div>
						))}
					</Box>
				);
			})}
		</div>
	</Scene>
);

// 4. コードのつながり: index.ts → Root.tsx → Composition → コンポーネント
const Chain: React.FC = () => {
	const idx = usePop(60);
	const root = usePop(130);
	const comp = usePop(200);
	const rows = [
		{id: 'MyComp', file: 'MyComp.tsx'},
		{id: 'HowItWorks', file: 'HowItWorks.tsx'},
		{id: 'Overview', file: 'journey/Overview.tsx'},
	];
	return (
		<Scene
			title="コードのつながり"
			caption="Composition = 「サイズ・長さ・fps」と「中身を描くコンポーネント」の組み合わせ。これが動画 1 本分。"
		>
			<div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18, height: '100%'}}>
				<Box color="#60a5fa" style={{opacity: idx, fontFamily: MONO, fontSize: 26, textAlign: 'center', padding: '20px 24px'}}>
					<div style={{fontSize: 36, fontWeight: 800}}>index.ts</div>
					<div style={{color: '#94a3b8', marginTop: 8}}>入口</div>
					<div style={{marginTop: 8}}>registerRoot(Root)</div>
				</Box>
				<Arrow opacity={root} />
				<Box color="#60a5fa" style={{opacity: root, fontFamily: MONO, fontSize: 26, textAlign: 'center', padding: '20px 24px'}}>
					<div style={{fontSize: 36, fontWeight: 800}}>Root.tsx</div>
					<div style={{color: '#94a3b8', marginTop: 8}}>動画の一覧</div>
				</Box>
				<Arrow opacity={comp} />
				<div style={{display: 'flex', flexDirection: 'column', gap: 16}}>
					{rows.map((r, i) => {
						const rowIn = usePop(200 + i * 12);
						const fileIn = usePop(330 + i * 12);
						return (
							<div key={r.id} style={{display: 'flex', alignItems: 'center', gap: 22, opacity: rowIn}}>
								<div
									style={{
										fontFamily: MONO,
										fontSize: 26,
										padding: '12px 20px',
										borderRadius: 12,
										border: `3px solid ${ACCENT}`,
										background: 'rgba(251,191,36,0.08)',
										width: 540,
										whiteSpace: 'nowrap',
									}}
								>
									{'<Composition id="'}
									<span style={{color: ACCENT}}>{r.id}</span>
									{'"'}
									<div style={{color: '#94a3b8', fontSize: 24}}>1920×1080 / 30fps / 長さ</div>
								</div>
								<div style={{fontSize: 44, color: '#64748b', opacity: fileIn}}>→</div>
								<div style={{fontFamily: MONO, fontSize: 28, opacity: fileIn}}>
									{r.file}
									<div style={{fontSize: 24, color: '#94a3b8'}}>コンポーネント</div>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</Scene>
	);
};

// 5. 作業の流れ: Studio でプレビュー → render で書き出し
const Workflow: React.FC = () => {
	const frame = useCurrentFrame();
	const saved = usePop(170);
	const render = usePop(250);
	const playhead = interpolate(frame % 150, [0, 150], [0, 100], clamp);
	return (
		<Scene
			title="作業の流れ"
			caption="※ Studio の画面は簡略化したイメージ図"
		>
			<div style={{display: 'flex', justifyContent: 'center', alignItems: 'flex-start', gap: 80, marginTop: 10}}>
				<div style={{width: 800}}>
					<div style={{fontSize: 40, fontWeight: 800, marginBottom: 14}}>① プレビューしながら編集</div>
					<div style={{fontFamily: MONO, fontSize: 32, color: ACCENT, marginBottom: 18}}>npm run studio</div>
					<div style={{borderRadius: 14, overflow: 'hidden', border: '3px solid #475569', width: 760}}>
						<div style={{background: '#334155', padding: '8px 14px', fontFamily: MONO, fontSize: 22, color: '#cbd5e1'}}>
							● ● ●  localhost:3000/MyComp
						</div>
						<div style={{background: '#111827', padding: 20}}>
							<Thumb frame={450} width={716} />
							<div style={{height: 10, background: '#334155', borderRadius: 5, marginTop: 16, position: 'relative'}}>
								<div
									style={{
										position: 'absolute',
										left: `${playhead}%`,
										top: -6,
										width: 6,
										height: 22,
										background: ACCENT,
										borderRadius: 3,
									}}
								/>
							</div>
						</div>
					</div>
					<div style={{fontSize: 34, marginTop: 18, opacity: saved, color: '#34d399', fontWeight: 800}}>
						コードを保存 → すぐ反映
					</div>
				</div>
				<div style={{width: 700, opacity: render, transform: `translateY(${(1 - render) * 30}px)`}}>
					<div style={{fontSize: 40, fontWeight: 800, marginBottom: 14}}>② MP4 に書き出し</div>
					<div style={{fontFamily: MONO, fontSize: 30, color: ACCENT, marginBottom: 30, lineHeight: 1.5}}>
						npx remotion render
						<br />
						{'  '}HowItWorks out/how-it-works.mp4
					</div>
					<Box color="#34d399" style={{fontFamily: MONO, fontSize: 40, textAlign: 'center'}}>
						out/how-it-works.mp4
					</Box>
				</div>
			</div>
		</Scene>
	);
};

// 6. ナレーションの位置づけ
const NarrationStep: React.FC = () => {
	const steps = [
		{label: '原稿', sub: 'scripts/narration/*.txt', color: '#f472b6'},
		{label: '音声合成', sub: 'Qwen3-TTS (ローカル)', color: '#a78bfa'},
		{label: '音声ファイル', sub: 'public/narration/', color: '#34d399'},
		{label: '動画に重ねる', sub: '<Audio>', color: '#60a5fa'},
	];
	const later = usePop(250);
	return (
		<Scene step="+α" title="ナレーション付きの動画は、もう一手間">
			<div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginTop: 90}}>
				{steps.map((s, i) => {
					const p = usePop(70 + i * 35);
					return (
						<div key={s.label} style={{display: 'flex', alignItems: 'center', gap: 16}}>
							<Box
								color={s.color}
								style={{width: 380, textAlign: 'center', padding: '24px 16px', opacity: p, transform: `translateY(${(1 - p) * 30}px)`}}
							>
								<div style={{fontSize: 42, fontWeight: 800}}>{s.label}</div>
								<div style={{fontFamily: MONO, fontSize: 22, color: '#94a3b8', marginTop: 10, whiteSpace: 'nowrap'}}>{s.sub}</div>
							</Box>
							{i < steps.length - 1 ? <Arrow opacity={p} /> : null}
						</div>
					);
				})}
			</div>
			<div style={{textAlign: 'center', fontSize: 40, marginTop: 70, opacity: later, color: ACCENT, fontWeight: 800}}>
				詳しくは 6 本目「ナレーションの仕組み」で
			</div>
		</Scene>
	);
};

// 7. 次のステップ
const Next: React.FC = () => (
	<NextUp
		current="Overview"
		files={[
			{path: 'src/index.ts', note: '入口。数行だけ'},
			{path: 'src/Root.tsx', note: '動画の一覧 (Composition)'},
		]}
	/>
);

export const {Video: Overview, durationInFrames: OVERVIEW_DURATION} = narratedVideo(
	[
		[Title, 240],
		[CodeToVideo, 240],
		[TwoVideos, 240],
		[Folders, 240],
		[Chain, 240],
		[Workflow, 240],
		[NarrationStep, 240],
		[Next, 240],
	],
	narration,
);
