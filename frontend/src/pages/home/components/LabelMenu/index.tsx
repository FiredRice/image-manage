import React from 'react';
import { Menu, Item, Separator, MenuProps } from 'react-contexify';

interface ILabelMenuProps extends Omit<MenuProps, 'children'> {
    onEdit?: (props: any) => void;
    onRemove?: (props: any) => void;
}

const LabelMenu: React.FC<ILabelMenuProps> = (props) => {

    const { onEdit, onRemove, ...otherProps } = props;

    function handleItemClick({ id, props }: any) {
        switch (id) {
            case 'edit-label':
                onEdit?.(props);
                break;
            case 'remove-label':
                onRemove?.(props);
                break;
        }
    }

    return (
        <Menu animation={false} theme='light' {...otherProps}>
            <Item id='edit-label' onClick={handleItemClick}>
                编辑
            </Item>
            <Separator />
            <Item id='remove-label' onClick={handleItemClick}>
                删除
            </Item>
        </Menu>
    );
};

export default LabelMenu;