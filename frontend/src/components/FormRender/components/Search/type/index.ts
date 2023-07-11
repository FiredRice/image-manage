import { ComponentType, DependencyList } from 'react';
import { ColProps, FormInstance, FormItemProps, RadioGroupProps } from 'antd';
import { FormInstance as NormalFormInstance } from 'rc-field-form';
import { IInputSearchProps, IRangePickerProps, IRInputProps, IRSelectProps } from '../components';
import { ITipProps } from '../../../hooks';
import { IDatePickerProps } from '../components/DatePicker';

interface IBaseValue<T = any> extends Omit<FormItemProps<T>, 'name'>, ITipProps {
    key?: (keyof T | '')[] | (keyof T | '');
    visible?: ((form: NormalFormInstance<T>) => boolean) | boolean;
    // 行数，仅在非 default 模式下生效
    lineNumber?: number;
    // 列参数，仅在 gird 模式下生效
    colProps?: ColProps;
}

interface IInputProps<T = any> extends IBaseValue<T> {
    type: 'input';
    props?: IRInputProps | ((form: NormalFormInstance) => IRInputProps);
}

interface ISearchProps<T = any> extends IBaseValue<T> {
    type: 'search';
    props?: IInputSearchProps | ((form: NormalFormInstance) => IInputSearchProps);
}

interface ISelectProps<T = any> extends IBaseValue<T> {
    type: 'select';
    props?: IRSelectProps | ((form: NormalFormInstance) => IRSelectProps);
}

interface IRadiosProps<T = any> extends IBaseValue<T> {
    type: 'radios';
    props?: RadioGroupProps | ((form: NormalFormInstance) => RadioGroupProps);
}

interface IDatePickersProps<T = any> extends IBaseValue<T> {
    type: 'date-picker';
    props?: IDatePickerProps | ((form: NormalFormInstance) => IDatePickerProps);
}

interface IRangePicker<T = any> extends IBaseValue<T> {
    type: 'range-picker';
    props?: IRangePickerProps | ((form: NormalFormInstance) => IRangePickerProps);
}


interface IComponent<T = any, K = any> extends IBaseValue<T> {
    type: 'component';
    component: ComponentType<K>;
    props?: K | ((form: NormalFormInstance) => K);
}

export type ICombineProps<T = any, K = any> = IInputProps<T> | ISearchProps<T> | ISelectProps<T> | IRadiosProps<T> | IDatePickersProps<T> | IRangePicker<T> | IComponent<T, K>;

export type FilterTableState<State = any> = {
    [Key in keyof State]?: State[Key];
};

export type IuseSearchOptions = {
    watch?: boolean;
    deps?: DependencyList;
    form?: FormInstance;
}

export type IWatchResult<T = any> = {
    /**
     * form 实例
     */
    form: FormInstance<any>;
    /**
     * FormRender.Search 必要的 schemas
     */
    schemas: {
        form: FormInstance<any>;
        schema: any;
        watch: boolean;
        onValuesChange: (values: any) => any;
    };
    /**
     * 自动打平参数映射的 state
     */
    state: FilterTableState<T>;
    /**
     * setState
     */
    setState: (state: FilterTableState<T>) => void;
    /**
     * 直接获取 state 数据
     */
    getState: () => FilterTableState<T>;
    /**
     * 设置表单值
     */
    setFormValue: (state: FilterTableState<T>) => void;
    /**
     * 获取表单值
     */
    getFormValue: () => FilterTableState<T>;
};

export type KeysMap = {
    [x: string]: {
        // 字段类型
        type: 'string' | 'array';
        // 字段坐标
        positon: number;
        // 源字段记录
        originKey: any;
    };
};