import React, { ReactNode, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useRefInstance } from '../hooks';
import { IInnerContextValue, IInstanceKeys, IMapOptions, IRefContextInstance, IReturnContextInstance } from '../types';
import { HOOK_MARK } from '../utils/refInstance';

interface IContextProps<T extends IMapOptions> {
    refInstance?: IReturnContextInstance<T>;
    value?: T;
    children?: ReactNode;
}

export function createContext<T extends IMapOptions>(defaultValue: T) {
    const InternalContext = React.createContext<IInnerContextValue<T>>({
        value: {} as any
    });

    const Provider: React.FC<IContextProps<any>> = (props) => {
        const { refInstance, value = defaultValue, children } = props;

        const [refInstanceRef] = useRefInstance(value, refInstance);

        const refContextValue = useMemo(() => ({
            value: refInstanceRef
        }), [refInstanceRef]) as IInnerContextValue<T>;

        return (
            <InternalContext.Provider value={refContextValue}>
                {children}
            </InternalContext.Provider>
        );
    };

    /**
     * 获取当前上下文实例
     */
    function useRefContext(): IReturnContextInstance<T> {
        return useContext(InternalContext).value;
    };

    /**
     * 监听字段
     */
    function useWatch(key?: undefined): T;
    function useWatch<K extends IInstanceKeys<T>>(key: K): T[K];
    function useWatch(key: any): T {
        const [value, setValue] = useState(key === undefined ? defaultValue : defaultValue?.[key]);

        const refInstance = useRefContext() as IRefContextInstance<T>;

        const valueStr = useMemo(() => JSON.stringify(value), [value]);
        const valueStrRef = useRef(valueStr);
        valueStrRef.current = valueStr;

        useEffect(() => {
            const registerWatch = refInstance.getInternalHooks(HOOK_MARK)!.registerWatch;

            const cancelRegister = registerWatch(() => {
                const values = refInstance.getValues();
                const newValue = key === undefined ? values : values?.[key];
                const nextValueStr = JSON.stringify(newValue);

                if (valueStrRef.current !== nextValueStr) {
                    valueStrRef.current = nextValueStr;
                    setValue(newValue);
                }
            });
            const values = refInstance.getValues();
            const initValues = key === undefined ? values : values?.[key];
            setValue(initValues);

            return cancelRegister;
        }, []);

        return value;
    };

    return {
        Provider,
        useRefContext,
        useWatch
    };
}
