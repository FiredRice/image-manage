import React, { useEffect } from 'react';
import { Form, Input, Modal, ModalProps, Spin, message } from 'antd';
import { useDebounceFn, useSafeState } from 'ahooks';
import { imagesStore, labelsStore } from 'src/service/store';
import dayjs from 'dayjs';
import { AllLabelKey, useUpdateImagesLabel } from '../../hooks/context';

const labelNameRule = () => {
    return (_, value) => {
        if (!value || !value?.trim()) return Promise.reject(new Error('请输入标签名'));
        const labels = Object.keys(labelsStore.getValues());
        if (value === AllLabelKey || labels.includes(value)) return Promise.reject(new Error('标签名不能重复'));
        return Promise.resolve();
    };
};

interface ILabelModalProps extends ModalProps {
    record?: string;
    onSuccess?: (label: string) => void;
}

const LabelModal: React.FC<ILabelModalProps> = (props) => {

    const { record: label = '', open, onSuccess, onCancel, ...otherProps } = props;

    const isEdit = !!label;

    const [form] = Form.useForm();

    const [loading, setLoading] = useSafeState<boolean>(false);

    const updateImagesLabel = useUpdateImagesLabel();

    useEffect(() => {
        if (!open) return;
        if (isEdit) {
            form.setFieldsValue({
                labelName: label
            });
        } else {
            form.resetFields();
        }
    }, [open]);

    const submit = useDebounceFn(() => {
        if (loading) return;
        form.submit();
    }, { wait: 300, leading: true, trailing: false });

    const onFinish = async (values) => {
        let { labelName } = values;
        labelName = labelName?.trim() || '';
        setLoading(true);
        let value = {
            ctime: Date.now(),
        };
        const promises = [labelsStore.set(labelName, value)];
        if (isEdit) {
            // 修改本地存储
            const imageConfig: any = {};
            const images = imagesStore.getValues();
            Object.keys(images).forEach(p => {
                const image = images[p];
                if (image.labels?.includes(label)) {
                    imageConfig[p] = image;
                    const labelSet = new Set(imageConfig[p].labels || []);
                    labelSet.delete(label);
                    labelSet.add(labelName);
                    imageConfig[p].labels = [...labelSet];
                }
            });
            promises.push(imagesStore.setValues(imageConfig));
            promises.push(labelsStore.remove(label));
            // 修改前端界面
            updateImagesLabel(imageConfig);
        }
        try {
            await Promise.all(promises);
            onSuccess?.(labelName);
            message.success(`${isEdit ? '编辑' : '创建'}成功`);
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };

    return (
        <Modal
            title={`${isEdit ? '编辑' : '新建'}标签`}
            forceRender
            open={open}
            onOk={submit.run}
            onCancel={onCancel}
            {...otherProps}
        >
            <Form
                form={form}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 18 }}
                onFinish={onFinish}
            >
                <Spin spinning={loading}>
                    <Form.Item
                        label='标签名'
                        name='labelName'
                        style={{ marginBottom: 0 }}
                        required
                        rules={[{ validator: labelNameRule() }]}
                    >
                        <Input
                            placeholder='请输入标签名'
                            allowClear
                            autoComplete='off'
                        />
                    </Form.Item>
                </Spin>
            </Form>
        </Modal>
    );
};

export default LabelModal;