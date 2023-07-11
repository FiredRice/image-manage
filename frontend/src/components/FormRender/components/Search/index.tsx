import React, { useCallback, useMemo } from 'react';
import { Form, FormInstance, FormProps, Row, RowProps, Space } from 'antd';
import { getArray, getNumber } from 'src/utils/getter';
import classNames from 'classnames';
import { groupBy, isArray, isFunction } from 'lodash-es';
import TipItem from '../TipItem';
import { renderComponentMap } from './hooks';
import { ICombineProps } from './type';
import LayoutCol from './components/LayoutCol';
import { FormLayout } from 'antd/lib/form/Form';

/**
 * @param schemas 必要的配置项，由 useSearch 生成
 * @param spaceSize 组件间距，默认为 10
 * @param layout 布局方式，默认为 default
 * @param layout default - 默认布局
 * @param layout multiline - 多行模式
 * @param layout gird - 栅格化布局，配置项中的 colProps 生效
 * @param lineProps 行内属性，非默认布局生效
 */
interface ISearchProps<T = any> extends Omit<FormProps<T>, 'form' | 'layout'> {
    schemas: {
        form: FormInstance<any>;
        schema: ICombineProps<T>[];
        watch: boolean;
        onValuesChange: (values: any) => any;
    };
    spaceSize?: number | [number, number];
    layout?: 'default' | 'gird' | 'multiline';
    lineProps?: RowProps;
    formLayout?: FormLayout;
    /**
     * 重置表单样式
     */
    resetFormClass?: boolean;
}

const Search: React.FC<ISearchProps> = React.memo((props) => {
    const {
        layout = 'default',
        formLayout = 'inline',
        resetFormClass = false,
        schemas,
        className,
        spaceSize = 10,
        lineProps,
        children,
        onValuesChange,
        onFinish,
        ...otherProps
    } = props;

    const { form, schema, onValuesChange: onSchemasChange, watch } = schemas;

    const groupSchemas = useMemo(() => {
        if (layout !== 'default') {
            const groupMap = groupBy(schema, 'lineNumber');
            const groupList = Object.keys(groupMap).map(key => {
                return {
                    lineNumber: parseInt(key) || 0,
                    values: groupMap[key]
                };
            }).sort((a, b) => a.lineNumber - b.lineNumber);
            return groupList;
        }
        return [];
    }, [layout, schema]);

    const { spaceRight, spaceBottom } = useMemo(() => {
        if (isArray(spaceSize)) {
            return {
                spaceRight: getNumber(spaceSize, '[0]'),
                spaceBottom: getNumber(spaceSize, '[1]'),
            };
        } else {
            return {
                spaceRight: spaceSize,
                spaceBottom: spaceSize
            };
        }
    }, [spaceSize]);

    const renderItem = useCallback((type, props) => {
        const { component: Component, ...otherProps } = props;
        if (type === 'component') {
            return (
                <Component {...otherProps} />
            );
        } else {
            return renderComponentMap[type](otherProps);
        }
    }, []);

    const render = useCallback((schema: any[]) => {
        return schema.map((value, index) => {
            const {
                type,
                key,
                props,
                component,
                lineNumber,
                colProps,
                visible = true,
                dependencies,
                shouldUpdate,
                ...otherProps
            } = value;

            const isFunVisible = isFunction(visible);
            const isFunProps = isFunction(props);

            return (
                <LayoutCol
                    key={index}
                    layout={layout}
                    spaceRight={index === schema.length - 1 ? 0 : spaceRight}
                    {...colProps}
                >
                    {
                        isFunProps || isFunVisible ? (
                            <Form.Item
                                dependencies={dependencies}
                                shouldUpdate={shouldUpdate}
                                noStyle
                            >
                                {(form) => {
                                    const _props = isFunProps ? props(form) : props;
                                    return (
                                        ((!isFunVisible && visible) || (isFunVisible && visible(form))) && (
                                            <TipItem
                                                name={key}
                                                {...otherProps}
                                            >
                                                {renderItem(type, { ..._props, component })}
                                            </TipItem>
                                        )
                                    );
                                }}
                            </Form.Item>
                        ) : (
                            visible && (
                                <TipItem
                                    name={key}
                                    dependencies={dependencies}
                                    shouldUpdate={shouldUpdate}
                                    {...otherProps}
                                >
                                    {renderItem(type, { ...props, component })}
                                </TipItem>
                            )
                        )
                    }
                </LayoutCol>
            );
        });
    }, [layout, spaceRight]);

    const _onValuesChange = useCallback(async (changedValues, values) => {
        onValuesChange && onValuesChange(changedValues, values);
        if (watch) {
            try {
                await form.validateFields();
                onSchemasChange(values);
            } catch (error) {
                const errorFields = getArray(error, 'errorFields');
                if (!errorFields.length) {
                    onSchemasChange(values);
                }
            }
        }
    }, [onValuesChange]);

    const _onFinish = useCallback((values) => {
        const _values = onSchemasChange(values);
        onFinish && onFinish(_values);
    }, [onFinish]);

    return (
        <Form
            className={classNames({ 'form-reset': resetFormClass }, 'form-render-search', className)}
            form={form}
            layout={formLayout}
            onValuesChange={_onValuesChange}
            onFinish={_onFinish}
            {...otherProps}
        >
            {
                layout === 'default' ? (
                    <Space
                        direction='horizontal'
                        className='form-render-search-space'
                        size={spaceSize}
                    >
                        {render(schema)}
                    </Space>
                ) : (
                    <div className='form-render-search-space-block'>
                        {
                            groupSchemas.map((line, index) => (
                                <div
                                    key={`form-search-line-${index}`}
                                    style={{ marginBottom: index === groupSchemas.length - 1 ? 0 : spaceBottom }}
                                >
                                    <Row align='top' wrap {...lineProps}>
                                        {render(line.values)}
                                    </Row>
                                </div>
                            ))
                        }
                    </div>
                )
            }
        </Form>
    );
});

export default Search;