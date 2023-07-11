import { RefContext } from 'src/components';
import { ManageContext } from '../type';
import { useCallback } from 'react';

export const AllLabelKey = '全部';

export const defaultContext: ManageContext = {
    currentLabel: AllLabelKey,
    checkList: [],
    labels: [],
    images: [],
    currentPage: 1,
    pageSize: 10
};

export const { Provider, useRefContext, useWatch } = RefContext.createContext(defaultContext);

export function useUpdateImagesLabel() {
    const refInstance = useRefContext();

    const updateImagesLabel = useCallback((imageConfig: any) => {
        const images = [...refInstance.getValues().images] || [];
        for (let i = 0; i < images.length; i++) {
            const image = images[i];
            const value = imageConfig[image.path];
            if (value) {
                image.labels = value.labels || [];
            }
            images[i] = image;
        }
        refInstance.setValues({ images });
    }, []);

    return updateImagesLabel;
}