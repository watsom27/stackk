import React, { useEffect, useState } from 'react';
import { showSettingsService } from '~service/showSettingsService';
import { Toggle } from '~components/Toggle';
import { db, ViewMode } from '~data/Db';
import { URLs } from '~config/URLs';
import { shouldShowReleaseNotification } from '~service/shouldShowReleaseNotification';

export function Settings(): JSX.Element {
    const [loaded, setLoaded] = useState<boolean>(false);
    const [showReleaseNotesBold, setShowReleaseNotesBold] = useState<boolean>(false);

    useEffect(() => {
        setTimeout(() => setLoaded(true), 100);
        shouldShowReleaseNotification().then(setShowReleaseNotesBold);
    }, []);

    const viewModeOnChange = (toggled: boolean) => {
        const newViewMode = toggled ? ViewMode.Home : ViewMode.Work;

        db.setViewMode(newViewMode);
    };

    return (
        <div className='settings-wrapper' onClick={() => showSettingsService.hide()}>
            <div className='settings-backdrop' onClick={(e) => e.stopPropagation()}>
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
                        href={URLs.account}
                        className='link'
                    >
                        My Account
                    </a>
                    <br />
                    <a
                        href={URLs.release}
                        className={`link ${showReleaseNotesBold ? 'bold' : ''}`}
                    >
                        Release Notes
                    </a>
                </div>
                <div>
                    <a
                        href='https://github.com/watsom27/stackk/issues'
                        className='report-an-issue link'
                        target='_blank'
                        rel='noreferrer noopener'
                    >
                        Report an Issue
                    </a>
                    <br />
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
        </div>
    );
}
