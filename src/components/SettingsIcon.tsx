import React from 'react';
import { showSettingsService } from '~service/showSettingsService';

export function SettingsIcon(): JSX.Element {
    const onClick = () => showSettingsService.show();

    return <div className='settings-icon logout-pad' onClick={onClick} />;
}
