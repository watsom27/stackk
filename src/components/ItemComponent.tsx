import React, { Dispatch, SetStateAction } from 'react';
import { db } from '~data/Db';
import { Item } from '~data/Item';

interface ItemComponentProps {
    item: Item;
    isFirst?: boolean;
    setItems: Dispatch<SetStateAction<Item[]>>;
}

function Controls({ item, isFirst, setItems }: ItemComponentProps): JSX.Element {
    let result: JSX.Element;

    const btnDoneOnClick = async () => {
        await db.delete(item);
        setItems(await db.getItems());
    };

    const btnBumpOnClick = async () => {
        await db.bump(item);
        setItems(await db.getItems());
    };

    const btnBumpntOnClick = async () => {
        await db.bumpnt(item);
        setItems(await db.getItems());
    };

    if (isFirst) {
        result = (
            <button
                className='done'
                onClick={btnDoneOnClick}
                type='button'
            >
                Done
            </button>
        );
    } else {
        result = (
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
                    Delete
                </button>
            </div>
        );
    }

    return result;
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
