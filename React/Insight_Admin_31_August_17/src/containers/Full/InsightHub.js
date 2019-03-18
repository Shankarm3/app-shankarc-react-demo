import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import * as sessionActions from '../../actions/sessionActions';
import Header from '../../components/Header/Header.js';
import LeftContainerInsight from './LeftContainerInsight.js';
import RightContainerInsight from './RightContainerInsight.js';
import MiddleContainerInsight from './MiddleContainerInsight.js';

class InsightHub extends React.Component{
	constructor(props, context){
		super(props, context);
		this.state={
			menuItems:{
				dashboard:false,
				insight_hub:true,
			},
			labels:{
				dashboard:'DASHBOARD',
				insight_hub:'INSIGHT HUB'
			}
		}
		this.handleClick = this.handleClick.bind(this);
	}
	handleClick(event){
		var attribute = event.target.attributes.getNamedItem('data-label').value;
		let menuItems = {};
		for(let key in this.state.menuItems){
			if(attribute==key){
				menuItems[key]=true;
			}
			else{
				menuItems[key]=false;
			}
		}
		this.setState({
			menuItems:menuItems
		})
	}
	componentWillUpdate(nextState, prevState){
		//console.log(prevState);
	}
	render(){
		
		var listItems = Object.keys(this.state.menuItems).map((key, index)=>{
					var classNameText="";
					if(this.state.menuItems[key] == true){
						classNameText="active";
					}
					return	<li className={"nav-item "+classNameText} key={index}>
						<Link to={'/'+key} data-label={key} className="nav-link" onClick={this.handleClick}>{this.state.labels[key]}</Link>
					  </li>
		})

		return(
				<div id="search_container" className="container-fluid">
					<Header/>
					<div id="body-navbar-nav">
					  <div className="header-navbar-nav">
						<ul>
						{listItems}
						</ul>
					  </div>
					</div>
					<div className="body-part-container">
					<div className="row">
						<div className="col-sm-12 header-info-label">
							<header><h6><strong>Insights Hub</strong></h6></header>
						</div>
					</div>
					<div className="row">
						<div className="col-sm-4">
						  <div id="left_container">
							<LeftContainerInsight/>
						  </div>
						</div>
						<div className="col-sm-5 sidebar-offcanvas" id="middle_container">
							<MiddleContainerInsight/>
						</div>
						<div className="col-sm-3">
						  <div id="right_container">
							<RightContainerInsight/>
						  </div>
						</div>
					</div>
					</div>
				</div>
		)
	}
}

const { object, bool } = PropTypes;

InsightHub.propTypes = {
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

export default connect(mapState, mapDispatch)(InsightHub);
