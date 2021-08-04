import firebase from 'firebase/app';
import 'firebase/firestore';
import { Item } from '~data/Item';
import { LoginService } from '~service/loginService';

export interface DbItem {
    userId: string;
    value: string;
}

interface DbOrder {
    items: string[];
}

enum Collection {
    Items = 'items',
    Orders = 'orders',
}

class Db {
    private cache = new Map<string, Item>();
    private orderCache = new Map<string, string[]>();

    public async delete(item: Item): Promise<void> {
        const db = firebase.firestore();

        const deletePromise = db.collection(Collection.Items).doc(item.id).delete();
        const order = await this.getOrder();
        const newOrder = order.filter((id) => id !== item.id);

        const setOrderPromise = this.setOrder(newOrder);

        await Promise.all([deletePromise, setOrderPromise]);
    }

    public async bump(item: Item): Promise<void> {
        const order = await this.getOrder();
        const index = order.indexOf(item.id);

        if (index > 1) {
            const temp = order[index - 1];
            order[index - 1] = order[index];
            order[index] = temp;

            await this.setOrder(order);
        }
    }

    public async bumpnt(item: Item): Promise<void> {
        const order = await this.getOrder();
        const index = order.indexOf(item.id);

        if (index < order.length - 1) {
            const temp = order[index + 1];
            order[index + 1] = order[index];
            order[index] = temp;

            await this.setOrder(order);
        }
    }

    public async getItems(): Promise<Item[]> {
        const itemIds = await this.getOrder();
        const itemPromises: Array<Promise<Item>> = [];

        for (const itemId of itemIds) {
            itemPromises.push(this.getById(itemId));
        }

        return Promise.all(itemPromises);
    }

    public async add(value: string): Promise<void> {
        const db = firebase.firestore();

        const item: DbItem = {
            userId: LoginService.getUserId(),
            value,
        };

        const newItem = await db.collection(Collection.Items).add(item);
        const newId = newItem.id;

        const order = await this.getOrder();
        const newOrder = [...order, newId];

        await this.setOrder(newOrder);
    }

    private async getOrder(): Promise<string[]> {
        let result: string[];
        const userId = LoginService.getUserId();

        const db = firebase.firestore();

        if (this.orderCache.has(userId)) {
            result = this.orderCache.get(userId)!;
        } else {
            const orderDocument = await db.collection(Collection.Orders).doc(userId).get();

            if (orderDocument.exists) {
                const { items } = orderDocument.data() as DbOrder;

                result = items;
            } else {
                result = [];
            }
        }

        return result;
    }

    private async setOrder(order: string[]): Promise<void> {
        const userId = LoginService.getUserId();
        const db = firebase.firestore();

        const newOrder: DbOrder = {
            items: order,
        };

        await db.collection(Collection.Orders).doc(userId).set(newOrder);

        this.orderCache.clear();
    }

    private async getById(id: string): Promise<Item> {
        let result: Item;

        if (this.cache.has(id)) {
            result = this.cache.get(id)!;
        } else {
            const db = firebase.firestore();

            const itemDocument = await db.collection(Collection.Items).doc(id).get();
            const item = itemDocument.data();

            if (item) {
                const { userId, value } = item as DbItem;

                result = new Item(userId, value, id);

                this.cache.set(id, result);
            } else {
                throw new Error(`Item with id ${id} does not exist`);
            }
        }

        return result;
    }
}

export const db = new Db();
