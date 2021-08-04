import React, { Dispatch, SetStateAction, useState, KeyboardEvent } from 'react';
import { db } from '~data/Db';
import { Item } from '~data/Item';

interface NewItemProps {
    setItems: Dispatch<SetStateAction<Item[]>>;
}

export function NewItem({ setItems }: NewItemProps): JSX.Element {
    const [value, setValue] = useState<string>('');
    const [isReadOnly, setReadOnly] = useState<boolean>(false);

    const btnAddOnClick = async () => {
        await db.add(value);
        setItems(await db.getItems());
        setValue('');
        setReadOnly(false);
    };

    const onKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            setReadOnly(true);
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
            >
                Add
            </button>
        </div>
    );
}
