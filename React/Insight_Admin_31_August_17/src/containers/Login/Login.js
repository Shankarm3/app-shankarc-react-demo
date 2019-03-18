import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import * as sessionActions from '../../actions/sessionActions';
import Input from './Input';

class Login extends Component {
  constructor(props, context) {
    super(props, context);
	
    this.state = {
      user: {
        email: '',
        password: ''
      }
    };

    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onSubmit(history) {
    const { user } = this.state;
    const { login } = this.props.actions;
	if( ( user.email && user.email.length > 0 ) && ( user.password && user.password.length > 0 ) ){
		if(user.email === 'Admin' && user.password === 'test'){
			login(user, history);
		}
	}
  }

  onChange(e) {
    const { value, name } = e.target;
    const { user } = this.state;
    user[name] = value;
    this.setState({ user });
  }

  render() {
    const { user: { email, password } } = this.state;
    const SubmitButton = withRouter(({ history }) => (
      <button type="submit" form="loginForm" className="btn btn-primary" onClick={() => this.onSubmit(history)}>Login</button>
    ));
    return (
		<div className="container login-form-container">
			<div className="row first-row">
				<div className="col-sm-4">
				</div>
				<div className="col-sm-4 content-container">
					<span className="opera-logo"></span>
				</div>
				<div className="col-sm-4">
				</div>
			</div>
			<div className="row second-row">
				<div className="col-sm-4">
				</div>
				<div className="col-sm-4 content-container">
					<span className="opera-diamond"></span>
				</div>
				<div className="col-sm-4">
				</div>
			</div>
			<div className="row" id="third-row">
				<div className="col-sm-4">
				</div>
				<div className="col-sm-4 content-container">
					<p>AI <small>FOR</small> BI</p>
				</div>
				<div className="col-sm-4">
				</div>
			</div>
			<div className="row">

				<div className="col-sm-3">
				</div>
				<div className="col-sm-6 content-container">
					<div className="login-form" id="login-form">
						<div className="user-info-section">
							<form name="loginForm">
							<div className="form-group">
								<Input
									  name="email"
									  value={email}
									  label="Email"
									  type="text"
									  onChange={this.onChange}
									/>
							</div>
							<div className="form-group">
								<Input
								  name="password"
								  value={password}
								  label="Password"
								  type="password"
								  onChange={this.onChange}
								/>
							</div>
							<div className="form-group">
								<SubmitButton/>
							</div>
							</form>
						</div>
					</div>
				</div>
				<div className="col-sm-3">
				</div>

			</div>
		</div>
    );
  }
}


const { object } = PropTypes;

Login.propTypes = {
  actions: object.isRequired
};

const mapDispatch = (dispatch) => {
  return {
    actions: bindActionCreators(sessionActions, dispatch)
  };
};

export default connect(null, mapDispatch)(Login);
