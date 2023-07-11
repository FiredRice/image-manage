import { imagesStore, labelsStore } from 'src/service/store';

export const removeLabel = async (key: string) => {
    const imageConfig: any = {};
    const images = imagesStore.getValues();
    Object.keys(images).forEach(p => {
        const image = images[p];
        if (image.labels?.includes(key)) {
            imageConfig[p] = image;
            const labelSet = new Set(imageConfig[p].labels || []);
            labelSet.delete(key);
            imageConfig[p].labels = [...labelSet];
        }
    });
    await Promise.all([
        labelsStore.remove(key),
        imagesStore.setValues(imageConfig)
    ]);
    return imageConfig;
};