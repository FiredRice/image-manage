import { useRef } from 'react';
import { IMapOptions, IReturnContextInstance } from '../types';
import RefInstance from '../utils/refInstance';

export function useRefInstance<T extends IMapOptions>(defaultValues: T, refInstance?: IReturnContextInstance<T>) {
    const refInstanceRef = useRef<IReturnContextInstance<T>>();

    if (!refInstanceRef.current) {
        if (refInstance) {
            refInstanceRef.current = refInstance;
        } else {
            const refInstanceStore = new RefInstance(defaultValues);
            refInstanceRef.current = refInstanceStore;
        }
    }
    return [refInstanceRef.current];
}
