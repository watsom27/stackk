import React, { useEffect, useState, useRef } from 'react';
import { ItemComponent } from '~components/ItemComponent';
import { NewItem } from '~components/NewItem';
import { Title } from '~components/Title';
import { Wrapper } from '~components/Wrapper';
import { db } from '~data/Db';
import { Item } from '~data/Item';
import { ItemControls } from '~components/ItemControls';
import { keyboardService } from '~service/keyboardService';

export function View(): JSX.Element {
    const [items, setItems] = useState<Item[]>([]);
    const [loaded, setLoaded] = useState<boolean>(false);
    const inputRef = useRef<HTMLInputElement>();

    const toComponent = (item: Item) => <ItemComponent key={item.id} item={item} setItems={setItems} Controls={ItemControls} />;

    useEffect(() => {
        if (!db.isLoaded()) {
            db.load().then(() => {
                setLoaded(true);
                setItems(db.getItems());
            });
        }

        return keyboardService.addListener('Enter', () => inputRef.current?.focus());
    }, []);

    const first = items[0];
    const thing = [...items];
    thing.shift();

    return (
        <Wrapper title='View'>
            <Title title='Things To Do' />
            {first && <ItemComponent item={first} isFirst setItems={setItems} Controls={ItemControls} />}
            {thing.map(toComponent)}
            {loaded && <NewItem thing={inputRef} setItems={setItems} />}
        </Wrapper>
    );
}
