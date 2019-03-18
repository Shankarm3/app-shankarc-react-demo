import React from 'react';
import { Route, IndexRoute } from 'react-router';
import { sessionService } from 'redux-react-session';
import App from './components/App.js';
import Home from './containers/Full.js';
import Login from './containers/Login.js';

export default (
  <Route path="/" component={App}>
    <IndexRoute onEnter={sessionService.checkAuth} component={Home} />
    <Route path="login" component={Login} />
  </Route>
);
