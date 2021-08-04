export class Item {
    public uId: string;
    public value: string;
    public id: string;

    constructor(userId: string, value: string, id: string) {
        this.uId = userId;
        this.value = value;
        this.id = id;
    }
}
