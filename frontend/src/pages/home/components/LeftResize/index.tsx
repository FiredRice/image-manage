import React, { ReactNode } from 'react';
import { ResizableBox } from 'react-resizable';
import { useSize } from 'ahooks';
import './style/index.less';

interface ILeftResizeProps {
    children?: ReactNode;
}

const LeftResize: React.FC<ILeftResizeProps> = (props) => {

    const { children } = props;

    const size = useSize(document.querySelector('body'));

    return (
        <ResizableBox
            width={220}
            minConstraints={[220, Infinity]}
            maxConstraints={[(size?.width || 320)/2-24, Infinity]}
            axis='x'
            resizeHandles={['e']}
            className='left-resize'
            handle={<div className='left-resize-handle' />}
        >
            {children}
        </ResizableBox>
    );
};

export default LeftResize;