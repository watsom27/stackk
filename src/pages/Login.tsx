import React, { Dispatch, SetStateAction, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Wrapper } from '~components/Wrapper';
import { Feature, FeaturesConfig } from '~config/featuresConfig';
import { LoginService } from '~service/LoginService';

enum LoginAction {
    Login,
    Register,
}

interface LoginRegisterButtonsProps {
    action: LoginAction;
    setAction: Dispatch<SetStateAction<LoginAction>>;
    username: string;
    password: string;
    setError: Dispatch<SetStateAction<string | undefined>>;
}

function LoginRegisterButtons({ action, setAction, username, password, setError }: LoginRegisterButtonsProps): JSX.Element {
    let content: JSX.Element;
    const history = useHistory();
    const returnAddr = new URLSearchParams(useLocation().search).get('returnAddr');
    const successRedirect = returnAddr ?? '/view';

    if (action === LoginAction.Login) {
        const btnLoginOnClick = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            event.preventDefault();

            if (await LoginService.validateUser(username, password)) {
                history.push(successRedirect);
            } else {
                setError('Invalid username or password, try again.');
            }
        };

        const btnRegisterOnClick = () => setAction(LoginAction.Register);

        content = (
            <>
                <button type='submit' onClick={btnLoginOnClick}>Login</button>
                {FeaturesConfig.get(Feature.UserRegistration) && <button type='button' onClick={btnRegisterOnClick}>No Account? Register</button>}
            </>
        );
    } else {
        const btnRegisterOnClick = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            event.preventDefault();

            if (await LoginService.registerUser(username, password)) {
                history.push(successRedirect);
            } else {
                setError('Try again');
            }
        };

        const btnLoginOnClick = () => setAction(LoginAction.Login);

        content = (
            <>
                <button type='submit' onClick={btnRegisterOnClick}>Register</button>
                <button type='button' onClick={btnLoginOnClick}>Already Registered? Login</button>
            </>
        );
    }

    return content;
}

function Title({ action }: { action: LoginAction }): JSX.Element {
    return action === LoginAction.Login
        ? <h2>Login</h2>
        : <h2>Register</h2>;
}

export function Login(): JSX.Element {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [action, setAction] = useState<LoginAction>(LoginAction.Login);
    const [error, setError] = useState<string>();
    const history = useHistory();

    if (LoginService.isLoggedIn()) {
        history.push('/view');
    }

    return (
        <Wrapper title='Login'>
            <form>
                <div className='login-page-wrapper'>
                    <div className='login-backdrop'>
                        <Title action={action} />
                        <h4>Username</h4>
                        <input
                            type='email'
                            value={username}
                            onChange={(event) => setUsername(event.target.value)}
                            title='Username'
                            placeholder='Username'
                            autoComplete='username'
                        />
                        <h4>Password</h4>
                        <input
                            type='password'
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            title='Password'
                            placeholder='Password'
                            autoComplete='current-password'
                        />
                        {error && <p className='error'>{error}</p>}
                        <LoginRegisterButtons
                            action={action}
                            setAction={setAction}
                            username={username}
                            password={password}
                            setError={setError}
                        />
                    </div>
                </div>
            </form>
        </Wrapper>
    );
}
