import firebase from 'firebase/app';
import 'firebase/firestore';
import React from 'react';
import { render } from 'react-dom';
import { Router } from '~components/Router';

const config = JSON.parse(process.env.DB);

firebase.initializeApp(config);

if (process.env.NODE_ENV !== 'production') {
    firebase.firestore().useEmulator('localhost', 8080);
}

render(<Router />, document.getElementById('root'));
