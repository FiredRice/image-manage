import { useCallback, useEffect, useMemo, useRef } from 'react';
import { Form, Radio } from 'antd';
import { get, isArray, isEmpty, sortBy } from 'lodash-es';
import { DatePicker, InputSearch, RangePicker, RInput, RSelect } from '../components';
import { FilterTableState, ICombineProps, IuseSearchOptions, IWatchResult, KeysMap } from '../type';
import { useGetState } from 'ahooks';

/**
 * 根据数组创建链式对象，将value放入对象末尾
 * @param arr 链式对象数组
 * @param value 末尾值
 * @returns 对象
 */
const createObjByArray = (arr: Array<string>, value: any) => {
    const result = {} as any;
    let next = result;
    if (!isEmpty(arr)) {
        for (let i = 0; i < arr.length; i++) {
            if (i === arr.length - 1) {
                next[arr[i]] = value;
            } else {
                next[arr[i]] = {};
                next = next[arr[i]];
            }
        }
    }
    return result;
};

export const renderComponentMap = {
    'search': (props) => (
        <InputSearch {...props} />
    ),
    'input': (props) => (
        <RInput {...props} />
    ),
    'select': (props) => (
        <RSelect {...props} />
    ),
    'radios': (props) => (
        <Radio.Group {...props} />
    ),
    'date-picker': (props) => (
        <DatePicker {...props} />
    ),
    'range-picker': (props) => (
        <RangePicker {...props} />
    )
};

/**
 * 创建 Search 组件的 schema 并对其解析
 * @param schemas Search 组件的 schemas
 * @param options.watch 是否监听字段更新，默认为 true，不支持动态切换
 * @param options.deps schema 依赖字段
 * @param options.form 外部注入的 form 实例
 * @returns form form实例
 * @returns schemas Search 组件的 schemas 实例
 * @returns state 动态监听数据对象
 * @returns setState 修改 state 的函数
 */
export function useSearch<DataType = any>(schemas: ICombineProps<DataType>[], options?: IuseSearchOptions): IWatchResult<DataType>;
export function useSearch<DataType = any>(schemas: any[], options: IuseSearchOptions = {}): IWatchResult<DataType> {
    const { form: formInstance, watch = true, deps = [] } = options;

    const [form] = Form.useForm(formInstance);

    const helper = useRef({
        keysMap: {} as KeysMap,
        focus: true,
        loadFirst: true
    });

    const defaultState: FilterTableState<DataType> = {};
    if (helper.current.loadFirst) {
        helper.current.loadFirst = false;
        for (let i = 0; i < schemas.length; i++) {
            const schema = schemas[i];
            const { key, initialValue } = schema;
            if (key !== undefined) {
                if (isArray(key)) {
                    // 字段为数组时将其与值打平保存
                    for (let j = 0; j < key.length; j++) {
                        const currentKey = key[j];
                        helper.current.keysMap[currentKey] = {
                            type: 'array',
                            positon: j,
                            originKey: key
                        };
                        defaultState[currentKey] = get(initialValue, `[${j}]`);
                    }
                } else {
                    // 字段为字符串时直接保存
                    helper.current.keysMap[key] = {
                        type: 'string',
                        positon: 0,
                        originKey: key
                    };
                    defaultState[key] = initialValue;
                }
            }
        }
    }

    const [state, _setState, getState] = useGetState<FilterTableState<DataType>>(defaultState);

    useEffect(() => {
        return () => {
            helper.current.focus = false;
        };
    }, []);

    // 将 form 数据转换为打平的数据
    const valuesToState = useCallback((values) => {
        const stateObjArr: any[] = [];
        const { keysMap } = helper.current;
        const keys = Object.keys(values);
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const { originKey, type } = keysMap[key];
            const value = form.getFieldValue(originKey);
            if (type === 'array') {
                for (let j = 0; j < originKey.length; j++) {
                    const currentKey = originKey[j];
                    const result = { [currentKey]: get(value, j) };
                    stateObjArr.push(result);
                }
            } else {
                stateObjArr.push({ [originKey]: value });
            }
        }
        return Object.assign({}, getState(), ...stateObjArr);
    }, []);

    // 将打平的数据转换为 form 数据
    const stateToValues = useCallback((state) => {
        // 当前字段集合
        const keys = Object.keys(state);
        // 源字段对象集合
        const originValues: any[] = [];
        // 源字段与当前字段映射关系
        const originMap = new Map<string[], any[]>();
        // 结果集
        const result: any = {};
        // 字段映射记录
        const { keysMap } = helper.current;
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            if (keysMap[key].type !== 'array') {
                // 源字段非数组时直接保存
                result[key] = state[key];
            } else {
                // 保存源字段与当前字段映射关系
                const { originKey, positon } = keysMap[key];
                const value = originMap.get(originKey) || [];
                value.push({ positon, value: state[key] });
                originMap.set(originKey, value);
            }
        }
        originMap.forEach((value, key) => {
            const sortValue = sortBy(value, 'positon');
            const resultArr: any[] = [];
            // 源字段历史数据
            const historyValue = form.getFieldValue(key);
            // 将数据一一映射道源字段相应数组位置
            for (let i = 0; i < key.length; i++) {
                if (sortValue.length) {
                    const element = sortValue[0];
                    if (i === element.positon) {
                        resultArr.push(element.value);
                        sortValue.shift();
                    } else {
                        resultArr.push(get(historyValue, i));
                    }
                } else {
                    resultArr.push(get(historyValue, i));
                }
            }
            // 收集根据源字段创建的对象
            originValues.push(createObjByArray(key, resultArr));
        });
        return Object.assign({}, result, ...originValues);
    }, []);

    const onValuesChange = useCallback((values) => {
        const result = valuesToState(values);
        helper.current.focus && _setState(result);
        return result;
    }, []);

    const setFormValue = useCallback((state) => {
        helper.current.focus && form.setFieldsValue(stateToValues(state));
    }, []);

    const getFormValue = useCallback(() => {
        return valuesToState(form.getFieldsValue());
    }, []);

    const setState = useCallback((state) => {
        setFormValue(state);
        helper.current.focus && _setState(valuesToState(form.getFieldsValue()));
    }, []);

    const _schemas = useMemo(() => {
        return {
            schema: schemas,
            form,
            onValuesChange,
            watch
        };
    }, deps);

    return {
        form,
        schemas: _schemas,
        state,
        setState,
        getState,
        setFormValue,
        getFormValue
    };
}

/**
 * 用于单独创建一项 searchSchema
 * @param schema 
 * @returns schema
 */
export function createSearch<DataType = any, Component = any>(schema: ICombineProps<DataType, Component>) {
    return schema;
}