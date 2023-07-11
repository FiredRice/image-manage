import { useRefContext, useWatch } from 'src/middlewares/global';

export function useGlobalInstance() {
    return useRefContext();
};

export const useGlobalWatch = useWatch;

export function useSetGlobalLoading() {
    const refInstance = useGlobalInstance();

    return function (loading: boolean) {
        refInstance.setValues({ loading });
    };
}