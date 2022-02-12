import React from 'react';
import { Wrapper } from '~components/Wrapper';
import { Title } from '~components/Title';
import { KeyboardShortcutBlock } from '~components/KeyboardShortcutBlock';
import { HeaderedShortcut, shortcutsConfig } from '~config/keyboardShortcuts';

export interface Shortcut {
    shortcut: string;
    description: string;
}

const toShortcutBlock = ({ header, shortcuts }: HeaderedShortcut) => <KeyboardShortcutBlock key={header} title={header} shortcuts={shortcuts} />;

export function KeyboardShortcuts(): JSX.Element {
    return (
        <Wrapper title='Keyboard Shortcuts'>
            <Title showReturn title='Keyboard Shortcuts' />
            {shortcutsConfig.map(toShortcutBlock)}
        </Wrapper>
    );
}
