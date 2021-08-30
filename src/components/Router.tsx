import React, { useState } from 'react';
import { BrowserRouter, Redirect, Route, Switch, useLocation } from 'react-router-dom';
import { URLs } from '~config/URLs';
import { Account } from '~pages/Account';
import { Login } from '~pages/Login';
import { NotFound } from '~pages/NotFound';
import { ReleaseNotes } from '~pages/ReleaseNotes';
import { Reset } from '~pages/Reset';
import { View } from '~pages/View';
import { LoginService } from '~service/loginService';

const OPEN_URLS: string[] = [URLs.login, URLs.reset];

function LoginRedirect(): JSX.Element {
    const { pathname } = useLocation();

    let content = <></>;

    if (!LoginService.isLoggedIn() && !OPEN_URLS.includes(pathname)) {
        const returnAddr = pathname !== URLs.login
            ? pathname
            : undefined;

        const redirectLink = returnAddr
            ? `${URLs.login}?returnAddr=${returnAddr}`
            : URLs.login;

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
                    <Route path={URLs.view}>
                        <View />
                    </Route>

                    <Route path={URLs.login}>
                        <Login />
                    </Route>

                    <Route path={URLs.account}>
                        <Account />
                    </Route>

                    <Route path={URLs.reset}>
                        <Reset />
                    </Route>

                    <Route path={URLs.release}>
                        <ReleaseNotes />
                    </Route>

                    <Route exact path='/'>
                        <Redirect to={URLs.view} />
                    </Route>

                    <NotFound />
                </Switch>
            </BrowserRouter>
        )
        : <></>;
}
