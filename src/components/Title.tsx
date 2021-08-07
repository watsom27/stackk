import React from 'react';
import { Logout } from '~components/Logout';
import { Return } from '~components/Return';
import { SettingsIcon } from '~components/SettingsIcon';

interface TitleProps {
    title: string;
    showReturn?: boolean;
}

export function Title({ title, showReturn }: TitleProps): JSX.Element {
    return (
        <div className='title'>
            {showReturn ? <Return /> : <SettingsIcon />}
            <h3>{title}</h3>
            <Logout />
        </div>
    );
}
