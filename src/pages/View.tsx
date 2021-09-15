import React, { useEffect, useState, useRef } from 'react';
import { ItemComponent } from '~components/ItemComponent';
import { NewItem } from '~components/NewItem';
import { Title } from '~components/Title';
import { Wrapper } from '~components/Wrapper';
import { db } from '~data/Db';
import { Item } from '~data/Item';
import { ItemControls } from '~components/ItemControls';
import { keyboardService } from '~service/keyboardService';

interface BooleanByRef {
    value: boolean;
}

export function View(): JSX.Element {
    const [items, setItems] = useState<Item[]>([]);
    const [loaded, setLoaded] = useState<boolean>(false);
    const [inputFocussed, setInputFocussed] = useState<BooleanByRef>({ value: false });
    const inputRef = useRef<HTMLInputElement>();

    const toComponent = (item: Item) => <ItemComponent key={item.id} item={item} setItems={setItems} Controls={ItemControls} />;

    console.log(inputFocussed.value);

    const onSpacePress = () => {
        if (!inputFocussed.value) {
            console.log(inputFocussed.value, 'win');
        }
    };

    useEffect(() => {
        if (!db.isLoaded()) {
            db.load().then(() => {
                setLoaded(true);
                setItems(db.getItems());
            });
        }
    }, []);

    useEffect(() => keyboardService.addListener('Enter', () => inputRef.current?.focus()), []);
    useEffect(() => keyboardService.addListener(' ', onSpacePress), []);

    const first = items[0];
    const itemsClone = [...items];
    itemsClone.shift();

    return (
        <Wrapper title='View'>
            <Title title='Things To Do' />
            {first && <ItemComponent item={first} isFirst setItems={setItems} Controls={ItemControls} />}
            {itemsClone.map(toComponent)}
            {loaded && (
                <NewItem
                    inputBoxRef={inputRef}
                    setItems={setItems}
                    onFocus={() => setInputFocussed({ value: true })}
                    onBlur={() => setInputFocussed({ value: false })}
                />
            )}
        </Wrapper>
    );
}
