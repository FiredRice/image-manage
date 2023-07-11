import { Suspense } from 'react';
import { Route, useHistory } from 'react-router-dom';
import LodingCom from './LodingCom';
import { useAsyncEffect } from 'ahooks';
import { initStores } from 'src/service/store';
import Empty from './Empty';
import Home from '../home';

const PrimaryRoutes = () => {
    const history = useHistory();

    useAsyncEffect(async () => {
        await initStores();
        history.replace('/home');
    }, []);

    return (
        <Suspense fallback={<LodingCom />}>
            <Route path='/' exact component={Empty} />
            <Route path='/home' exact component={Home} />
        </Suspense>
    );
};

export default PrimaryRoutes;
