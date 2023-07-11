import { IInternalHooks, IMapOptions, IRefContextInstance, WatchCallBack } from '../types';

export const HOOK_MARK = 'REF_INSTANCE_INNER_HOOKS';

export default class RefInstance<T extends IMapOptions> implements IRefContextInstance<T> {
    private innerValue: T;
    private watchList: WatchCallBack<T>[] = [];

    constructor(value: T) {
        this.innerValue = value;
    }
    public getValues() {
        return this.innerValue;
    }
    public setValues(values: Partial<T>) {
        this.innerValue = Object.assign({}, this.innerValue, values);
        this.notifyWatch();
    }

    private registerWatch: IInternalHooks<T>['registerWatch'] = callback => {
        this.watchList.push(callback);

        return () => {
            this.watchList = this.watchList.filter(fn => fn !== callback);
        };
    };

    private notifyWatch = () => {
        if (this.watchList.length) {
            const values = this.getValues();
            this.watchList.forEach(callback => {
                callback(values);
            });
        }
    };

    public getInternalHooks = (key: string): IInternalHooks<T> | null => {
        if (key === HOOK_MARK) {
            return {
                registerWatch: this.registerWatch,
            };
        }
        return null;
    };
}