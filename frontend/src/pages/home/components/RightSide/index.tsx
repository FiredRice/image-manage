import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Card, Checkbox, Dropdown, Empty, List, MenuProps, Modal, Pagination, Row, message } from 'antd';
import { KeepVisible } from 'src/components';
import { AllLabelKey, useRefContext, useUpdateImagesLabel, useWatch } from '../../hooks/context';
import { isArray, keyBy, remove as loRemove, omit } from 'lodash-es';
import ImageItem from '../ImageItem';
import { useContextMenu } from 'react-contexify';
import ImageMenu from '../ImageMenu';
import { removeImagesLabels, transArrayToMap, useImagesEvents, usePagination, useScroll } from './hooks';
import LabelSet from '../LabelSet';
import { useModalState } from 'src/hooks';
import { imagesStore } from 'src/service/store';
import { OpenDirectory } from 'wailsjs/go/dialog/Dialog';
import { getFileNameByPath } from 'src/utils';
import { GetFilesInfo } from 'wailsjs/go/file/File';
import './style/index.less';

const MENU_ID = 'image-menu';

const RightSide = () => {

	const refInstance = useRefContext();

	const updateImagesLabel = useUpdateImagesLabel();

	const currentLabel = useWatch('currentLabel') || AllLabelKey;
	const checkList = useWatch('checkList') || [];
	const list = useWatch('images') || [];

	const [checkMode, setCheckMode] = useState<boolean>(false);

	const { show } = useContextMenu({ id: MENU_ID });

	const [labelModal, openLabelModal, closeLabelModal] = useModalState();

	const isAllTab = currentLabel === AllLabelKey;

	const filterList = useMemo(() => {
		if (currentLabel === AllLabelKey) {
			return list;
		} else {
			return list.filter(l => l.labels.includes(currentLabel));
		}
	}, [list, currentLabel]);

	const pagination = usePagination();
	const [domRef, scroll] = useScroll();

	// 事件监听
	useImagesEvents();

	// 切换标签重置页面
	useEffect(() => {
		setCheckMode(false);
		refInstance.setValues({ currentPage: 1 });
	}, [currentLabel]);

	// 切换分页滚动条置顶
	useEffect(() => {
		scroll(0);
	}, [pagination, currentLabel]);

	const onContextMenu = useCallback((props) => {
		return (e) => {
			show({ event: e, props });
		};
	}, []);

	const onCheckChange = () => {
		if (checkMode) {
			refInstance.setValues({ checkList: [] });
		}
		setCheckMode(!checkMode);
	};

	const onCheckAll = () => {
		if (checkList.length === filterList.length) {
			refInstance.setValues({ checkList: [] });
			return;
		}
		refInstance.setValues({ checkList: filterList.map(i => i.path) });
	};

	const onRemoveCheck = () => {
		Modal.confirm({
			title: '操作提示',
			content: `确定彻底删除这 ${checkList.length} 张图片吗？`,
			onOk: async () => {
				await imagesStore.batchRemove(checkList);
				let list = [...refInstance.getValues().images] || [];
				const checkMap = transArrayToMap(checkList);
				list = loRemove(list, (l) => !checkMap[l.path]);
				setCheckMode(false);
				refInstance.setValues({
					checkList: [],
					images: list
				});
				message.success('删除成功');
			}
		});
	};

	const onBatchRemoveLabel = () => {
		Modal.confirm({
			title: '操作提示',
			content: `确定从这 ${checkList.length} 张图片中移除标签【${currentLabel}】吗？`,
			onOk: async () => {
				const imageConfig = await removeImagesLabels(checkList, currentLabel);
				await updateImagesLabel(imageConfig);
				setCheckMode(false);
				refInstance.setValues({ checkList: [] });
				message.success('移除成功');
			}
		});
	};

	const onLabelSet = useCallback((image) => {
		closeLabelModal();
		const list = [...refInstance.getValues().images] || [];
		if (isArray(image)) {
			image.forEach(i => {
				const index = list.findIndex(l => l.path === i.path);
				if (index === -1) return;
				list[index] = i;
			});
			setCheckMode(false);
			refInstance.setValues({
				checkList: [],
				images: list
			});
		} else {
			const index = list.findIndex(l => l.path === image.path);
			if (index === -1) return;
			list[index] = image;
			refInstance.setValues({ images: list });
		}
	}, []);

	const onBatchSetLabels = () => {
		const checkMap = transArrayToMap(checkList);
		const records: any[] = [];
		filterList.forEach(l => {
			if (!checkMap[l.path]) return;
			records.push(l);
		});
		openLabelModal(records);
	};

	const onBatchReselect = async () => {
		const folder = await OpenDirectory({
			title: '选择文件夹'
		});
		if (!folder) {
			message.error('重映射失败');
			return;
		}
		const imageConfig: any = {};
		const checkMap: any = {};
		for (let i = 0; i < checkList.length; i++) {
			const oldPath = checkList[i];
			const name = getFileNameByPath(oldPath);
			const newPath = `${folder}\\${name}`;
			imageConfig[newPath] = imagesStore.get(oldPath);
			checkMap[oldPath] = newPath;
		}
		const pathList = Object.keys(imageConfig);
		const [, , fileInfos] = await Promise.all([
			imagesStore.batchRemove(checkList),
			imagesStore.setValues(imageConfig),
			GetFilesInfo(pathList)
		]);
		const fileInfoMap = keyBy(fileInfos, 'path');
		const list = [...refInstance.getValues().images] || [];
		for (let i = 0; i < list.length; i++) {
			const l = list[i];
			const newPath = checkMap[l.path];
			if (!!newPath) {
				list[i] = {
					...l,
					...omit(fileInfoMap[newPath], 'isDir')
				};
			}
		}
		refInstance.setValues({
			checkList: [],
			images: list
		});
		setCheckMode(false);
	};

	const dropMenus = useMemo(() => {
		const items: any[] = [
			{
				key: '1',
				label: '重映射',
				onClick: onBatchReselect
			},
			{
				key: '3',
				label: '删除',
				onClick: onRemoveCheck
			}
		];
		if (!isAllTab) {
			items.splice(1, 0, {
				key: '2',
				label: '移除',
				onClick: onBatchRemoveLabel
			});
		}
		return { items };
	}, [checkList]);

	return (
		<>
			<Card
				className='right-side-content'
				title={currentLabel}
				extra={
					<Row align='middle' wrap={false}>
						<KeepVisible className='flex' visible={checkMode}>
							<Button
								type='primary'
								className='mg-r-10'
								onClick={onCheckAll}
							>
								{checkList.length === filterList.length ? '取消全选' : '全选'}
							</Button>
							<Dropdown.Button
								className='mg-r-10'
								onClick={onBatchSetLabels}
								disabled={!checkList.length}
								menu={dropMenus}
							>
								批量添加标签
							</Dropdown.Button>
						</KeepVisible>
						<Button
							disabled={!filterList.length}
							onClick={onCheckChange}
						>
							{!checkMode ? '选择' : '取消'}
						</Button>
					</Row>
				}
			>
				<Checkbox.Group
					className='right-side-content-container'
					value={checkList}
				>
					<div ref={domRef} className='right-side-content-container-list'>
						<List
							dataSource={filterList}
							rowKey='path'
							pagination={pagination}
							renderItem={item => (
								<List.Item onContextMenu={onContextMenu(item)}>
									<ImageItem
										showCheck={checkMode}
										{...item}
									/>
								</List.Item>
							)}
						/>
					</div>
					{!!filterList.length && (
						<Pagination
							{...pagination}
							className='right-side-content-container-page'
							total={filterList.length}
							showTotal={total => `共 ${total} 张`}
						/>
					)}
				</Checkbox.Group>
			</Card>
			<ImageMenu
				id={MENU_ID}
				onSetLabel={openLabelModal}
			/>
			<LabelSet
				{...labelModal}
				onSuccess={onLabelSet}
				onCancel={closeLabelModal}
			/>
		</>
	);
};

export default RightSide;