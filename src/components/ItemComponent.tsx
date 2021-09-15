import anchorme from 'anchorme';
import React, { Dispatch, SetStateAction, FC } from 'react';
import { Item } from '~data/Item';
import { ItemControlsProps } from '~components/ItemControls';

interface ItemComponentProps {
    item: Item;
    isFirst?: boolean;
    setItems: Dispatch<SetStateAction<Item[]>>;
    Controls: FC<ItemControlsProps>;
}

export function ItemComponent({ item, isFirst, setItems, Controls }: ItemComponentProps): JSX.Element {
    const className = `item ${isFirst ? 'first' : ''}`;
    const value = anchorme({
        input: item.value,
        options: {
            truncate: 40,
            attributes: {
                target: '_blank',
            },
        },
    });

    return (
        <div className={className}>
            <p className='value' dangerouslySetInnerHTML={{ __html: value }} />
            <Controls item={item} isFirst={isFirst} setItems={setItems} />
        </div>
    );
}
