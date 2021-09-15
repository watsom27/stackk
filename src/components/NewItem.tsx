import React, { Dispatch, SetStateAction, useState, KeyboardEvent, useEffect, MutableRefObject } from 'react';
import { db } from '~data/Db';
import { Item } from '~data/Item';
import { keyboardService } from '~service/keyboardService';

interface NewItemProps {
    setItems: Dispatch<SetStateAction<Item[]>>;
    inputBoxRef: MutableRefObject<HTMLInputElement | undefined>;
    onFocus: () => void;
    onBlur: () => void;
}

export function NewItem({ setItems, inputBoxRef, onFocus, onBlur }: NewItemProps): JSX.Element {
    const [value, setValue] = useState<string>('');
    const [isReadOnly, setReadOnly] = useState<boolean>(false);

    const setItemsFromDb = () => setItems(db.getItems());

    useEffect(() => db.addUpdateListener(setItemsFromDb), []);

    const btnAddOnClick = () => {
        setReadOnly(true);

        if (value.length) {
            const newItem = Item.New(value);
            db.add(newItem);

            if (keyboardService.shiftDown) {
                db.superBump(newItem);
            }

            setItemsFromDb();
            setValue('');
        }

        setReadOnly(false);
    };

    const onKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            btnAddOnClick();
        }
    };

    return (
        <div className='item new'>
            <input
                value={value}
                onChange={(event) => setValue(event.target.value)}
                onKeyPress={onKeyPress}
                type='text'
                placeholder='Enter a new item...'
                readOnly={isReadOnly}
                ref={inputBoxRef as any}
                onFocus={onFocus}
                onBlur={onBlur}
            />
            <button
                className='done btn-add'
                type='button'
                onClick={btnAddOnClick}
                disabled={isReadOnly}
            >
                Add
            </button>
        </div>
    );
}
