import React, { CSSProperties, useState } from 'react';
import { DatePicker as Picker } from 'antd';
import { RangePickerProps } from 'antd/lib/date-picker';
import { isArray } from 'lodash-es';
import dayjs from 'dayjs';

const getDisabledBefore = (current, disabledBeforeToday, disabledToday) => {
    return disabledBeforeToday ? (current && current < dayjs().subtract(disabledToday ? 0 : 1, 'day')) : false;
}

const getDisabledAfter = (current, disabledAfterToday, disabledToday) => {
    return disabledAfterToday ? (current && current > dayjs().subtract(disabledToday ? 1 : 0, 'day')) : false;
}

export interface IRangePickerProps extends Omit<RangePickerProps, 'onCalendarChange' | 'value' | 'onChange'> {
    selectRange?: number | 'infinity';
    disabledToday?: boolean;
    disabledAfterToday?: boolean;
    disabledBeforeToday?: boolean;
    value?: string[] | null | undefined;
    onChange?: (dateStrings: any) => void;
    width?: CSSProperties['width'];
}

const RangePicker: React.FC<IRangePickerProps> = (props) => {
    const {
        selectRange = 'infinity',
        disabledToday = false,
        disabledAfterToday = false,
        disabledBeforeToday = false,
        value,
        onChange,
        width,
        style,
        disabledDate,
        ...otherProps
    } = props;

    const [dates, setDates] = useState<any>(value || []);

    const _disabledDate = current => {
        if (disabledToday && !(disabledAfterToday || disabledBeforeToday)) {
            return current && dayjs().isSame(current, 'day');
        }
        const disabeldAfter = getDisabledAfter(current, disabledAfterToday, disabledToday);
        const disabledBefore = getDisabledBefore(current, disabledBeforeToday, disabledToday);
        if (selectRange === 'infinity') {
            return disabeldAfter || disabledBefore || disabledDate?.(current) || false;
        } else {
            if (!dates || dates.length === 0) {
                return disabeldAfter || disabledBefore || disabledDate?.(current) || false;
            }
            const targetValue = selectRange - 1;
            const tooEarly = (dates[0] && current.diff(dates[0], 'days') > targetValue) || disabledBefore;
            const tooLate = (dates[1] && dayjs(dates[1]).diff(current, 'days') > targetValue) || disabeldAfter;
            return tooEarly || tooLate || disabledDate?.(current) || false;
        }
    };

    const onDateChange = (dates, dateString) => {
        onChange?.(dateString[0] ? dateString : null);
    };

    const getValue = (): any => {
        if (isArray(value) && value.length === 2) {
            return [value[0] ? dayjs(value[0]) : undefined, value[1] ? dayjs(value[1]) : undefined];
        }
        return null;
    };

    return (
        <Picker.RangePicker
            {...otherProps}
            value={getValue()}
            onChange={onDateChange}
            disabledDate={_disabledDate}
            onCalendarChange={val => setDates(val)}
            style={{ width, ...style }}
        />
    );
};

export default RangePicker;
