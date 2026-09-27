// ラーニングジャーニー (全7本) の目次。各動画の「現在地」表示と「次の動画」案内に使う。
export const SERIES = [
	{id: 'Overview', title: '全体像'},
	{id: 'ReactBasics', title: 'React 最小限入門'},
	{id: 'HowItWorks', title: 'Remotion の裏側'},
	{id: 'Animate', title: 'フレームで動きをつける'},
	{id: 'Compose', title: 'シーンの並べ方とタイミング'},
	{id: 'Narration', title: 'ナレーションの仕組み'},
	{id: 'Practice', title: '実践：新しいシーンを追加'},
] as const;

export type SeriesId = (typeof SERIES)[number]['id'];
