import React, { useEffect, useMemo } from 'react';
import { Form, Modal, ModalProps, Select, message } from 'antd';
import { ImageFile } from '../../type';
import { imagesStore, labelsStore } from 'src/service/store';
import { isArray, uniq } from 'lodash-es';

interface ITextItemProps {
    value?: any;
}

const TextItem: React.FC<ITextItemProps> = ({ value }) => (
    <>{value || '--'}</>
);

interface ILabelSetProps extends ModalProps {
    record?: ImageFile | ImageFile[];
    onSuccess?: (value: ImageFile | ImageFile[]) => void;
}

const LabelSet: React.FC<ILabelSetProps> = (props) => {

    const { record, open, onSuccess, ...otherProps } = props;

    const isBatch = isArray(record);

    const [form] = Form.useForm();

    const options = useMemo(() => {
        const labelMap = labelsStore.getValues();
        return Object.keys(labelMap).map(l => ({
            label: l,
            value: l
        }));
    }, [open]);

    useEffect(() => {
        if (!open) return;
        if (isBatch) {
            form.setFieldsValue({
                name: record.map(r => r.name).join('、'),
                labels: []
            });
        } else {
            form.setFieldsValue(record);
        }
    }, [open]);

    const onFinish = async (values) => {
        if (isBatch) {
            const imageConfig: any = {};
            const successList: ImageFile[] = [];
            record.forEach(r => {
                imageConfig[r.path] = imagesStore.get(r.path);
                const labels: string[] = imageConfig[r.path].labels || [];
                labels.push(...values.labels);
                imageConfig[r.path].labels = uniq(labels);
                successList.push({
                    ...r,
                    ...imageConfig[r.path]
                });
            });
            await imagesStore.setValues(imageConfig);
            onSuccess?.(successList);
        } else {
            await imagesStore.set(record!.path, {
                labels: values.labels || []
            });
            onSuccess?.({
                ...record,
                ...values
            });
        }
        message.success('标签设置成功');
    };

    return (
        <Modal
            title='设置标签'
            open={open}
            onOk={() => form.submit()}
            forceRender
            {...otherProps}
        >
            <Form
                form={form}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 20 }}
                onFinish={onFinish}
            >
                <Form.Item
                    label='图片名称'
                    name='name'
                    style={{ marginBottom: 12 }}
                >
                    <TextItem />
                </Form.Item>
                <Form.Item
                    label='图片标签'
                    name='labels'
                    style={{ marginBottom: 0 }}
                >
                    <Select
                        mode='multiple'
                        placeholder='请选择标签'
                        options={options}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default LabelSet;