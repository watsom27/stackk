import React from 'react';
import { useHistory } from 'react-router';
import { URLs } from '~config/URLs';
import { LoginService } from '~service/loginService';

export function Logout(): JSX.Element {
    const history = useHistory();

    const isLoggedIn = LoginService.isLoggedIn();
    const action = isLoggedIn ? 'out' : 'in';
    const onClick = isLoggedIn
        ? () => LoginService.logout()
        : () => history.push(`${URLs.login}?returnAddr=${URLs.release}`);

    return (
        <div
            className={`logout-button logout-pad ${action}`}
            onClick={onClick}
        />
    );
}
