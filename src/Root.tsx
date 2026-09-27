import {Composition} from 'remotion';
import {MyComp} from './MyComp';
import {HOW_IT_WORKS_DURATION, HowItWorks} from './HowItWorks';
import {Overview, OVERVIEW_DURATION} from './journey/Overview';
import {REACT_BASICS_DURATION, ReactBasics} from './journey/ReactBasics';

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
		</>
	);
};
