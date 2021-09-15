import { RustMap as Map } from 'rust-map';

const KEY_MAP = new Map<string, string>([
    ['Shift', 'shiftDown'],
]);

export type Callback = (...args: any[]) => void;

class KeyboardService {
    public shiftDown = false;
    private listeners = new Map<string, Set<Callback>>();

    constructor() {
        window.addEventListener('keydown', this.handleKeydown.bind(this));
        window.addEventListener('keyup', this.handleKeyup.bind(this));
    }

    public addListener(key: string, callback: Callback): Callback {
        const callbacks = this.listeners
            .entry(key)
            .orConstruct(Set);

        callbacks.add(callback);

        return () => callbacks.delete(callback);
    }

    private handleKeydown({ key }: KeyboardEvent): void {
        const property = KEY_MAP.get(key);

        if (property) {
            (this as any)[property] = true;
        }

        this.listeners.get(key)?.forEach((callback) => callback());
    }

    private handleKeyup({ key }: KeyboardEvent): void {
        const property = KEY_MAP.get(key);

        if (property) {
            (this as any)[property] = false;
        }
    }
}

export const keyboardService: Readonly<KeyboardService> = new KeyboardService();
