import React, { Dispatch, SetStateAction, useState, KeyboardEvent, useEffect } from 'react';
import { db } from '~data/Db';
import { Item } from '~data/Item';

interface NewItemProps {
    setItems: Dispatch<SetStateAction<Item[]>>;
}

export function NewItem({ setItems }: NewItemProps): JSX.Element {
    const [value, setValue] = useState<string>('');
    const [isReadOnly, setReadOnly] = useState<boolean>(false);

    const setItemsFromDb = () => setItems(db.getItems());

    useEffect(() => db.addUpdateListener(setItemsFromDb), []);

    const btnAddOnClick = () => {
        setReadOnly(true);

        if (value.length) {
            const newItem = Item.New(value);
            db.add(newItem);
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
            />
            <button
                className='done'
                type='button'
                onClick={btnAddOnClick}
                disabled={isReadOnly}
            >
                Add
            </button>
        </div>
    );
}
