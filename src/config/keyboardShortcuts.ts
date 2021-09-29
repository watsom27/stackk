import { Shortcut } from '~pages/KeyboardShortcuts';

export interface HeaderedShortcut {
    header: string;
    shortcuts: Shortcut[];
}

const INPUT_MODE: Shortcut[] = [
    {
        shortcut: 'Enter',
        description: 'Add item to bottom of list',
    },
    {
        shortcut: 'Shift + Enter',
        description: 'Add item to top of list',
    },
];

const COMMAND_MODE: Shortcut[] = [
    {
        shortcut: 'Shift + Space',
        description: 'Mark the top item as Done',
    },
    {
        shortcut: 'S',
        description: 'Toggle view mode between Home/Work',
    },
];

const SWITCHING_MODE: Shortcut[] = [
    {
        shortcut: 'Enter',
        description: 'Enter \'Command Mode\' - Keyboard shortcuts enabled',
    },
    {
        shortcut: 'Escape',
        description: 'Enter \'Input Mode\' - Keyboard shortcuts disabled',
    },
];

export const shortcutsConfig: HeaderedShortcut[] = [
    {
        header: 'Switching Between Command/Input Mode',
        shortcuts: SWITCHING_MODE,
    },
    {
        header: 'Input Mode',
        shortcuts: INPUT_MODE,
    },
    {
        header: 'Command Mode',
        shortcuts: COMMAND_MODE,
    },
];
