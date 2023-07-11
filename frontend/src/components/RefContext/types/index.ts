
export type IMapOptions = {
    [x: string]: any;
};

export type IInstanceKeys<T extends IMapOptions> = keyof T | '';

export interface IRefContextInstance<T extends IMapOptions> {
    getValues: () => T;
    setValues: (values: Partial<T>) => void;
    getInternalHooks: (key: string) => IInternalHooks<T> | null;
}

export type IReturnContextInstance<T extends IMapOptions> = Omit<IRefContextInstance<T>, 'getInternalHooks'>;

export type IInnerContextValue<T extends IMapOptions> = {
    value: IRefContextInstance<T>;
};

export type WatchCallBack<T extends IMapOptions> = (values: T) => void;

export interface IInternalHooks<T extends IMapOptions> {
    registerWatch: (callback: WatchCallBack<T>) => () => void;
}