import React, { useEffect, useState } from 'react';
import { shouldShowReleaseNotification } from '~service/shouldShowReleaseNotification';
import { showSettingsService } from '~service/showSettingsService';
import { NotificationIcon } from '~components/NotificationIcon';

export function SettingsIcon(): JSX.Element {
    const [showNotif, setShowNotif] = useState<boolean>(false);

    useEffect(() => {
        shouldShowReleaseNotification().then(setShowNotif);
    });

    const onClick = () => showSettingsService.show();

    return (
        <div className='settings-icon logout-pad' onClick={onClick}>
            {showNotif && <NotificationIcon />}
        </div>
    );
}
