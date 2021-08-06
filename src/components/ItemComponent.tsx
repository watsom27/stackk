import React, { Dispatch, SetStateAction } from 'react';
import { db } from '~data/Db';
import { Item } from '~data/Item';

interface ItemComponentProps {
    item: Item;
    isFirst?: boolean;
    setItems: Dispatch<SetStateAction<Item[]>>;
}

function Controls({ item, isFirst, setItems }: ItemComponentProps): JSX.Element {
    const btnDoneOnClick = async () => {
        db.delete(item);
        setItems(db.getItems());
    };

    const btnBumpOnClick = async () => {
        db.bump(item);
        setItems(db.getItems());
    };

    const btnBumpntOnClick = async () => {
        db.bumpnt(item);
        setItems(db.getItems());
    };

    const completeButtonText = isFirst ? 'Done' : 'Delete';

    return (
        <div className='controls'>
            <div className='bump'>
                <button
                    className='btn-bump'
                    onClick={btnBumpOnClick}
                    type='button'
                />
                <button
                    className='btn-bumpnt'
                    onClick={btnBumpntOnClick}
                    type='button'
                />
            </div>
            <button
                onClick={btnDoneOnClick}
                type='button'
            >
                {completeButtonText}
            </button>
        </div>
    );
}

export function ItemComponent({ item, isFirst, setItems }: ItemComponentProps): JSX.Element {
    const className = `item ${isFirst ? 'first' : ''}`;

    return (
        <div className={className}>
            <p className='value'>
                {item.value}
            </p>
            <Controls item={item} isFirst={isFirst} setItems={setItems} />
        </div>
    );
}
