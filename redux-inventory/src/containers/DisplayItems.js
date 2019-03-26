import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as allActions from '../actions';
import { bindActionCreators } from 'redux';

class DisplayItems extends Component {
  constructor(props) {
		super(props);
   }
   render() {
	   var listItems="";
	   if(this.props.items && this.props.items.length > 0){
		listItems = this.props.items.map((item, index)=>{ 
			return <li key={index} id={item.id} onClick={(e) => {this.props.removeItem(e.currentTarget.attributes['id'].value)}}>{item.name}&emsp;&emsp;<span>Delete</span></li>
		})
	   }
     return (
		//console.log(this.props.items);
		<div className="container">
			<ul>
				{listItems}
			</ul>
		</div>
     )
   }
}

const mapStateToProps = state => ({
  items: state.items
})

const mapDispatchToProps = dispatch => ({
  removeItem: id => dispatch(allActions.removeItem(id)),
  addItem: text => dispatch(allActions.addItem(text))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DisplayItems)