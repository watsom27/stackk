import React, { useEffect, useState } from 'react';
import { Title } from '~components/Title';
import { Wrapper } from '~components/Wrapper';
import { db } from '~data/Db';
import { githubService, Release } from '~service/GithubService';

export function ReleaseNotes(): JSX.Element {
    const [release, setRelease] = useState<Release>();

    useEffect(() => {
        githubService
            .getLatestRelease()
            .then((release) => {
                setRelease(release);
                db.setLatestRelease(release.version);
            });
    }, []);

    const appVersion = process.env.APP_VERSION;

    return (
        <Wrapper title='Release Notes'>
            <Title title='Release Notes' showReturn />
            {release && (
                <div className='release-notes'>
                    <h2>{release.title}</h2>
                    <h3>{release.version}</h3>
                    <p>{release.notes}</p>
                    {appVersion && (
                        <i>
                            <p className='app-version'>
                                Current Version:
                                {' '}
                                {appVersion}
                            </p>
                        </i>
                    )}
                </div>
            )}
        </Wrapper>
    );
}
