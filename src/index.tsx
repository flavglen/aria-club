import React from 'react';
import "primereact/resources/themes/lara-light-indigo/theme.css";     
import "primereact/resources/primereact.min.css";  
import 'primeicons/primeicons.css';
import './index.css';
import 'preline/dist/preline.js'
import ReactDOM from 'react-dom';
import { PrimeReactProvider } from 'primereact/api';
import App from './App';
import UserProvider from './context/userProvider';
import ToastProvider from './context/toastProvider';

ReactDOM.render(<PrimeReactProvider>
    <UserProvider>
        <ToastProvider>
            <App />
        </ToastProvider>
    </UserProvider>
   
</PrimeReactProvider>, document.getElementById('root'));
