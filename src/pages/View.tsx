import React, { useEffect, useState } from 'react';
import { ItemComponent } from '~components/ItemComponent';
import { Logout } from '~components/Logout';
import { NewItem } from '~components/NewItem';
import { Wrapper } from '~components/Wrapper';
import { db } from '~data/Db';
import { Item } from '~data/Item';

export function View(): JSX.Element {
    const [items, setItems] = useState<Item[]>([]);
    const [loaded, setLoaded] = useState<boolean>(false);

    const toComponent = (item: Item) => <ItemComponent key={item.id} item={item} setItems={setItems} />;

    useEffect(() => {
        db.getItems().then((t) => {
            setItems(t);
            setLoaded(true);
        });
    }, []);

    const first = items[0];
    const thing = [...items];
    thing.shift();

    return (
        <Wrapper title='View'>
            <div className='title'>
                <div className='logout-pad' />
                <h3>Things To Do</h3>
                <Logout />
            </div>
            {first && <ItemComponent item={first} isFirst setItems={setItems} />}
            {thing.map(toComponent)}
            {loaded && <NewItem setItems={setItems} />}
        </Wrapper>
    );
}
