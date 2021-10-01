import { SetStateAction, Dispatch, MutableRefObject, useState } from 'react';
import { KeyboardService, Callback } from '~service/keyboardService';
import { db } from '~data/Db';
import { showSettingsService } from './showSettingsService';

export enum Mode {
    Input,
    Command,
}

// TODO:
// Put me in a useful place
export type SetStateFn<T> = Dispatch<SetStateAction<T>>;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function exhaustive(_: never): never {
    throw new Error('You\'ve done it wrong!');
}

export class ModeService {
    private static pInstance: ModeService;

    private mode!: Mode;
    private listeners: Callback[] = [];
    private setMode!: SetStateFn<Mode>;
    private inputRef!: MutableRefObject<HTMLInputElement | undefined>;

    private constructor() {
        this.setCommandMode();
    }

    public static get instance(): ModeService {
        if (!ModeService.pInstance) {
            ModeService.pInstance = new ModeService();
        }

        return ModeService.pInstance;
    }

    public useModeService(inputRef: MutableRefObject<HTMLInputElement | undefined>): void {
        [this.mode, this.setMode] = useState<Mode>(Mode.Command);
        this.inputRef = inputRef;
    }

    public modeString(): string {
        return Mode[this.mode];
    }

    public isMode(mode: Mode): boolean {
        return this.mode === mode;
    }

    public switchMode(mode: Mode): void {
        if (mode !== this.mode) {
            this.removeCurrentListeners();

            switch (mode) {
                case Mode.Input:
                    this.setInputMode();
                    break;

                case Mode.Command:
                    this.setCommandMode();
                    break;

                default:
                    exhaustive(mode);
                    break;
            }

            this.setMode(mode);
        }
    }

    private removeCurrentListeners(): void {
        while (this.listeners.length > 0) {
            const cancel = this.listeners.pop()!;

            cancel();
        }
    }

    private setInputMode(): void {
        this.listeners.push(
            KeyboardService.instance.addListener('Escape', () => {
                this.inputRef.current?.blur();
                this.switchMode(Mode.Command);
            }),
        );
    }

    private setCommandMode(): void {
        this.listeners.push(
            KeyboardService.instance.addListener('Enter', () => {
                this.inputRef.current?.focus();
                this.switchMode(Mode.Input);
            }),

            KeyboardService.instance.addListener(' ', () => {
                if (KeyboardService.instance.shiftDown) {
                    db.pop();
                }
            }),

            KeyboardService.instance.addListener('s', () => {
                if (!showSettingsService.isVisible()) {
                    db.toggleViewMode();
                }
            }),
        );
    }
}
