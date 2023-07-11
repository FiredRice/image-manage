import LeftSide from './components/LeftSide';
import RightSide from './components/RightSide';
import { Provider } from './hooks/context';
import LeftResize from './components/LeftResize';
import './style/index.less';

function Home() {
	return (
		<Provider>
			<div className='manage-page'>
				<LeftResize>
					<LeftSide />
				</LeftResize>
				<div className='right-side'>
					<RightSide />
				</div>
			</div>
		</Provider>
	);
}

export default Home;
