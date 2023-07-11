import { DependencyList, ReactNode, useMemo, CSSProperties, createContext, useContext } from 'react';
import { FormInstance as FormInstatnceAntd, FormItemProps, RowProps } from 'antd';
import { TextProps } from 'antd/lib/typography/Text';
import { NamePath } from 'antd/lib/form/interface';
import { FormInstance } from 'rc-field-form';
import { get, isArray, isNumber, isString } from 'lodash-es';

export type ITipProps = {
    tip?: ReactNode;
    tipProps?: Omit<TextProps, 'type'>;
    prefix?: ReactNode;
    prefixClass?: string;
    prefixStyle?: CSSProperties;
    suffix?: ReactNode;
    suffixClass?: string;
    suffixStyle?: CSSProperties;
    topfix?: ReactNode;
    topfixClass?: string;
    topfixStyle?: CSSProperties;
    bottomfix?: ReactNode;
    bottomfixClass?: string;
    bottomfixStyle?: CSSProperties;
    rowProps?: RowProps;
};

type IChildComponent<T = any> = ReactNode | (ISchema<T>[]) | ISchema<T>;

export type ISchema<T = any> = FormItemProps<T> & ITipProps & {
    key?: string;
    visible?: ((form: FormInstance<T>) => boolean) | boolean;
    component?: IChildComponent | ((form: FormInstance<T>) => IChildComponent);
};

export function useSchema<T = any>(schemas: ISchema<T>[], deps: DependencyList = []) {
    return useMemo(() => {
        return schemas;
    }, deps);
};

export const nameToId = (name: NamePath) => {
    return isArray(name) ? name.join('_') : isNumber(name) ? `${name}` : name;
};

// 获取可滚动元素
const scrollElement = (element): HTMLElement | null => {
    if (!element) return null;
    const { height } = element?.getBoundingClientRect() || {};
    if (height || element === document.body) {
        return element;
    } else {
        return scrollElement(element.parentNode);
    }
};

// 判断元素是否在可视区域
const isElementInViewport = (element) => {
    const { top, left, bottom, right } = element?.getBoundingClientRect() || {};
    return (
        top >= 0 &&
        left >= 0 &&
        bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        right <= (window.innerWidth || document.documentElement.clientWidth)
    );
};

type CallBackParams = {
    isElementInViewport: typeof isElementInViewport;
    scrollElement: typeof scrollElement;
};

type CallBack = (params: CallBackParams) => void;

/**
 * 滚动到指定元素位置
 * - 当绑定 id 的结点高度为 0 或不存在时，antd 自带的滚动功能失效
 * - 手动实现逻辑如下：
 * - 若指定元素高度为 0 ，则寻找指定元素最近的拥有高度的父元素执行滚动
 * - 若指定元素不存在，则寻找绑定该 id 的 label 标签，对 label 执行滚动
 *  - 若 label 也不存在，则无法滚动，执行回调函数
 * @param name 指定结点的 NamePath
 * @param options 滚动配置
 * @param call 回调函数 
 */
export const scrollToField = (name: NamePath, options?: boolean | ScrollIntoViewOptions, call?: CallBack) => {
    const nameStr = nameToId(name);
    const labels = document.getElementsByTagName('label');
    const targetKey = Object.keys(labels).find(key => {
        return labels[key].htmlFor === nameStr;
    });
    const node = document.getElementById(nameStr) || (targetKey ? labels[targetKey] : null);
    if (node) {
        const target = scrollElement(node);
        if (target) {
            !isElementInViewport(target) && target.scrollIntoView(options);
        }
    } else {
        call && call({ isElementInViewport, scrollElement });
    }
};

// 根据 dependencies 生成 shouldUpdate 函数
export const useShouldUpdate = (dependencies: NamePath | NamePath[]) => {
    return (prevValues, currentValues) => {
        if (isArray(dependencies)) {
            let flag = false;
            for (const key of dependencies) {
                if (isString(key) && get(prevValues, key) !== get(currentValues, key)) {
                    flag = true;
                    break;
                } else if (isArray(key)) {
                    const strKey = key.join('.');
                    if (get(prevValues, strKey) !== get(currentValues, strKey)) {
                        flag = true;
                        break;
                    }
                }
            }
            return flag;
        }
        return get(prevValues, dependencies) !== get(currentValues, dependencies);
    };
};

export const FormRenderV4Context = createContext<{ form: FormInstatnceAntd; }>({} as any);

export const useFormInstance = () => {
    return useContext(FormRenderV4Context).form;
}