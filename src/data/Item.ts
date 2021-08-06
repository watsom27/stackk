import { sha256 } from 'js-sha256';
import { LoginService } from '~service/loginService';

export class Item {
    public userId: string;
    public value: string;
    public id: string;

    constructor(userId: string, value: string, id: string) {
        this.userId = userId;
        this.value = value;
        this.id = id;
    }

    public static New(value: string): Item {
        const hash = sha256(`${value}${Date.now()}`);
        const userId = LoginService.getUserId();

        return new Item(userId, value, hash);
    }
}
