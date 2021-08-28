import React, { useEffect, useState } from 'react';
import { Title } from '~components/Title';
import { Wrapper } from '~components/Wrapper';

const GITHUB_RELEASE_URL = 'https://api.github.com/repos/watsom27/stackk/releases/latest';

interface Release {
    title: string;
    version: string;
    notes: string;
}

async function load(): Promise<Release> {
    const response = await fetch(GITHUB_RELEASE_URL);
    const { name, tag_name: tagName, body } = await response.json();

    return {
        title: name,
        version: tagName,
        notes: body,
    };
}

export function ReleaseNotes(): JSX.Element {
    const [release, setRelease] = useState<Release>();

    useEffect(() => {
        load().then(setRelease);
    }, []);

    return (
        <Wrapper title='Release Notes'>
            <Title title='Release Notes' showReturn />
            {release && (
                <div className='release-notes'>
                    <h2>{release.title}</h2>
                    <h3>{release.version}</h3>
                    <p>{release.notes}</p>
                </div>
            )}
        </Wrapper>
    );
}
