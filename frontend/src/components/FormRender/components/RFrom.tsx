import React, { useCallback } from 'react';
import { Form, FormProps } from 'antd';
import classNames from 'classnames';
import { getArray } from 'src/utils/getter';
import { FormRenderV4Context, scrollToField } from '../hooks';
import { get } from 'lodash-es';

interface IRFormProps extends FormProps {
    scrollToFirstError?: boolean | ScrollIntoViewOptions;
    resetFormClass?: boolean;
    children?: any;
}

const RForm: React.FC<IRFormProps> = React.memo((props) => {
    const {
        className,
        onFinishFailed,
        scrollToFirstError = true,
        resetFormClass = false,
        form,
        children,
        ...otherProps
    } = props;

    const [_form] = Form.useForm(form);

    const _onFinishFailed = useCallback((errorInfo) => {
        if (!!scrollToFirstError) {
            scrollToField(getArray(errorInfo, 'errorFields[0].name'), scrollToFirstError, ({ isElementInViewport, scrollElement }) => {
                // 无法滚动到指定元素时，定位第一个有错误的结点执行滚动
                const errorNode = get(document.getElementsByClassName('ant-form-item-has-error'), '[0]');
                if (errorNode) {
                    const target = scrollElement(errorNode);
                    if (target) {
                        !isElementInViewport(target) && target.scrollIntoView(scrollToFirstError);
                    }
                }
            });
        }
        onFinishFailed && onFinishFailed(errorInfo);
    }, [onFinishFailed]);

    return (
        <FormRenderV4Context.Provider value={{ form: _form }}>
            <Form
                className={classNames({ 'form-reset': resetFormClass }, className)}
                onFinishFailed={_onFinishFailed}
                form={_form}
                {...otherProps}
            >
                {children}
            </Form>
        </FormRenderV4Context.Provider>
    );
});

export default RForm;