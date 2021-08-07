import React, { useState } from 'react';
import { BrowserRouter, Redirect, Route, Switch, useLocation } from 'react-router-dom';
import { Account } from '~pages/Account';
import { Login } from '~pages/Login';
import { NotFound } from '~pages/NotFound';
import { View } from '~pages/View';
import { LoginService } from '~service/loginService';

function LoginRedirect(): JSX.Element {
    const { pathname } = useLocation();

    let content = <></>;

    if (!LoginService.isLoggedIn() && pathname !== '/login') {
        const returnAddr = pathname !== '/login'
            ? pathname
            : undefined;

        const redirectLink = returnAddr
            ? `/login?returnAddr=${returnAddr}`
            : '/login';

        content = <Redirect to={redirectLink} />;
    }

    return content;
}

export function Router(): JSX.Element {
    const [loginInitialised, setLoginInitialised] = useState<boolean>(false);
    const [, setIsLoggedIn] = useState<boolean>(false);

    LoginService.addStateChangeListener(() => {
        setLoginInitialised(true);
        setIsLoggedIn(LoginService.isLoggedIn());
    });

    return loginInitialised
        ? (
            <BrowserRouter>
                <LoginRedirect />
                <Switch>
                    <Route path='/view'>
                        <View />
                    </Route>

                    <Route path='/login'>
                        <Login />
                    </Route>

                    <Route path='/account'>
                        <Account />
                    </Route>

                    <Route exact path='/'>
                        <Redirect to='/view' />
                    </Route>

                    <NotFound />
                </Switch>
            </BrowserRouter>
        )
        : <></>;
}
