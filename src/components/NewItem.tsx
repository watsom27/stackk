import React, { Dispatch, SetStateAction, useState, KeyboardEvent, useEffect, MutableRefObject } from 'react';
import { db } from '~data/Db';
import { Item } from '~data/Item';
import { KeyboardService } from '~service/keyboardService';
import { ModeService, Mode } from '~service/modeService';

interface NewItemProps {
    setItems: Dispatch<SetStateAction<Item[]>>;
    inputBoxRef: MutableRefObject<HTMLInputElement | undefined>;
}

export function NewItem({ setItems, inputBoxRef }: NewItemProps): JSX.Element {
    const [value, setValue] = useState<string>('');
    const [isReadOnly, setReadOnly] = useState<boolean>(false);

    const btnAddOnClick = () => {
        setReadOnly(true);

        if (value.length) {
            const newItem = Item.New(value);
            db.unshift(newItem);

            if (KeyboardService.instance.shiftDown) {
                db.superBump(newItem);
            }

            setItems(db.getItems());
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
                onFocus={() => ModeService.instance.switchMode(Mode.Input)}
                onBlur={() => ModeService.instance.switchMode(Mode.Command)}
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
