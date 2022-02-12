import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Redirect, Route, Switch, useLocation } from 'react-router-dom';
import { URLs } from '~config/URLs';
import { ReleaseNotes } from '~pages/ReleaseNotes';
import { LoginService } from '~service/loginService';
import { KeyboardShortcuts } from '~pages/KeyboardShortcuts';
import { Wrapper } from './Wrapper';

// React lazy to enable code splitting on pages
const Account = lazy(() => import('~pages/Account'));
const Login = lazy(() => import('~pages/Login'));
const NotFound = lazy(() => import('~pages/NotFound'));
const Reset = lazy(() => import('~pages/Reset'));
const View = lazy(() => import('~pages/View'));

const OPEN_URLS: string[] = [URLs.login, URLs.reset, URLs.release];

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

    useEffect(() => {
        if (loginInitialised) {
            document.body.style.background = '#F8F8F8';
        }
    }, [loginInitialised]);

    return loginInitialised
        ? (
            <BrowserRouter>
                <Suspense fallback={<Wrapper />}>
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

                        <Route path={URLs.keyboardShortcuts}>
                            <KeyboardShortcuts />
                        </Route>

                        <Route exact path='/'>
                            <Redirect to={URLs.view} />
                        </Route>

                        <NotFound />
                    </Switch>
                </Suspense>
            </BrowserRouter>
        )
        : <></>;
}
