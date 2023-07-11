import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useRefContext, useWatch } from '../../../hooks/context';
import { imagesStore } from 'src/service/store';
import { division } from 'src/utils';
import { ImageFile } from 'src/pages/home/type';
import { GetFilesInfo } from 'wailsjs/go/file/File';
import { isEmpty, omit, remove } from 'lodash-es';
import { message } from 'antd';
import EventManager from 'src/service/event';
import { useSetGlobalLoading } from 'src/hooks';

const KB = 1024 * 1024;
const MB = KB * 1024;

export function convertBytes(bytes) {
    if (bytes < 1024) {
        return division(bytes) + 'B';
    } else if (bytes < KB) {
        return division((bytes / 1024)) + 'KB';
    } else if (bytes < MB) {
        return division((bytes / KB)) + 'MB';
    } else {
        return division((bytes / MB)) + 'GB';
    }
}

export async function removeImagesLabels(paths: string[], label: string) {
    const imageConfig: any = {};
    paths.map(path => {
        imageConfig[path] = imagesStore.get(path);
        const labels = imageConfig[path].labels || [];
        remove(labels, l => l === label);
        imageConfig[path].labels = labels;
    });
    await imagesStore.setValues(imageConfig);
    return imageConfig;
}

export function useImagesEvents() {
    const refInstance = useRefContext();

    const setLoading = useSetGlobalLoading();

    async function loadImages() {
        setLoading(true);
        const images = imagesStore.getValues();
        const list: ImageFile[] = [];
        const paths = Object.keys(images);
        const fileInfos = await GetFilesInfo(paths);
        paths.forEach((path, index) => {
            list.push({
                ...images[path],
                ...omit(fileInfos[index], 'isDir'),
                path,
            });
        });
        refInstance.setValues({ images: list });
        setLoading(false);
    }

    const onImagesImported = useCallback(async (paths: string[]) => {
        setLoading(true);
        const imageMap: any = {};
        if (isEmpty(paths)) return;
        paths.forEach(path => {
            if (imagesStore.get(path)) return;
            imageMap[path] = {
                labels: [],
            };
        });
        if (isEmpty(imageMap)) return;
        await imagesStore.setValues(imageMap);
        paths = Object.keys(imageMap);
        const fileInfos = await GetFilesInfo(paths);
        const values: ImageFile[] = [...refInstance.getValues().images] || [];
        paths.forEach((path, index) => {
            values.push({
                ...omit(fileInfos[index], 'isDir'),
                path,
                labels: []
            });
        });
        refInstance.setValues({ images: values });
        message.success('导入成功');
        setLoading(false);
    }, []);

    useEffect(() => {
        const events = new EventManager();
        events.on('Import-Images-Success', onImagesImported);
        loadImages();
        return function () {
            events.removeAll();
        };
    }, []);
}

export function usePagination() {
    const refInstance = useRefContext();
    const current = useWatch('currentPage') || 1;
    const pageSize = useWatch('pageSize') || 10;

    const pagination = useMemo(() => {
        return {
            current,
            pageSize,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100', '500'],
            onChange: (pageNum, pageSize) => {
                refInstance.setValues({ currentPage: pageNum });
            },
            onShowSizeChange: (pageNum, pageSize) => {
                refInstance.setValues({
                    currentPage: pageNum,
                    pageSize
                });
            },
        };
    }, [current, pageSize]);

    return pagination;
}

export function useScroll(): [React.MutableRefObject<any>, ((position: number) => void)] {
    const domRef = useRef<any>(null);

    function scroll(position: number) {
        if (domRef.current) {
            domRef.current.scrollTop = position;
        }
    }

    return [domRef, scroll];
}

export function transArrayToMap(values: string[]) {
    const valueMap: any = {};
    values.forEach(i => {
        valueMap[i] = true;
    });
    return valueMap;
}