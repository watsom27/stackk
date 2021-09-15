import { Shortcut } from '~pages/KeyboardShortcuts';

export interface HeaderedShortcut {
    header: string;
    shortcuts: Shortcut[];
}

const ADDING_NEW_ITEMS: Shortcut[] = [
    {
        shortcut: 'Enter',
        description: 'Add item to bottom of list, or focus on input box',
    },
    {
        shortcut: 'Shift + Enter',
        description: 'Add item to top of list',
    },
];

export const shortcutsConfig: HeaderedShortcut[] = [
    {
        header: 'Item Entry',
        shortcuts: ADDING_NEW_ITEMS,
    },
];
