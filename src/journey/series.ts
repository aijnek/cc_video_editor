// ラーニングジャーニー (全7本) の目次。各動画の「現在地」表示と「次の動画」案内に使う。
export const SERIES = [
	{id: 'Overview', title: '全体像'},
	{id: 'ReactBasics', title: 'React 最小限入門'},
	{id: 'HowItWorks', title: 'Remotion の裏側'},
	{id: 'Animate', title: '時間で動かす'},
	{id: 'Compose', title: '時間を組み立てる'},
	{id: 'Narration', title: 'ナレーションの仕組み'},
	{id: 'Practice', title: '実践：新しいシーンを追加'},
] as const;

export type SeriesId = (typeof SERIES)[number]['id'];
