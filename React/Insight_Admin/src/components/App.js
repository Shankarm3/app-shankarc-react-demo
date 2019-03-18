import PropTypes from 'prop-types';
import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import PrivateRoute from './PrivateRoute';

import Login from '../containers/Login/Login.js'
import Dashboard from '../containers/Full/Dashboard.js';
import InsightHub from '../containers/Full/InsightHub.js';
import InsightDetail from '../containers/Full/InsightDetail.js';
import SearchPage from '../containers/Full/SearchPage.js';


const App = ({ authenticated, checked }) => (
  <Router>
    { checked &&
      <div>
        <PrivateRoute exact path="/" component={Dashboard} authenticated={authenticated}/>
		<PrivateRoute exact path="/dashboard" component={Dashboard} authenticated={authenticated}/>
		<PrivateRoute exact path="/insight_detail" component={InsightDetail} authenticated={authenticated}/>
		<PrivateRoute exact path="/insight_hub" component={InsightHub} authenticated={authenticated}/>
		<PrivateRoute exact path="/search_page" component={SearchPage} authenticated={authenticated}/>
        <Route path="/login" component={Login}/>
      </div>
    }
  </Router>
);

const { bool } = PropTypes;

App.propTypes = {
  authenticated: bool.isRequired,
  checked: bool.isRequired
};

const mapState = ({ session }) => ({
  checked: session.checked,
  authenticated: session.authenticated
});

export default connect(mapState)(App);
