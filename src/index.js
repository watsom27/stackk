import firebase from 'firebase/app';
import React from 'react';
import { render } from 'react-dom';
import { Router } from '~components/Router';

const firebaseConfig = {
    apiKey: 'AIzaSyBP5Uj89yU10siuLdzfB4DnOnF4F7IPehQ',
    authDomain: 'stackk.firebaseapp.com',
    projectId: 'stackk',
    storageBucket: 'stackk.appspot.com',
    messagingSenderId: '776436969975',
    appId: '1:776436969975:web:1eddcfe1be593124fdfef2',
};

firebase.initializeApp(firebaseConfig);

render(<Router />, document.getElementById('root'));
