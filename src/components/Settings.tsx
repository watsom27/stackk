import React, { useEffect, useState } from 'react';
import { showSettingsService } from '~service/showSettingsService';

export function Settings(): JSX.Element {
    const [loaded, setLoaded] = useState<boolean>(false);

    useEffect(() => {
        setTimeout(() => setLoaded(true), 100);
    }, []);

    return (
        <div className='settings-wrapper'>
            <div className='settings-backdrop'>
                <div className='content-wrapper'>
                    <div className='title-wrapper'>
                        <h4>Stackk Settings</h4>
                    </div>
                    <a
                        href='/account'
                        className='link'
                    >
                        My Account
                    </a>
                </div>
                {loaded && (
                    <button
                        onClick={() => showSettingsService.hide()}
                        type='button'
                    >
                        Close
                    </button>
                )}
            </div>
        </div>
    );
}
