import React from 'react';
import { Card, CardProps, Checkbox, List, Row, Typography } from 'antd';
import LocalImage from '../LocalImage';
import { convertBytes } from '../RightSide/hooks';
import { division, getFileNameByPath } from 'src/utils';
import { LocalOpenFile } from 'wailsjs/go/file/File';
import { useRefContext } from '../../hooks/context';

interface IImageItemProps extends Omit<CardProps, 'size'> {
    name?: string;
    path?: string;
    modTime?: string;
    size?: number;
    showCheck?: boolean;
}

const ImageItem: React.FC<IImageItemProps> = (props) => {

    const { name = '', path = '', modTime = '', size = 0, showCheck, ...otherProps } = props;

    const refInstance = useRefContext();

    const stopPropagation = (e) => {
        e.stopPropagation();
    };

    const openFile = async () => {
        if (showCheck) return;
        try {
            await LocalOpenFile(path);
        } catch (error) {
            console.log(error);
        }
    };

    const onCheck = () => {
        if (!showCheck) return;
        const checkList = [...refInstance.getValues().checkList] || [];
        const index = checkList.findIndex(l => l === path);
        if (index === -1) {
            checkList.push(path);
        } else {
            checkList.splice(index, 1);
        }
        refInstance.setValues({ checkList });
    };

    return (
        <Card
            hoverable
            title={
                <Row align='middle' justify='space-between'>
                    <Typography.Text ellipsis={{ tooltip: name }}>
                        {name || getFileNameByPath(path)}
                    </Typography.Text>
                    <div onDoubleClick={stopPropagation}>
                        {showCheck && <Checkbox value={path} />}
                    </div>
                </Row>
            }
            size='small'
            onDoubleClick={openFile}
            onClick={onCheck}
            className='width-100-percent'
            {...otherProps}
        >
            <List.Item.Meta
                avatar={
                    <div onDoubleClick={stopPropagation}>
                        <LocalImage
                            src={path}
                            width={70}
                            height={70}
                        />
                    </div>
                }
                title={
                    <Typography.Text ellipsis={{ tooltip: <div onDoubleClick={stopPropagation}>{path}</div> }}>
                        位置：{path}
                    </Typography.Text>
                }
                description={
                    <>
                        <Typography.Text type='secondary' className='font-12'>
                            修改时间：{modTime}
                        </Typography.Text>
                        <br />
                        <Typography.Text type='secondary' className='font-12'>
                            大小：{convertBytes(size)} ({division(size)} 字节)
                        </Typography.Text>
                    </>
                }
            />
        </Card>
    );
};

export default ImageItem;