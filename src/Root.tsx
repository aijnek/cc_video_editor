import {Composition} from 'remotion';
import {MyComp} from './MyComp';
import {HOW_IT_WORKS_DURATION, HowItWorks} from './HowItWorks';
import {Overview, OVERVIEW_DURATION} from './journey/Overview';
import {REACT_BASICS_DURATION, ReactBasics} from './journey/ReactBasics';
import {Animate, ANIMATE_DURATION} from './journey/Animate';
import {Compose, COMPOSE_DURATION} from './journey/Compose';
import {Narration, NARRATION_DURATION} from './journey/Narration';
import {Practice, PRACTICE_DURATION} from './journey/Practice';

export const Root: React.FC = () => {
	return (
		<>
			<Composition
				id="MyComp"
				component={MyComp}
				durationInFrames={900}
				width={1920}
				height={1080}
				fps={30}
				defaultProps={{}}
			/>
			<Composition
				id="HowItWorks"
				component={HowItWorks}
				durationInFrames={HOW_IT_WORKS_DURATION}
				width={1920}
				height={1080}
				fps={30}
				defaultProps={{}}
			/>
			<Composition
				id="Overview"
				component={Overview}
				durationInFrames={OVERVIEW_DURATION}
				width={1920}
				height={1080}
				fps={30}
				defaultProps={{}}
			/>
			<Composition
				id="ReactBasics"
				component={ReactBasics}
				durationInFrames={REACT_BASICS_DURATION}
				width={1920}
				height={1080}
				fps={30}
				defaultProps={{}}
			/>
			<Composition
				id="Animate"
				component={Animate}
				durationInFrames={ANIMATE_DURATION}
				width={1920}
				height={1080}
				fps={30}
				defaultProps={{}}
			/>
			<Composition
				id="Compose"
				component={Compose}
				durationInFrames={COMPOSE_DURATION}
				width={1920}
				height={1080}
				fps={30}
				defaultProps={{}}
			/>
			<Composition
				id="Narration"
				component={Narration}
				durationInFrames={NARRATION_DURATION}
				width={1920}
				height={1080}
				fps={30}
				defaultProps={{}}
			/>
			<Composition
				id="Practice"
				component={Practice}
				durationInFrames={PRACTICE_DURATION}
				width={1920}
				height={1080}
				fps={30}
				defaultProps={{}}
			/>
		</>
	);
};
