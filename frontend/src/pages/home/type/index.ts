import { ItemType, MenuItemType } from 'antd/es/menu/hooks/useItems';
import { file } from 'wailsjs/go/models';

export interface ImageFile extends Omit<file.FileInfo, 'isDir'> {
    labels: string[];
}

export interface LabelConfig {
    [x: string]: {
        ctime: string;
    };
}

export interface ManageContext {
    currentLabel: string;
    checkList: string[];
    labels: ItemType<MenuItemType>[];
    images: ImageFile[];
    currentPage: number;
    pageSize: number;
}
