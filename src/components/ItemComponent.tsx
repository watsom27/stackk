import React, { Dispatch, SetStateAction } from 'react';
import { Item } from '~data/Item';
import { ItemControls } from '~components/ItemControls';

interface ItemComponentProps {
    item: Item;
    isFirst?: boolean;
    setItems: Dispatch<SetStateAction<Item[]>>;
}

export function ItemComponent({ item, isFirst, setItems }: ItemComponentProps): JSX.Element {
    const className = `item ${isFirst ? 'first' : ''}`;

    return (
        <div className={className}>
            <p className='value'>
                {item.value}
            </p>
            <ItemControls item={item} isFirst={isFirst} setItems={setItems} />
        </div>
    );
}
