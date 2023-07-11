import React, { CSSProperties, useCallback, useEffect, useState } from 'react';
import { Input } from 'antd';
import { SearchProps } from 'antd/lib/input';

export interface IInputSearchProps extends Omit<SearchProps, 'onChange' | 'onSearch'> {
    value?: string;
    onChange?: (value: string) => void;
    width?: CSSProperties['width'];
}

const InputSearch: React.FC<IInputSearchProps> = (props) => {
    const { onChange, value, width, style, ...otherProps } = props;

    const [innerName, setInnerName] = useState<string>('');

    const _onChange = useCallback((e) => {
        if (!e.target.value) {
            onChange && onChange('');
        }
        setInnerName(e.target.value || '');
    }, []);

    useEffect(() => {
        setInnerName(value || '');
    }, [value]);

    return (
        <Input.Search
            onChange={_onChange}
            onSearch={onChange}
            allowClear
            autoComplete='off'
            {...otherProps}
            value={innerName}
            style={{ width, ...style }}
        />
    );
};

export default InputSearch;