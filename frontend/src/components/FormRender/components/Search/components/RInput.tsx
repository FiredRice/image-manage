import React, { CSSProperties, useCallback } from 'react';
import { Input, InputProps } from 'antd';

export interface IRInputProps extends Omit<InputProps, 'onChange'> {
    onChange?: (value: string) => void;
    width?: CSSProperties['width'];
}

const RInput: React.FC<IRInputProps> = (props) => {
    const { onChange, width, style, ...otherProps } = props;

    const _onChange = useCallback((e) => {
        onChange && onChange(e.target.value || '');
    }, []);

    return (
        <Input
            allowClear
            autoComplete='off'
            style={{ width, ...style }}
            onChange={_onChange}
            {...otherProps}
        />
    );
};

export default RInput;