import React from 'react';
import {Tabs, Tab} from 'react-bootstrap-tabs';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import * as sessionActions from '../../actions/sessionActions';
import Header from '../../components/Header/Header.js';
import RightContainer from './RightContainer.js';
import LeftContainer from './LeftContainer.js';

class Dashboard extends React.Component{
	constructor(props, context){
		super(props, context);
		this.state={
			menuItems:{
				dashboard:true,
				insight_hub:false,
			},
			labels:{
				dashboard:'DASHBOARDS',
				insight_hub:'INSIGHTS HUB'
			}
		}
		this.handleClick = this.handleClick.bind(this);
	}
	handleClick(event){
		var attribute = event.target.attributes.getNamedItem('data-label').value;
		let menuItems = {};
		for(let key in this.state.menuItems){
			if(attribute.toString()===key.toString()){
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
					if(this.state.menuItems[key] === true){
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
						<Tabs onSelect={(index, label) => console.log(`Selected Index: ${index}, Label: ${label}`)} selected={0}>
							<Tab label="Overview">
								{/*<div className="row">
										<div className="col-sm-12 header-info-label">
											<header><h6><strong>Overview Dashboard</strong></h6></header>
										</div>
								</div>*/}
								<div className="row">
									<div className="col-sm-12">
									  <div id="left_container">
											<LeftContainer/>
									  </div>
									</div>
									{/*<div className="col-sm-4 sidebar" id="sidebar">
										<RightContainer/>
									</div>*/}
								</div>
							</Tab>
							<Tab label="&nbsp;">
								&nbsp;
							</Tab>
							<Tab label="&nbsp;">
								&nbsp;
							</Tab>
						</Tabs>
					</div>
				</div>
		)
	}
}

const { object, bool } = PropTypes;

Dashboard.propTypes = {
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

export default connect(mapState, mapDispatch)(Dashboard);
