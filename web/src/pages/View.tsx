import React, { useEffect, useState, useRef } from 'react';
import { ItemComponent } from '~components/ItemComponent';
import { NewItem } from '~components/NewItem';
import { Title } from '~components/Title';
import { Wrapper } from '~components/Wrapper';
import { db } from '~data/Db';
import { Item } from '~data/Item';
import { ItemControls } from '~components/ItemControls';
import { ModeService } from '~service/modeService';

export default function View(): JSX.Element {
    const [items, setItems] = useState<Item[]>([]);
    const [loaded, setLoaded] = useState(false);
    const inputRef = useRef<HTMLInputElement>();

    ModeService.instance.useModeService(inputRef);

    const toComponent = (item: Item) => <ItemComponent key={item.id} item={item} setItems={setItems} Controls={ItemControls} />;

    useEffect(() => {
        if (!db.isLoaded()) {
            db.load().then(() => {
                setLoaded(true);
                setItems(db.getItems());
            });
        }
    });

    const setItemsFromDb = () => setItems(db.getItems());
    useEffect(() => db.addUpdateListener(setItemsFromDb), []);

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
                />
            )}
        </Wrapper>
    );
}
