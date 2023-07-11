import { get, isArray, isEmpty, isNumber, isObject, isString } from 'lodash-es';
import { division, divisionPercent, divisionzero } from './format';

// 利用空字符串使得第一次匹配时匹配到泛型的声明
type IKey<T> = keyof T | '';

export function getArray<T, K = any>(obj: T, key: IKey<T>, defaultValue?: Array<K>): Array<K>;
export function getArray<K = any>(obj: any, key: string, defaultValue?: Array<K>): Array<K>;
export function getArray<K = any>(obj: any, key: any, defaultValue: Array<K> = []): Array<K> {
    const result = get(obj, key) || defaultValue;
    return isArray(result) ? result : defaultValue;
};

export function getString<T>(obj: T, key: IKey<T>, defaultValue?: string): string;
export function getString(obj: any, key: string, defaultValue?: string): string;
export function getString(obj: any, key: any, defaultValue: string = ''): string {
    const value = get(obj, key);
    const result = value == null ? defaultValue : !isString(value) ? `${value}` : !!value ? value : defaultValue;
    return result;
};

export function getNumber<T>(obj: T, key: IKey<T>, defaultValue?: number): number;
export function getNumber(obj: any, key: string, defaultValue?: number): number;
export function getNumber(obj: any, key: any, defaultValue: number = 0): number {
    const value = get(obj, key);
    const result = (value == null) ? defaultValue : (isNumber(value) ? value : (parseFloat(value) || defaultValue));
    return result;
};

export function getBoolean<T>(obj: T, key: IKey<T>, defaultValue?: boolean): boolean;
export function getBoolean(obj: any, key: string, defaultValue?: boolean): boolean;
export function getBoolean(obj: any, key: any, defaultValue: boolean = false): boolean {
    const value = get(obj, key);
    const result = (value == null) ? defaultValue : !!value;
    return result;
};

export function getObject<T, K = any>(obj: T, key: IKey<T>, defaultValue?: K): K;
export function getObject<K = any>(obj: any, key: string, defaultValue?: K): K;
export function getObject(obj: any, key: any, defaultValue: any = {}): any {
    const result = get(obj, key) || defaultValue;
    return isObject(result) && !isArray(result) ? result : defaultValue;
};

/**
 * 获取格式化整数
 */
export function getNumString<T>(obj: T, key: IKey<T>, defaultValue?: number): string;
export function getNumString(obj: any, key: string, defaultValue?: number): string;
export function getNumString(obj: any, key: any, defaultValue: number = 0): string {
    return division(getNumber(obj, key, defaultValue));
};

/**
 * 获取格式化小数
 */
export function getNumStringZero<T>(obj: T, key: IKey<T>, defaultValue?: number): string;
export function getNumStringZero(obj: any, key: string, defaultValue?: number): string;
export function getNumStringZero(obj: any, key: any, defaultValue: number = 0): string {
    return divisionzero(getNumber(obj, key, defaultValue));
};

/**
 * 获取百分比
 */
export function getPercent<T>(obj: T, key: IKey<T>, defaultValue?: number): string;
export function getPercent(obj: any, key: string, defaultValue?: number): string;
export function getPercent(obj: any, key: any, defaultValue: number = 0): string {
    return divisionPercent(getNumber(obj, key, defaultValue));
};

/**
 * 去除对象中值为 null 和 undefined 的属性
 *  - 不改变原对象
 * @param obj 被操作对象
 * @param deep 深度遍历
 * @returns newObj 新对象
 */
export const getEffectiveParams = (obj: any, deep = true) => {
    const result = {} as any;
    isObject(obj) && !isEmpty(obj) && Object.keys(obj).forEach(item => {
        if (obj[item] !== null && obj[item] !== undefined) {
            if (isObject(obj[item]) && !isArray(obj[item]) && deep) {
                result[item] = getEffectiveParams(obj[item], true);
            } else {
                result[item] = obj[item];
            }
        }
    });
    return result;
};

/**
 * 计算字符串像素长度
 * @param str 字符串
 * @param fontSize 字体大小，默认：14
 * @returns 像素长度
 * ---
 * 字符串的像素宽度和字体的大小有关。
 * - 双字节字符的像素宽度等于字体的大小；
 * - 其余字符像素宽度 **暂且算作** 字体大小的3/5。
 */
export function getStringLenPx(str: string, fontSize: number = 14) {
    const { length } = str;
    const matchLength = str.match(/[^\x00-\xff]/g)?.length || 0;
    return matchLength * fontSize + Math.ceil((length - matchLength) * fontSize * 3 / 5);
}

export function getFileNameByPath(filePath: string) {
    const parts = filePath.split(/[\/\\]/);
    return parts.pop();
}
