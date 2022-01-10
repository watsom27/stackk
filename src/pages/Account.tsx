import React from 'react';
import { DeleteAccount } from '~components/DeleteAccount';
import { ResetPasswordButton } from '~components/PasswordResetButton';
import { Title } from '~components/Title';
import { Wrapper } from '~components/Wrapper';
import { LoginService } from '~service/loginService';

export default function Account(): JSX.Element {
    return (
        <Wrapper title='My Account'>
            <Title title='My Account' showReturn />
            <div className='account-content'>
                <p>
                    <b>Welcome</b>
                    {' '}
                    {LoginService.isLoggedIn() && LoginService.getUserEmail()}
                </p>
                <ResetPasswordButton />
                <DeleteAccount />
            </div>
        </Wrapper>
    );
}
