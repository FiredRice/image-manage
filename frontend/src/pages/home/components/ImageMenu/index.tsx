import React from 'react';
import { Modal, Typography, message } from 'antd';
import { omit } from 'lodash-es';
import { Menu, Item, Separator, MenuProps } from 'react-contexify';
import { imagesStore } from 'src/service/store';
import { getFileNameByPath } from 'src/utils';
import { OpenFileDialog } from 'wailsjs/go/dialog/Dialog';
import { GetFileInfo, LocalOpenFile, LocalOpenFolder } from 'wailsjs/go/file/File';
import { AllLabelKey, useRefContext, useUpdateImagesLabel, useWatch } from '../../hooks/context';
import { removeImagesLabels } from '../RightSide/hooks';

interface IImageMenuProps extends Omit<MenuProps, 'children'> {
    onSetLabel?: (props: any) => void;
}

const ImageMenu: React.FC<IImageMenuProps> = (props) => {

    const { onSetLabel, ...otherProps } = props;

    const refInstance = useRefContext();

    const currentLabel = useWatch('currentLabel') || AllLabelKey;

    const updateImagesLabel = useUpdateImagesLabel();

    function handleItemClick({ id, props }: any) {
        switch (id) {
            case 'open-image':
                onOpen(props);
                break;
            case 'open-image-folder':
                onOpenFolder(props);
                break;
            case 'set-label-image':
                onSetLabel?.(props);
                break;
            case 'reselect-image':
                onReselect(props);
                break;
            case 'remove-label-image':
                onRemoveLabel(props);
                break;
            case 'delete-image':
                onRemove(props);
                break;
        }
    }

    const onOpen = (image) => {
        LocalOpenFile(image.path);
    };

    const onOpenFolder = (image) => {
        const folderPath = image.path.substring(0, image.path.lastIndexOf('\\'));
        LocalOpenFolder(folderPath);
    };

    const onReselect = async (image) => {
        const path = await OpenFileDialog({
            title: '请选择图片',
            filters: [{ pattern: '*.jpg;*.png;*.gif', displayName: '图片' }]
        });
        const oldValue = imagesStore.get(image.path);
        const [, , fileInfo] = await Promise.all([
            imagesStore.remove(image.path),
            imagesStore.set(path, oldValue),
            GetFileInfo(path)
        ]);
        const list = [...refInstance.getValues().images] || [];
        const index = list.findIndex(l => l.path === image.path);
        if (index === -1) return;
        list[index] = {
            ...omit(fileInfo, 'isDir'),
            ...oldValue
        };
        refInstance.setValues({ images: list });
    };

    const onRemoveLabel = async (image) => {
        Modal.confirm({
            title: '操作提示',
            content: `确定将标签【${currentLabel}】从图片【${image.name || getFileNameByPath(image.path)}】中移除吗？`,
            onOk: async () => {
                const imageConfig = await removeImagesLabels([image.path], currentLabel);
                await updateImagesLabel(imageConfig);
                message.success('移除成功');
            }
        });
    };

    const onRemove = async (image) => {
        Modal.confirm({
            title: '操作提示',
            content: `确定删除图片【${image.name || getFileNameByPath(image.path)}】吗？`,
            onOk: async () => {
                const path = image.path;
                await imagesStore.remove(path);
                const list = [...refInstance.getValues().images] || [];
                const index = list.findIndex(l => l.path === image.path);
                if (index === -1) return;
                list.splice(index, 1);
                refInstance.setValues({ images: list });
                message.success('删除成功');
            }
        });
    };

    return (
        <Menu animation={false} theme='light' {...otherProps}>
            <Item id='open-image' onClick={handleItemClick}>
                打开
            </Item>
            <Separator />
            <Item id='open-image-folder' onClick={handleItemClick}>
                打开文件夹
            </Item>
            <Separator />
            <Item id='reselect-image' onClick={handleItemClick}>
                重映射
            </Item>
            <Separator />
            <Item id='set-label-image' onClick={handleItemClick}>
                设置标签
            </Item>
            <Separator />
            <Item
                id='remove-label-image'
                hidden={currentLabel === AllLabelKey}
                onClick={handleItemClick}
            >
                移除当前标签
            </Item>
            <Separator hidden={currentLabel === AllLabelKey} />
            <Item id='delete-image' onClick={handleItemClick}>
                <Typography.Text type='danger'>
                    删除
                </Typography.Text>
            </Item>
        </Menu>
    );
};

export default ImageMenu;