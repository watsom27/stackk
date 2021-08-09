import firebase from 'firebase/app';
import 'firebase/firestore';
import { Item } from '~data/Item';
import { LoginService } from '~service/loginService';

export enum ViewMode {
    Work,
    Home,
}

export interface DbItem {
    userId: string;
    value: string;
    mode: ViewMode;
}

interface DbViewMode {
    value: ViewMode;
}

interface DbOrder {
    items: string[];
}

enum Collection {
    Items = 'items',
    Orders = 'orders',
    ViewMode = 'viewmode',
}

type DbUpdateListener = () => void;
type Unsubscribe = () => void;

class Db {
    private updateListeners: DbUpdateListener[] = [];
    private itemCache = new Map<string, Item>();
    private order: string[] = [];
    private transactionNumber = 0;
    private loaded = false;
    private viewMode: ViewMode = ViewMode.Work;

    public isLoaded(): boolean {
        return this.loaded;
    }

    public async load(): Promise<void> {
        const db = firebase.firestore();
        const userId = LoginService.getUserId();

        const [viewMode, orderData] = await Promise.all(
            [
                db.collection(Collection.ViewMode).doc(userId).get(),
                db.collection(Collection.Orders).doc(userId).get(),
            ],
        );

        if (viewMode.exists) {
            this.viewMode = (viewMode.data() as DbViewMode).value;
        }

        if (orderData.exists) {
            this.order = (orderData.data() as DbOrder).items;
        }

        const itemPromises = [];

        for (const itemId of this.order) {
            itemPromises.push(db.collection(Collection.Items).doc(itemId).get());
        }

        const allItems = await Promise.all(itemPromises);

        for (const itemDoc of allItems) {
            if (itemDoc.exists) {
                const { userId, value, mode } = itemDoc.data() as DbItem;
                const item = new Item(userId, value, itemDoc.id, mode);

                this.itemCache.set(itemDoc.id, item);
            }
        }

        this.loaded = true;
    }

    public addUpdateListener(listener: DbUpdateListener): Unsubscribe {
        this.updateListeners.push(listener);

        return () => {
            this.updateListeners = this.updateListeners.filter((l) => l !== listener);
        };
    }

    public delete(item: Item): void {
        this.order = this.order.filter((id) => id !== item.id);

        this.persistDelete(item);
        this.persist();
    }

    public bump(item: Item): void {
        const { order } = this;
        const index = order.indexOf(item.id);

        if (index > 0) {
            const temp = order[index - 1];
            order[index - 1] = order[index];
            order[index] = temp;

            this.persist();
        }
    }

    public bumpnt(item: Item): void {
        const { order } = this;
        const index = order.indexOf(item.id);

        if (index < order.length - 1) {
            const temp = order[index + 1];
            order[index + 1] = order[index];
            order[index] = temp;

            this.persist();
        }
    }

    public getItems(): Item[] {
        const result: Item[] = [];

        for (const itemId of this.order) {
            const item = this.itemCache.get(itemId);

            if (item && item.viewMode === this.viewMode) {
                result.push(item);
            }
        }

        return result;
    }

    public add(item: Item): void {
        this.itemCache.set(item.id, item);
        this.order.push(item.id);

        this.persist();
    }

    // TODO Cookies
    public setViewMode(mode: ViewMode): void {
        this.viewMode = mode;
        this.callUpdateListeners();
        this.persistViewMode();
    }

    public getViewMode(): ViewMode {
        return this.viewMode;
    }

    public async deleteForUser(): Promise<void> {
        const db = firebase.firestore();

        await this.load();

        const itemPromises: Array<Promise<void>> = [];

        for (const itemId of this.order) {
            itemPromises.push(db.collection(Collection.Items).doc(itemId).delete());
        }

        await Promise.all(itemPromises);
        await db.collection(Collection.Orders).doc(LoginService.getUserId()).delete();
    }

    public signOut(): void {
        this.order = [];
        this.itemCache.clear();
        this.loaded = false;
    }

    private callUpdateListeners(): void {
        this.updateListeners.forEach((listener) => listener());
    }

    private async persistViewMode(): Promise<void> {
        const db = firebase.firestore();
        const userId = LoginService.getUserId();
        const newValue: DbViewMode = {
            value: this.viewMode,
        };

        await db.collection(Collection.ViewMode).doc(userId).set(newValue);
    }

    private async persistDelete(item: Item): Promise<void> {
        const db = firebase.firestore();

        await db.collection(Collection.Items).doc(item.id).delete();
    }

    private async persist(): Promise<void> {
        this.transactionNumber += 1;
        const startVersion = this.transactionNumber;

        const userId = LoginService.getUserId();
        const db = firebase.firestore();

        const orderPromise = db.collection(Collection.Orders).doc(userId).set({ items: this.order });
        const allPromises = [orderPromise];

        for (const itemId of this.order) {
            const item = this.itemCache.get(itemId);

            if (item) {
                const newItem: DbItem = {
                    userId,
                    value: item.value,
                    mode: item.viewMode,
                };

                allPromises.push(db.collection(Collection.Items).doc(item.id).set(newItem));
            }
        }

        await Promise.all(allPromises);

        if (startVersion === this.transactionNumber) {
            this.callUpdateListeners();
        }
    }
}

export const db = new Db();
