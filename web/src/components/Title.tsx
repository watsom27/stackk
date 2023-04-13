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
            <div>
                <h3>{title}</h3>
                <h5 className='error'>
                    IMPORTANT: Stackk will go offline on April 16th 2023, please move all your todos to
                    <a href='https://planner.backup-team.co.uk'>Life Planner</a>
                    {' '}
                    to avoid loss
                </h5>
            </div>
            <Logout />
        </div>
    );
}
