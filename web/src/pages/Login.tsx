import React, { Dispatch, SetStateAction, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Wrapper } from '~components/Wrapper';
import { Feature, FeaturesConfig } from '~config/featuresConfig';
import { URLs } from '~config/URLs';
import { LoginService } from '~service/loginService';

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
    bumpIncorrectCount: () => void;
}

function ResetPasswordButton(): JSX.Element {
    const history = useHistory();

    return (
        <button
            onClick={() => history.push(URLs.reset)}
            type='button'
        >
            Forgot Password
        </button>
    );
}

function LoginRegisterButtons({ action, setAction, username, password, setError, bumpIncorrectCount }: LoginRegisterButtonsProps): JSX.Element {
    let content: JSX.Element;
    const history = useHistory();
    const returnAddr = new URLSearchParams(useLocation().search).get('returnAddr');
    const successRedirect = returnAddr ?? URLs.view;

    if (action === LoginAction.Login) {
        const btnLoginOnClick = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            event.preventDefault();

            if (await LoginService.validateUser(username, password)) {
                history.push(successRedirect);
            } else {
                bumpIncorrectCount();
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

            const registerResult = await LoginService.registerUser(username, password);

            if (registerResult.success) {
                history.push(successRedirect);
            } else {
                setError(registerResult.reason);
            }
        };

        const btnLoginOnClick = () => setAction(LoginAction.Login);

        content = (
            <>
                <button type='submit' onClick={btnRegisterOnClick}>Register</button>
                <button type='button' onClick={btnLoginOnClick}>Already Registered? Login</button>
                <p>
                    <i>
                        Email can be any valid email.
                        <br />
                        Password must be over 6 letters.
                    </i>
                </p>
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

export default function Login(): JSX.Element {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [action, setAction] = useState<LoginAction>(LoginAction.Login);
    const [error, setError] = useState<string>();
    const [incorrectCount, setIncorrectCount] = useState<number>(0);
    const message = new URLSearchParams(useLocation().search).get('message');
    const history = useHistory();

    if (LoginService.isLoggedIn()) {
        history.push(URLs.view);
    }

    return (
        <Wrapper title='Login'>
            <form>
                <br />
                <h1>Stackk</h1>
                <div className='login-page-wrapper'>
                    <div className='login-backdrop'>
                        <Title action={action} />
                        <h4>Email</h4>
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
                        <LoginRegisterButtons
                            action={action}
                            setAction={setAction}
                            username={username}
                            password={password}
                            setError={setError}
                            bumpIncorrectCount={() => setIncorrectCount(incorrectCount + 1)}
                        />
                        {incorrectCount >= 2 && action === LoginAction.Login && <ResetPasswordButton />}
                        {message && <p>{message}</p>}
                        {error && <p className='error'>{error}</p>}
                    </div>
                </div>
            </form>
        </Wrapper>
    );
}
