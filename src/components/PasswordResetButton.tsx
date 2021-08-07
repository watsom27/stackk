import React, { useState } from 'react';
import { LoginService } from '~service/loginService';

enum ResetPasswordButtonState {
    NotPressed,
    FirstPress,
    ResetSent,
}

export function ResetPasswordButton(): JSX.Element {
    const [state, setState] = useState<ResetPasswordButtonState>(ResetPasswordButtonState.NotPressed);

    let onClick;
    let text;

    if (state === ResetPasswordButtonState.NotPressed) {
        onClick = () => {
            setState(ResetPasswordButtonState.FirstPress);
            setTimeout(() => {
                setState(ResetPasswordButtonState.NotPressed);
            }, 2000);
        };

        text = 'Reset Password';
    } else if (state === ResetPasswordButtonState.FirstPress) {
        onClick = () => {
            setState(ResetPasswordButtonState.ResetSent);
            LoginService.sendResetEmail();
        };

        text = 'Click To Confirm';
    } else {
        onClick = () => undefined;
        text = 'Reset Email Sent';
    }

    return (
        <button
            onClick={onClick}
            type='button'
        >
            {text}
        </button>
    );
}
