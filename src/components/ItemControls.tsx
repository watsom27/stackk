import React, { Dispatch, SetStateAction } from 'react';
import { db } from '~data/Db';
import { Item } from '~data/Item';

interface ItemControlsProps {
    item: Item;
    isFirst?: boolean;
    setItems: Dispatch<SetStateAction<Item[]>>;
}

export function ItemControls({ item, isFirst, setItems }: ItemControlsProps): JSX.Element {
    const reload = () => setItems(db.getItems());

    const btnDoneOnClick = () => {
        db.delete(item);
        reload();
    };

    const btnSuperBumpOnClick = () => {
        db.superBump(item);
        reload();
    };

    const btnBumpOnClick = () => {
        db.bump(item);
        reload();
    };

    const btnBumpntOnClick = () => {
        db.bumpnt(item);
        reload();
    };

    const completeButtonText = isFirst ? 'Done' : 'Delete';

    return (
        <div className='controls'>
            {!isFirst && (
                <button
                    className='btn-superbump'
                    onClick={btnSuperBumpOnClick}
                    type='button'
                />
            )}
            <div className={`bump ${isFirst ? 'curve' : ''}`}>
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
                className='btn-done'
                onClick={btnDoneOnClick}
                type='button'
            >
                {completeButtonText}
            </button>
        </div>
    );
}
