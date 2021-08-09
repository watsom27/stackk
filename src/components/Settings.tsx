import React, { useEffect, useState } from 'react';
import { showSettingsService } from '~service/showSettingsService';
import { Toggle } from '~components/Toggle';
import { db, ViewMode } from '~data/Db';

export function Settings(): JSX.Element {
    const [loaded, setLoaded] = useState<boolean>(false);

    useEffect(() => {
        setTimeout(() => setLoaded(true), 100);
    }, []);

    const viewModeOnChange = (toggled: boolean) => {
        const newViewMode = toggled ? ViewMode.Home : ViewMode.Work;

        db.setViewMode(newViewMode);
    };

    return (
        <div className='settings-wrapper'>
            <div className='settings-backdrop'>
                <div className='content-wrapper'>
                    <div className='title-wrapper'>
                        <h4>Stackk Settings</h4>
                    </div>
                    <div className='mode-selector-wrapper'>
                        <b>View Mode</b>
                        <div className='mode-selector'>
                            Work
                            <Toggle
                                initial={db.getViewMode() === ViewMode.Home}
                                onChange={viewModeOnChange}
                            />
                            Home
                        </div>
                    </div>
                    <hr />
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
