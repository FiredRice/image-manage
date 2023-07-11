import { useCallback, useState } from 'react';

interface IModalState<T = any> {
    open: boolean;
    record?: T;
}

type IReturnValues<T = any> = [
    IModalState<T>,
    (record?: T) => void,
    () => void
];

function useModalState<RecordType = any>(defaultValue?: Partial<IModalState>): IReturnValues<RecordType> {
    const [state, setState] = useState({
        open: defaultValue?.open ?? false,
        record: defaultValue?.record as RecordType | undefined
    });

    const openModal = useCallback((record?: RecordType) => {
        setState({
            open: true,
            record
        });
    }, []);

    const closeModal = useCallback(() => {
        setState({
            open: false,
            record: undefined
        });
    }, []);

    return [state, openModal, closeModal];
}

export default useModalState;