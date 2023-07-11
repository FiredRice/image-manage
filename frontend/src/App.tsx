import { BrowserRouter, MemoryRouter, Switch } from 'react-router-dom';
import PrimaryRoutes from './pages/layouts/PrimaryRouter';
import 'react-contexify/dist/ReactContexify.css';
import './style/index.less';

const App = () => {

    return (
        <BrowserRouter>
            <MemoryRouter>
                <Switch>
                    <PrimaryRoutes />
                </Switch>
            </MemoryRouter>
        </BrowserRouter>
    );
};

export default App;