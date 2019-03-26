import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as allActions from '../actions';
import { bindActionCreators } from 'redux';

class AddItems extends Component {
   constructor(props) {
        super(props);
   }
   
   render() {
	let input;

    return (
           <div className="container">
			<form name="inventoryForm">
              <div className="field is-grouped">
                <div className="control">
					<input ref={name => input = name} type="text" name="itemName"/>
					<button className="button btn-primary" onClick={(e) => {e.preventDefault();this.props.dispatch(allActions.addItem(input.value))}}>
						Add
					</button>
                </div>
              </div>
            </form>
            </div>
     )
   }
}

function mapDispatchToProps(dispatch) {
	return { actions: bindActionCreators(allActions, dispatch) }
}

export default connect(mapDispatchToProps)(AddItems);
