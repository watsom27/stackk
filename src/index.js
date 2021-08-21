import firebase from 'firebase/app';
import 'firebase/firestore';
import React from 'react';
import { render } from 'react-dom';
import { Router } from '~components/Router';

const config = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGE_SENDER_ID,
    appId: process.env.APP_ID,
};

firebase.initializeApp(config);

if (process.env.NODE_ENV !== 'production') {
    firebase.firestore().useEmulator('localhost', 8080);
}

render(<Router />, document.getElementById('root'));
