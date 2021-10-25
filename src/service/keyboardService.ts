import { RustMap as Map } from 'rust-map';
import { LoginService } from '~service/loginService';

const KEY_MAP = new Map<string, string>([
    ['Shift', 'shiftDown'],
]);

export type Callback = (...args: any[]) => void;

/**
 * Keyboard shortcuts are only listened for when user is logged in
 */
export class KeyboardService {
    public shiftDown = false;
    private listeners = new Map<string, Set<Callback>>();

    private static pInstance: KeyboardService;

    public static get instance(): Readonly<KeyboardService> {
        if (!KeyboardService.pInstance) {
            KeyboardService.pInstance = new KeyboardService();
        }

        return KeyboardService.pInstance;
    }

    constructor() {
        window.addEventListener('keydown', this.handleKeydown.bind(this));
        window.addEventListener('keyup', this.handleKeyup.bind(this));
    }

    public addListener(key: string, callback: Callback): Callback {
        const callbacks = this.listeners
            .entry(key)
            .orConstruct(Set)
            .add(callback);

        return () => callbacks.delete(callback);
    }

    private handleKeydown({ key }: KeyboardEvent): void {
        if (LoginService.isLoggedIn()) {
            const property = KEY_MAP.get(key);

            if (property) {
                (this as any)[property] = true;
            }
        }
    }

    private handleKeyup({ key }: KeyboardEvent): void {
        if (LoginService.isLoggedIn()) {
            const property = KEY_MAP.get(key);

            if (property) {
                (this as any)[property] = false;
            }

            this.listeners.get(key)?.forEach((callback) => callback());
        }
    }
}
