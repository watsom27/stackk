import React, { PropsWithChildren, useEffect } from 'react';

interface WrapperProps {
    title?: string;
}

const TITLE_SUFFIX = 'Stackk';

export function Wrapper({ title, children }: PropsWithChildren<WrapperProps>): JSX.Element {
    useEffect(() => {
        document.title = title
            ? `${title} - ${TITLE_SUFFIX}`
            : TITLE_SUFFIX;
    });

    return (
        <>
            <div className='wrapper'>
                {children}
            </div>
        </>
    );
}
