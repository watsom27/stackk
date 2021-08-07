import React, { useEffect, useState } from 'react';
import { ItemComponent } from '~components/ItemComponent';
import { NewItem } from '~components/NewItem';
import { Title } from '~components/Title';
import { Wrapper } from '~components/Wrapper';
import { db } from '~data/Db';
import { Item } from '~data/Item';

export function View(): JSX.Element {
    const [items, setItems] = useState<Item[]>([]);
    const [loaded, setLoaded] = useState<boolean>(false);

    const toComponent = (item: Item) => <ItemComponent key={item.id} item={item} setItems={setItems} />;

    useEffect(() => {
        if (!db.isLoaded()) {
            db.load().then(() => {
                setLoaded(true);
                setItems(db.getItems());
            });
        }
    }, []);

    const first = items[0];
    const thing = [...items];
    thing.shift();

    return (
        <Wrapper title='View'>
            <Title title='Things To Do' />
            {first && <ItemComponent item={first} isFirst setItems={setItems} />}
            {thing.map(toComponent)}
            {loaded && <NewItem setItems={setItems} />}
        </Wrapper>
    );
}
