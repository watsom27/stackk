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

interface DbLatestRelease {
    latest: string;
}

interface DbOrder {
    items: string[];
}

enum Collection {
    Items = 'items',
    Orders = 'orders',
    ViewMode = 'viewmode',
    LatestRelease = 'latestRelease',
}

type DbUpdateListener = () => void;
type Unsubscribe = () => void;

const DEFAULT_VERSION = 'v2.3.0';

class Db {
    private updateListeners = new Set<DbUpdateListener>();
    private itemCache = new Map<string, Item>();
    private order: string[] = [];
    private transactionNumber = 0;
    private loaded = false;
    private viewMode: ViewMode = ViewMode.Work;

    /**
     * Clear and reload the DB.
     * Call update listeners before and after
     * so the user gets a visual cue
     */
    public async reload(): Promise<void> {
        this.itemCache.clear();
        this.order = [];
        this.loaded = false;

        this.callUpdateListeners();

        await this.load();

        this.callUpdateListeners();
    }

    public isLoaded(): boolean {
        return this.loaded;
    }

    public async load(): Promise<void> {
        const db = firebase.firestore();
        const userId = LoginService.getUserId();

        const [
            viewMode,
            orderData,
        ] = await Promise.all(
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

    /**
     * Add a listener to be called when the db is updated
     * and this change needs to be reflected in the view
     *
     * @param {DbUpdateListener} listener Listener to call
     * @returns {Unsubscribe} Unsubscribe callback
     */
    public addUpdateListener(listener: DbUpdateListener): Unsubscribe {
        this.updateListeners.add(listener);

        return () => this.updateListeners.delete(listener);
    }

    public delete(item: Item): void {
        this.order = this.order.filter((id) => id !== item.id);

        this.persistDelete(item);
        this.persist();
    }

    public superBump(item: Item): void {
        const { order } = this;
        let index = order.indexOf(item.id);

        if (index > 0) {
            while (index > 0) {
                const temp = order[index - 1];
                order[index - 1] = order[index];
                order[index] = temp;

                index -= 1;
            }

            this.persist();
        }
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

    public unshift(item: Item): void {
        this.itemCache.set(item.id, item);
        this.order.push(item.id);

        this.persist();
    }

    public pop(): void {
        const first = this.order[0];
        const firstItem = this.itemCache.get(first);

        if (firstItem) {
            this.delete(firstItem);
        }

        this.callUpdateListeners();
        this.persist();
    }

    public setViewMode(mode: ViewMode): void {
        this.viewMode = mode;
        this.callUpdateListeners();
        this.persistViewMode();
    }

    public getViewMode(): ViewMode {
        return this.viewMode;
    }

    public toggleViewMode(): void {
        const newViewMode = this.getViewMode() === ViewMode.Home ? ViewMode.Work : ViewMode.Home;

        this.setViewMode(newViewMode);
    }

    /**
     * Delete all records for the currently logged in user
     */
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

    public async getLatestRelease(): Promise<string> {
        const db = firebase.firestore();
        const userId = LoginService.getUserId();
        const releaseDoc = await db.collection(Collection.LatestRelease).doc(userId).get();
        let result = DEFAULT_VERSION;

        if (releaseDoc.exists) {
            result = (releaseDoc.data() as DbLatestRelease).latest;
        }

        return result;
    }

    public async setLatestRelease(latest: string): Promise<void> {
        const db = firebase.firestore();
        const userId = LoginService.getUserId();
        const newValue: DbLatestRelease = {
            latest,
        };

        await db.collection(Collection.LatestRelease).doc(userId).set(newValue);
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
