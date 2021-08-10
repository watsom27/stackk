import { sha256 } from 'js-sha256';
import { LoginService } from '~service/loginService';
import { db, ViewMode } from '~data/Db';

export class Item {
    private _userId: string;
    private _value: string;
    private _id: string;
    private _mode: ViewMode;

    constructor(userId: string, value: string, id: string, mode: ViewMode) {
        this._userId = userId;
        this._value = value;
        this._id = id;
        this._mode = mode ?? ViewMode.Work;
    }

    public get userId(): string {
        return this._userId;
    }

    public get value(): string {
        return this._value;
    }

    public get id():string {
        return this._id;
    }

    public get viewMode(): ViewMode {
        return this._mode;
    }

    public static New(value: string): Item {
        const hash = sha256(`${value}${Date.now()}`);
        const userId = LoginService.getUserId();
        const mode = db.getViewMode();

        return new Item(userId, value, hash, mode);
    }
}
