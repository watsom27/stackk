import React, { PropsWithChildren, useEffect } from 'react';
import { Logout } from '~components/Logout';

interface WrapperProps {
    title?: string;
    showLogout?: boolean;
}

const TITLE_SUFFIX = 'Stack';

export function Wrapper({ title, showLogout, children }: PropsWithChildren<WrapperProps>): JSX.Element {
    useEffect(() => {
        document.title = title
            ? `${title} - ${TITLE_SUFFIX}`
            : TITLE_SUFFIX;

        window.scrollTo(0, 0);
    });

    return (
        <>
            <div className='wrapper'>
                {showLogout && <Logout />}
                {children}
            </div>
        </>
    );
}
