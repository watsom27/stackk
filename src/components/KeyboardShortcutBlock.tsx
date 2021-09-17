import React from 'react';
import { Shortcut } from '~pages/KeyboardShortcuts';

interface KeboardShortcutBlockProps {
    title: string;
    shortcuts: Shortcut[]
}

function toListItem({ shortcut, description }: Shortcut): JSX.Element {
    return (
        <li key={shortcut}>
            <span>
                <i>
                    {shortcut}
                </i>
                {' - '}
                <span className='keyboard-shortcut'>
                    {description}
                </span>
            </span>
        </li>
    );
}

export function KeyboardShortcutBlock({ title, shortcuts }: KeboardShortcutBlockProps): JSX.Element {
    return (
        <div className='shortcut-block'>
            <b>{title}</b>
            <ul className='no-bullets'>
                {shortcuts.map(toListItem)}
            </ul>
        </div>
    );
}
