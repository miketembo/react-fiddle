'use strict';

// forced reload on hot module update (because I can)
window.addEventListener('message', (e)=> {
  if (e.data.indexOf('webpackHotUpdate') != -1) {
    location.reload();
  }
});

import './favicon.ico';
import './index.html';
import 'babel-core/polyfill';
// import 'normalize.css/normalize.css';
// import './scss/app.scss';
//
// import React from 'react';
// import App from './components/App/App';
//
// React.render(
//   <App />,
//   document.getElementById('app')
// );


import init from './util/rxf/examples';
init();
