import React, { isValidElement } from 'react';
import { Form, FormItemProps } from 'antd';
import { isArray, isEqual, isFunction, isObject } from 'lodash-es';
import { ISchema, ITipProps } from '../hooks';
import TipItem from './TipItem';

/**
 * FormItemProps 与 ITipProps 会穿透给所有由该组件渲染的 Form.Item
 * 可被 schema 中的设置覆盖
 */
interface IRendersProps<Values = any> extends FormItemProps<Values>, ITipProps {
    schema: ISchema<Values>[];
}

const Renders: React.FC<IRendersProps> = React.memo((props) => {
    const {
        schema,
        shouldUpdate: _shouldUpdate,
        dependencies: _dependencies,
        ...otherFormProps
    } = props;

    const renderItem = (value: ISchema<any>, index: number, level: number) => {
        const {
            key = `${level}_${index}`,
            component = null as any,
            visible = true as any,
            dependencies,
            shouldUpdate,
            ...otherProps
        } = value;

        const isFunChild = isFunction(component);
        const isArrChild = isFunChild ? false : isArray(component);
        const isReactNode = isArrChild ? false : isValidElement(component) || !isObject(component);
        const isFunVisible = isFunction(visible);

        return (
            (isFunVisible || isFunChild) ? (
                <Form.Item
                    key={key}
                    dependencies={dependencies || _dependencies}
                    shouldUpdate={shouldUpdate || _shouldUpdate}
                    noStyle
                >
                    {(form) => {
                        const _component = isFunChild ? component(form) : component;
                        const _isArrChild = !isFunChild ? isArrChild : isArray(_component);
                        const _isReactNode = !isFunChild ? isReactNode : _isArrChild ? false : isValidElement(_component) || !isObject(_component);
                        return (
                            ((!isFunVisible && visible) || (isFunVisible && visible(form))) && (
                                <TipItem {...otherFormProps} {...otherProps}>
                                    {_isArrChild ?
                                        render(_component, level + 1) :
                                        _isReactNode ?
                                            _component :
                                            renderItem(_component, index, -Math.abs(level) - 1)}
                                </TipItem>
                            )
                        );
                    }}
                </Form.Item>
            ) : (
                visible && (
                    <TipItem
                        key={key}
                        dependencies={dependencies || _dependencies}
                        shouldUpdate={shouldUpdate || _shouldUpdate}
                        {...otherFormProps}
                        {...otherProps}
                    >
                        {isArrChild ?
                            render(component, level + 1) :
                            isReactNode ?
                                component :
                                renderItem(component, index, -Math.abs(level) - 1)}
                    </TipItem>
                )
            )
        );
    };

    const render = (schema: ISchema<any>[], level: number) => {
        return schema.map((value, index) => renderItem(value, index, level));
    };

    return (
        <>{render(schema, 0)}</>
    );
}, (prev, cur) => {
    const { schema: prevSchema, ...otherPrev } = prev;
    const { schema: curSchema, ...otherCur } = cur;
    return prevSchema === curSchema && isEqual(otherPrev, otherCur);
});

export default Renders;