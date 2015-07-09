'use strict';

import './favicon.ico';
import './index.html';
import 'babel-core/polyfill';
import 'normalize.css/normalize.css';
import './scss/app.scss';
import React from 'react';
require('react-tap-event-plugin')();
import mui from 'material-ui';

import {GroceryEditor} from 'modules/grocery'

React.render(
  <GroceryEditor />,
  document.getElementById('app')
);
