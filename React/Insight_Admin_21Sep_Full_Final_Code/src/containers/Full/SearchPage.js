import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import * as sessionActions from '../../actions/sessionActions';
import Header from '../../components/Header/Header.js';
import RightContainerSearch from './RightContainerSearch.js';
import LeftContainerSearch from './LeftContainerSearch.js';

class SearchPage extends React.Component{
	constructor(props, context){
		super(props, context);
		console.log(props);
		this.state={
			menuItems:{
				dashboard:true,
				insight_hub:false,
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
					return	<li className={"nav-item "} key={index}>
						<Link to={'/'+key} data-label={key} className="nav-link" onClick={this.handleClick}>{this.state.labels[key]}</Link>
					  </li>
		})

		let name=null;
/*		const search = this.props.location.search; // could be '?foo=bar'
		const params = new URLSearchParams(search);
		name = params.get('name'); // bar
*/
		name=sessionStorage.getItem("searchedInsight");
		name=name.replace(/.*?::/g,"");
		if(name && name.length > 0){
		console.log(name);

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
						<div className="row">
							<div className="col-sm-12">
							<header className="mt-10 ml-10 search-page-header">
								<h6><strong>{name}</strong></h6>
							</header>
							</div>
						</div>
						<div className="row">
							<div className="col-sm-8 search-left-div">
							  <div id="left_container_search" className="left_container_search">
									<LeftContainerSearch/>
							  </div>
							</div>
							<div className="col-sm-4 right_container_search" id="sidebar_search">
								<RightContainerSearch/>
							</div>
						</div>
					</div>
			)
		}
	}
}

const { object, bool } = PropTypes;

SearchPage.propTypes = {
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

export default connect(mapState, mapDispatch)(SearchPage);
