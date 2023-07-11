import React, { CSSProperties, ReactNode } from 'react';
import './style/index.less';

interface IKeepVisibleProps {
    visible?: boolean;
    className?: string;
    style?: CSSProperties;
    children?: ReactNode;
}

const KeepVisible: React.FC<IKeepVisibleProps> = (props) => {

    const { visible, children, className, style } = props;

    const onClick = (e) => {
        if (!visible) {
            e.stopPropagation();
            e.preventDefault();
        }
    };

    return (
        <div
            className={!visible ? `m-keep-visible-hidden ${className}` : className}
            style={style}
            onClick={onClick}
        >
            {children}
        </div>
    );
};

export default KeepVisible;