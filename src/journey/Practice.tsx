// ラーニングジャーニー 7/7: 実践：新しいシーンを追加
// 例として「1 本目 (Overview) の最後の直前にシーンを 1 つ足す」手順を見せる
import {useCurrentFrame} from 'remotion';
import narration from '../narration/Practice.json';
import {ACCENT, Box, Code, MONO, narratedVideo, NextUp, Scene, Screen, SeriesTitle, useFadeIn, usePop} from './ui';

// 例のシーン。下の HELLO_CODE はこのコンポーネントのソースと同じ内容にしておく
const Hello: React.FC = () => {
	const p = usePop(30);
	return (
		<Scene title="新しいシーン">
			<div style={{fontSize: 120, fontWeight: 800, textAlign: 'center', marginTop: 200, opacity: p}}>こんにちは</div>
		</Scene>
	);
};

const HELLO_CODE = [
	'const Hello: React.FC = () => {',
	'  const p = usePop(30);',
	'  return (',
	'    <Scene title="新しいシーン">',
	'      <div style={{fontSize: 120, opacity: p, …}}>',
	'        こんにちは',
	'      </div>',
	'    </Scene>',
	'  );',
	'};',
];

const Title: React.FC = () => <SeriesTitle current="Practice" subtitle="ここまでの知識をつなげる" />;

// 1. 手順の全体
const STEPS = ['シーンを書く', '動画に登録する', '原稿を足す', '音声を作る', '確認して書き出す'];
const StepsOverview: React.FC = () => (
	<Scene title="手順は 5 つ" caption="例: 1 本目「全体像」の、最後のシーンの直前に 1 つ足す。">
		<div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 22, margin: '10px auto 0', width: 800}}>
			{STEPS.map((s, i) => {
				const p = usePop(80 + i * 40);
				return (
					<div key={s} style={{display: 'flex', alignItems: 'center', gap: 30, fontSize: 52, fontWeight: 800, opacity: p}}>
						<span style={{fontFamily: MONO, color: ACCENT, width: 60}}>{i + 1}</span>
						{s}
					</div>
				);
			})}
		</div>
	</Scene>
);

// 2. シーンを書く
const WriteScene: React.FC = () => {
	const preview = usePop(300);
	return (
		<Scene step="1" title="シーンを書く" caption="Scene (枠) と usePop (登場アニメーション) は src/journey/ui.tsx の共通部品。">
			<div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 60, height: '100%'}}>
				<Code lines={HELLO_CODE} highlight={[1, 3]} fontSize={30} />
				<div style={{opacity: preview, textAlign: 'center'}}>
					<div style={{border: '3px solid #475569', borderRadius: 14}}>
						<Screen width={800}>
							<Hello />
						</Screen>
					</div>
					<div style={{fontSize: 28, color: '#94a3b8', marginTop: 12}}>このコードの実際の見た目</div>
				</div>
			</div>
		</Scene>
	);
};

// 3. 動画に登録する
const Register: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<Scene step="2" title="動画に登録する" caption="配列の順番 = 原稿の行の順番。シーン数と行数がずれるとエラーで教えてくれる。">
			<div style={{display: 'flex', justifyContent: 'center', marginTop: 20}}>
				<Code
					label="src/journey/Overview.tsx"
					lines={[
						'narratedVideo(',
						'  [',
						'    [Title, 240],',
						'    …',
						'    [NarrationStep, 240],',
						'    [Hello, 240],        // ← 追加',
						'    [Next, 240],',
						'  ],',
						'  narration,',
						');',
					]}
					highlight={frame > 150 ? [5] : []}
					fontSize={34}
				/>
			</div>
		</Scene>
	);
};

