import React, { CSSProperties } from 'react';
import { Select, SelectProps } from 'antd';
import { SelectValue } from 'antd/lib/select';

export interface IRSelectProps extends SelectProps<SelectValue> {
    width?: CSSProperties['width'];
}

const RSelect: React.FC<IRSelectProps> = (props) => {
    const { width, style, ...otherProps } = props;
    return (
        <Select
            allowClear
            style={{ width, ...style }}
            {...otherProps}
        />
    );
};

export default RSelect;