import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { HashRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.css';
import './index.css';
import App from './common/App';
//import registerServiceWorker from './registerServiceWorker';

axios.defaults.baseURL = '/api/v1';

ReactDOM.render((
  <HashRouter>
    <App />
  </HashRouter>
), document.getElementById('root'));

//registerServiceWorker();
