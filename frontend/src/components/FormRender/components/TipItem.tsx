import React from 'react';
import { Form, FormItemProps, Row, Typography } from 'antd';
import classNames from 'classnames';
import { ITipProps, nameToId } from '../hooks';
import { findIndex, get, isArray } from 'lodash-es';

const TipItem: React.FC<FormItemProps & ITipProps> = (props) => {
    const {
        children,
        rowProps,

        tip,
        tipProps = {},
        prefix,
        prefixClass,
        prefixStyle,
        suffix,
        suffixClass,
        suffixStyle,
        topfix,
        topfixClass,
        topfixStyle,
        bottomfix,
        bottomfixClass,
        bottomfixStyle,

        name,
        rules,

        label,
        labelAlign,
        labelCol,
        noStyle,
        style,
        colon,
        extra,
        hasFeedback,
        help,
        htmlFor = name ? nameToId(name) : undefined,
        required = isArray(rules) ? findIndex(rules, value => get(value, 'required')) !== -1 : false,
        tooltip,
        wrapperCol,

        ...otherProps
    } = props;

    const { className: tipClass, ...otherTipProps } = tipProps;

    const tipFormProps = {
        label,
        labelAlign,
        labelCol,
        noStyle,
        style,
        colon,
        extra,
        hasFeedback,
        help,
        htmlFor,
        required,
        tooltip,
        wrapperCol
    };

    return (
        (!!tip || !!prefix || !!suffix || !!topfix || !!bottomfix) ? (
            <Form.Item {...tipFormProps}>
                {
                    !!topfix && (
                        <div
                            className={classNames('mg-b-5', topfixClass)}
                            style={topfixStyle}
                        >
                            {topfix}
                        </div>
                    )
                }
                <Row align='middle' {...rowProps}>
                    {
                        !!prefix && (
                            <div
                                className={classNames('mg-r-5', prefixClass)}
                                style={prefixStyle}
                            >
                                {prefix}
                            </div>
                        )
                    }
                    <Form.Item
                        name={name}
                        rules={rules}
                        {...otherProps}
                        noStyle
                    >
                        {children}
                    </Form.Item>
                    {
                        !!tip && (
                            <Typography.Text
                                type='secondary'
                                className={classNames('mg-l-5', tipClass)}
                                {...otherTipProps}
                            >
                                {tip}
                            </Typography.Text>
                        )
                    }
                    {
                        !!suffix && (
                            <div
                                className={classNames('mg-l-5', suffixClass)}
                                style={suffixStyle}
                            >
                                {suffix}
                            </div>
                        )
                    }
                </Row>
                {
                    !!bottomfix && (
                        <div
                            className={classNames('mg-t-5', bottomfixClass)}
                            style={bottomfixStyle}
                        >
                            {bottomfix}
                        </div>
                    )
                }
            </Form.Item>
        ) : (
            <Form.Item
                name={name}
                rules={rules}
                {...tipFormProps}
                {...otherProps}
            >
                {children}
            </Form.Item>
        )
    );
};

export default TipItem;