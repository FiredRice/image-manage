import React from 'react';
import { Col, ColProps } from 'antd';

interface ILayoutColProps extends ColProps {
    layout?: 'default' | 'gird' | 'multiline';
    spaceRight: number;
}

const LayoutCol: React.FC<ILayoutColProps> = (props) => {
    const { layout = 'default', spaceRight, style, children, ...otherProps } = props;
    return (
        <>
            {
                layout === 'gird' && (
                    <Col
                        style={{ marginRight: spaceRight, ...style }}
                        {...otherProps}
                    >
                        {children}
                    </Col>
                )
            }
            {
                layout === 'multiline' && (
                    <span style={{ marginRight: spaceRight }}>{children}</span>
                )
            }
            {
                layout === 'default' && (
                    <>{children}</>
                )
            }
        </>
    );
};

export default LayoutCol;