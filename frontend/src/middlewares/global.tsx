import { Spin } from 'antd';
import { RefContext } from 'src/components';

export const { Provider, useRefContext, useWatch } = RefContext.createContext({
    loading: true
});

const Child = ({ children }) => {
    const loading = useWatch('loading');
    return (
        <Spin spinning={loading}>
            {children}
        </Spin>
    );
};

const GlobalMiddleware = ({ children }) => {
    return (
        <Provider>
            <Child>
                {children}
            </Child>
        </Provider>
    );
};

export default GlobalMiddleware;