import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import * as sessionActions from '../../actions/sessionActions';
import Dashboard from './Dashboard.js';
import InsightHub from './InsightHub.js';
import SearchPage from './SearchPage.js';
import PrivateRoute from '../../components/PrivateRoute';

class Home extends React.Component{
	render(){
		
		return(
		<Router>
		<div className="container-fluid">
				<Switch>
					<PrivateRoute exact path="/" component={Dashboard} authenticated={this.props.authenticated}/>
					<PrivateRoute exact path="/dashboard" component={Dashboard} authenticated={this.props.authenticated}/>
					<PrivateRoute exact path="/insight_hub" component={InsightHub} authenticated={this.props.authenticated}/>
					<PrivateRoute exact path="/search_page" component={SearchPage} authenticated={this.props.authenticated}/>
				</Switch>

		</div>
		</Router>
		)
	}
}

const { object, bool } = PropTypes;

Home.propTypes = {
  actions: object.isRequired,
  user: object.isRequired,
  authenticated: bool.isRequired
};

const mapState = (state) => ({
  user: state.session.user,
  authenticated: state.session.authenticated
});

const mapDispatch = (dispatch) => {
  return {
    actions: bindActionCreators(sessionActions, dispatch)
  };
};

export default connect(mapState, mapDispatch)(Home);