// 4. 原稿を足して、音声を作る
const Generate: React.FC = () => {
	const warn = usePop(260);
	return (
		<Scene step="3・4" title="原稿を足して、音声を作る">
			<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 30}}>
				<Code
					label="scripts/narration/Overview.txt (番号は 0 から。音声のファイル名と同じ)"
					lines={['06: ナレーション付きの動画では、もう一つ手順が…', '07: (追加) 新しいシーンのナレーション', '08: 次の動画では、リアクトの、最小限の読み方を…']}
					highlight={[1]}
					fontSize={30}
				/>
				<Code lines={['uv run --project ../qwen3-tts python scripts/narrate.py Overview 7 8']} fontSize={30} />
				<Box color="#f87171" style={{opacity: warn, maxWidth: 1400}}>
					<div style={{fontSize: 34, fontWeight: 800, color: '#f87171'}}>途中に入れたら、そこから後ろも作り直す</div>
					<div style={{fontSize: 28, color: '#cbd5e1', marginTop: 8}}>
						音声はシーン番号で保存される (07.wav, 08.wav …)。1 つ入れると後ろの番号がずれるので、7 と 8 の両方を作る。
					</div>
				</Box>
			</div>
		</Scene>
	);
};

// 5. 確認して書き出す
const Finish: React.FC = () => {
	const items = [
		{label: 'プレビュー', code: 'npm run studio', at: 60},
		{label: '音声を聞く', code: 'public/narration/Overview/07.wav', at: 150},
		{label: '書き出す', code: 'npx remotion render Overview out/01-overview.mp4', at: 230},
		{label: 'コミット', code: 'git add public/narration src/narration …', at: 330},
	];
	return (
		<Scene step="5" title="確認して書き出す" caption="生成した音声 (.wav) と長さ (.json) もコミットする (作り直すと同じ音声には戻らないため)。">
			<div style={{display: 'flex', flexDirection: 'column', gap: 24, margin: '20px auto 0', width: 1400}}>
				{items.map((it) => (
					<div key={it.label} style={{display: 'flex', alignItems: 'center', gap: 40, opacity: usePop(it.at)}}>
						<div style={{width: 260, fontSize: 42, fontWeight: 800}}>{it.label}</div>
						<div style={{fontFamily: MONO, fontSize: 32, color: ACCENT}}>{it.code}</div>
					</div>
				))}
			</div>
		</Scene>
	);
};

// 6. よくある落とし穴 (これまでの動画のまとめ)
const PITFALLS = [
	{ng: 'Math.random()', ok: "random('seed') を使う", ref: '3 本目', at: 80},
	{ng: 'interpolate(...) だけ', ok: 'clamp を付ける', ref: '4 本目', at: 170},
	{ng: '親より長い子の Sequence', ok: '子の長さは親の中に収める', ref: '5 本目', at: 250},
	{ng: '素材を src/ に置く', ok: 'public/ に置いて staticFile() で読む', ref: '1 本目', at: 350},
];

const Pitfalls: React.FC = () => (
	<Scene title="よくある落とし穴">
		<div style={{display: 'flex', flexDirection: 'column', gap: 22, margin: '10px auto 0', width: 1600}}>
			{PITFALLS.map((p) => (
				<div key={p.ng} style={{display: 'flex', alignItems: 'center', gap: 30, opacity: usePop(p.at)}}>
					<div
						style={{
							width: 560,
							fontFamily: MONO,
							fontSize: 32,
							color: '#f87171',
							textDecoration: 'line-through',
						}}
					>
						{p.ng}
					</div>
					<div style={{fontSize: 44, color: '#64748b'}}>→</div>
					<div style={{flex: 1, fontSize: 36, fontWeight: 800, color: '#34d399'}}>{p.ok}</div>
					<div style={{fontSize: 26, color: '#94a3b8'}}>{p.ref}</div>
				</div>
			))}
			<div style={{fontSize: 30, color: '#94a3b8', marginTop: 10, opacity: useFadeIn(380)}}>
				詳しいルールはリポジトリの CLAUDE.md にもまとまっている
			</div>
		</div>
	</Scene>
);

// 7. シリーズの締め
const Next: React.FC = () => (
	<NextUp
		current="Practice"
		files={[
			{path: 'src/journey/Overview.tsx', note: 'シーンを 1 つ足してみる'},
			{path: 'scripts/narration/Overview.txt', note: '原稿にも 1 行足す'},
		]}
	/>
);

export const {Video: Practice, durationInFrames: PRACTICE_DURATION} = narratedVideo(
	[
		[Title, 240],
		[StepsOverview, 240],
		[WriteScene, 240],
		[Register, 240],
		[Generate, 240],
		[Finish, 240],
		[Pitfalls, 240],
		[Next, 240],
	],
	narration,
);
