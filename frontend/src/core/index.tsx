import { ComponentType } from 'react';
import ReactDOM from 'react-dom';

type IMiddlewareProps = ComponentType<any>;

export default class FiredRice {
    private middlwares: IMiddlewareProps[] = [];
    private routers: JSX.Element = <></>;

    public use(middlewares: IMiddlewareProps[]) {
        this.middlwares = middlewares.reverse();
    }

    public injectRouters(routers: JSX.Element) {
        this.routers = routers;
    }

    private getRootComponent() {
        return this.middlwares.reduce((prev, Cur) => <Cur>{prev}</Cur>, this.routers);
    }

    public start(container: ReactDOM.Container | null) {
        const Root = this.getRootComponent();
        ReactDOM.render(Root, container);
    }
}