import React, { Dispatch, MouseEvent, SetStateAction, useState } from 'react';
import { Link, Redirect, useHistory } from 'react-router-dom';
import { Wrapper } from '~components/Wrapper';
import { URLs } from '~config/URLs';
import { LoginService } from '~service/loginService';

interface FormProps {
    setSubmitted: Dispatch<SetStateAction<boolean>>;
    setError: Dispatch<SetStateAction<string | undefined>>;
}

function RedirectIfLoggedIn(): JSX.Element {
    return LoginService.isLoggedIn() ? <Redirect to={URLs.account} /> : <></>;
}

function Form({ setSubmitted, setError }: FormProps): JSX.Element {
    const [email, setEmail] = useState<string>('');

    const onClick = async (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();

        try {
            await LoginService.sendResetEmail(email);
            setSubmitted(true);
        } catch (e) {
            setError('Enter a valid email');
        }
    };

    return (
        <form className='reset'>
            <input
                placeholder='Enter email'
                type='email'
                className='email'
                value={email}
                onChange={(event) => setEmail(event.target.value)}
            />
            <button
                className='request'
                type='submit'
                onClick={onClick}
            >
                Request Password Reset
            </button>
        </form>
    );
}

function Result(): JSX.Element {
    return (
        <>
            <b>Success</b>
            <p>Password reset email has been sent.</p>
            <Link to={URLs.login} className='link'>Click to return to login page.</Link>
        </>
    );
}

export function Reset(): JSX.Element {
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [error, setError] = useState<string>();
    const history = useHistory();

    return (
        <Wrapper title='Reset Password'>
            <RedirectIfLoggedIn />
            <div className='reset-title-wrapper'>
                <div className='return-icon logout-pad' onClick={() => history.push('login')} />
                <h2>Reset Password</h2>
                <div className='logout-pad' />
            </div>
            {submitted ? <Result /> : <Form setSubmitted={setSubmitted} setError={setError} />}
            {!submitted && error && <p className='error'>{error}</p>}
        </Wrapper>
    );
}
