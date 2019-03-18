import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import * as sessionActions from '../../actions/sessionActions';
import Header from '../../components/Header/Header.js';
import LeftContainerInsightHub from './LeftContainerInsightHub.js';
import RightContainerInsightHub from './RightContainerInsightHub.js';

class InsightHub extends React.Component{
	constructor(props, context){
		super(props, context);
		this.state={
			menuItems:{
				dashboard:false,
				insight_hub:true,
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
						<div className="row mt-20">
							<div className="col-sm-9 insight-hub-left-div">
							  <div id="left_container" className="left_container">
								<LeftContainerInsightHub/>
							  </div>
							</div>
							<div className="col-sm-3" id="right_container_hub">
								<RightContainerInsightHub/>
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
