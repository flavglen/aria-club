import React from 'react';
import ReactDOM from 'react-dom';
import { PrimeReactProvider } from 'primereact/api';
import UserProvider from './context/userProvider';
import ToastProvider from './context/toastProvider';
import App from './App';
// custom
import 'preline/dist/preline.js'
//css
import "primereact/resources/themes/lara-light-indigo/theme.css";     
import "primereact/resources/primereact.min.css";  
import 'primeicons/primeicons.css';
import './index.css';

/* eslint-disable */
ReactDOM.render(<PrimeReactProvider>
    <UserProvider>
        <ToastProvider>
            <App />
        </ToastProvider>
    </UserProvider>

</PrimeReactProvider>, document.getElementById('root'));
