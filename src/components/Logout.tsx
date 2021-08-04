import React from 'react';
import { LoginService } from '~service/loginService';

export function Logout(): JSX.Element {
    const onClick = () => LoginService.logout();

    return <div className='logout logout-pad' onClick={onClick} />;
}
