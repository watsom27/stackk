import firebase from 'firebase/app';
import 'firebase/firestore';
import React from 'react';
import { render } from 'react-dom';
import { Router } from '~components/Router';
import { Logger } from '~service/logger';

const isProduction = process.env.NODE_ENV === 'production';

// Increment hit counter
if (isProduction) {
    fetch('http://localhost:8000/api/hits/update/stackk', {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${process.env.REPORTING_TOKEN}`,
        },
    })
        .then(() => Logger.log('Hits Updated'))
        .catch((error) => Logger.error(`Failed to update hits: ${error}`));
}

const config = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGE_SENDER_ID,
    appId: process.env.APP_ID,
};

firebase.initializeApp(config);

if (!isProduction) {
    firebase.firestore().useEmulator('localhost', 8080);
}

render(<Router />, document.getElementById('root'));
