import { useEffect, useRef } from 'react';
import { Card, Input, Menu, Modal, Typography } from 'antd';
import { AllLabelKey, useRefContext, useUpdateImagesLabel, useWatch } from '../../hooks/context';
import { ItemType, MenuItemType } from 'antd/es/menu/hooks/useItems';
import { labelsStore } from 'src/service/store';
import EventManager from 'src/service/event';
import LabelModal from '../LabelModal';
import { useContextMenu } from 'react-contexify';
import LabelMenu from '../LabelMenu';
import { useModalState } from 'src/hooks';
import { removeLabel } from './hooks';
import './style/index.less';

const allMenu = {
    key: AllLabelKey,
    label: '全部',
};

const MENU_ID = 'label-menu';

const LeftSide = () => {

    const { show } = useContextMenu({ id: MENU_ID });

    const refInstance = useRefContext();

    const updateImagesLabel = useUpdateImagesLabel();

    const list = useWatch('labels') || [];
    const currentLabel = useWatch('currentLabel') || AllLabelKey;

    const allLabelList = useRef<ItemType<MenuItemType>[]>([]);

    const [labelModal, openLabelModal, closeLabelModal] = useModalState();

    const onContextMenu = (props) => {
        return (e) => {
            show({ event: e, props });
        };
    };

    function loadLabels() {
        const labelValues = labelsStore.getValues();
        const labels = Object.keys(labelValues);
        allLabelList.current = labels.map(l => ({
            key: l,
            label: (
                <div onContextMenu={onContextMenu(l)}>
                    <Typography.Text
                        className='left-side-card-label'
                        ellipsis={{ tooltip: l }}
                    >
                        {l}
                    </Typography.Text>
                </div>
            )
        }));
        refInstance.setValues({
            labels: [allMenu, ...allLabelList.current]
        });
    }

    useEffect(() => {
        const events = new EventManager();
        events.on('Create-Image-Label', openLabelModal);

        loadLabels();

        return () => {
            events.removeAll();
        };
    }, []);

    const onMenuClick = ({ key }) => {
        refInstance.setValues({
            currentLabel: key,
            checkList: []
        });
    };

    const onRemoveLabel = (key) => {
        Modal.confirm({
            title: '操作提示',
            content: `确定删除标签【${key}】吗？`,
            onOk: async () => {
                const list = [...refInstance.getValues().labels] || [];
                const imageConfig = await removeLabel(key);
                updateImagesLabel(imageConfig);
                const index = list.findIndex(l => l?.key == key);
                if (index === -1) return;
                list.splice(index, 1);
                allLabelList.current.splice(index - 1, 1);
                const current = currentLabel === key ? allMenu.key : currentLabel;
                refInstance.setValues({
                    currentLabel: current,
                    labels: list,
                });
            }
        });
    };

    const onSuccess = (value) => {
        const isEdit = !!labelModal.record;
        const newLabel: ItemType<MenuItemType> = {
            key: value,
            label: (
                <div onContextMenu={onContextMenu(value)}>
                    <Typography.Text
                        className='left-side-card-label'
                        ellipsis={{ tooltip: value }}
                    >
                        {value}
                    </Typography.Text>
                </div>
            )
        };
        const list = [...refInstance.getValues().labels] || [];
        if (isEdit) {
            const index = list.findIndex(l => l?.key === labelModal.record);
            if (index !== -1) {
                list[index] = newLabel;
                allLabelList.current[index - 1] = newLabel;
                const current = currentLabel === labelModal.record ? value : currentLabel;
                refInstance.setValues({
                    currentLabel: current,
                    labels: list
                });
            }
        } else {
            list.push(newLabel);
            allLabelList.current.push(newLabel);
            refInstance.setValues({ labels: list });
        }
        closeLabelModal();
    };

    const onFilter = (e) => {
        const searchKey = e.target.value || '';
        refInstance.setValues({ currentLabel: allMenu.key });
        if (!searchKey) {
            refInstance.setValues({
                labels: [allMenu, ...allLabelList.current]
            });
        } else {
            const result: any[] = [allMenu];
            allLabelList.current.forEach(v => {
                const key = (v?.key || '') as string;
                if (key.includes(searchKey)) {
                    result.push(v);
                }
            });
            refInstance.setValues({ labels: result });
        }
    };

    return (
        <>
            <Card
                title={
                    <Input
                        placeholder='筛选标签'
                        allowClear
                        onChange={onFilter}
                    />
                }
                className='left-side-card'
            >
                <Menu
                    selectedKeys={[currentLabel]}
                    onClick={onMenuClick}
                    items={list}
                />
            </Card>
            <LabelModal
                {...labelModal}
                onSuccess={onSuccess}
                onCancel={closeLabelModal}
            />
            <LabelMenu
                id={MENU_ID}
                onEdit={openLabelModal}
                onRemove={onRemoveLabel}
            />
        </>
    );
};

export default LeftSide;