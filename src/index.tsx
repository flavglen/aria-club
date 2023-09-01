import React from 'react';
import "primereact/resources/themes/lara-light-indigo/theme.css";     
import "primereact/resources/primereact.min.css";  
import './index.css';
import 'preline/dist/preline.js'
import ReactDOM from 'react-dom';
import { PrimeReactProvider } from 'primereact/api';
import App from './App';

ReactDOM.render(<PrimeReactProvider>
    <App />
</PrimeReactProvider>, document.getElementById('root'));
