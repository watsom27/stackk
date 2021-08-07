import React, { useState, useEffect, KeyboardEvent } from 'react';
import { useHistory } from 'react-router-dom';
import { db } from '~data/Db';
import { LoginService } from '~service/loginService';

enum DeleteAccountButtonState {
    NotPressed,
    FirstPress,
}

export function DeleteAccount(): JSX.Element {
    const [state, setState] = useState<DeleteAccountButtonState>(DeleteAccountButtonState.NotPressed);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>();
    const [working, setWorking] = useState<boolean>(false);
    const history = useHistory();

    let onClick: () => void;
    let text;
    let passwordInput: HTMLInputElement | null;

    useEffect(() => {
        if (showPassword) {
            passwordInput?.focus();
        }
    }, [showPassword]);

    if (state === DeleteAccountButtonState.NotPressed) {
        onClick = () => {
            setState(DeleteAccountButtonState.FirstPress);
            setShowPassword(true);
        };

        text = 'Delete Account';
    } else {
        onClick = async () => {
            setWorking(true);

            const passwordResult = await LoginService.reAuth(password);

            if (passwordResult.success) {
                await db.deleteForUser();
                await LoginService.deleteAccount();

                history.push('/login?message=Thank you for using Stackk. Your account has been deleted');
            } else {
                setError(passwordResult.reason);
                setWorking(false);
            }
        };

        text = 'Click to Confirm';
    }
    const onKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            onClick();
        }
    };

    return (
        <>
            <button
                onClick={onClick}
                type='button'
                className={`${working ? 'disabled' : ''}`}
            >
                {text}
            </button>
            {showPassword && (
                <input
                    ref={(input) => { passwordInput = input; }}
                    type='password'
                    placeholder='Enter password'
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    onKeyPress={onKeyPress}
                    className='confirm-password'
                    readOnly={working}
                />
            )}
            {error && <p className='error'>{error}</p>}
        </>
    );
}
