import React from 'react';
import { Link } from 'react-router-dom';

export function NotFound(): JSX.Element {
    return (
        <>
            <h1>Page Not Found</h1>
            <p>
                Click
                {' '}
                <Link to='/'>here</Link>
                {' '}
                to go home.
            </p>
        </>
    );
}
