import React, { CSSProperties } from 'react';
import { DatePicker as AntDatePicker, DatePickerProps } from 'antd';
import dayjs from 'dayjs';

export type IDatePickerProps = DatePickerProps & {
    width?: CSSProperties['width'];
    value?: string;
    onChange?: (value: string) => void;
};

const DatePicker: React.FC<IDatePickerProps> = (props) => {

    const { width = 200, value, onChange, style, ...otherProps } = props;

    return (
        <AntDatePicker
            style={{ width, ...style }}
            value={!!value ? dayjs(value) : undefined}
            onChange={(dates, dateString) => {
                onChange?.(dateString);
            }}
            {...otherProps}
        />
    );
};

export default DatePicker;