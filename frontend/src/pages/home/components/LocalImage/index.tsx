import React from 'react';
import { Image, ImageProps } from 'antd';
import ERROR from './images/error.png';

interface ILocalImageProps extends ImageProps {
}

const LocalImage: React.FC<ILocalImageProps> = (props) => {

    const { src = '', ...otherProps } = props;

    return (
        <Image
            src={`wails/${src}`}
            fallback={ERROR}
            {...otherProps}
        />
    );
};

export default LocalImage;