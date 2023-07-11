import { isString } from 'lodash-es';
import dayjs from 'dayjs';
import numeral from 'numeral';

export const divisionzero = val => `${numeral(val).format('0,0.00')}`;

export const division = val => `${numeral(val).format('0, 0')}`;

export const divisionPercent = val => `${divisionzero(val * 100)}%`;

type dayFormatOptions = {
    defaultValue?: string | null | undefined;
    format?: string;
};

export function dayFormat(day: string | null, options?: dayFormatOptions) {
    const { defaultValue = '--', format = 'YYYY-MM-DD HH:mm:ss' } = options || {};
    if (isString(day) && day) {
        const result = dayjs(day).format(format);
        return result === 'Invalid date' ? defaultValue : result;
    }
    return defaultValue;
};