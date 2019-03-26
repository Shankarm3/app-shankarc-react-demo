import { combineReducers } from "redux";
import {ADD_ITEM, REMOVE_ITEM} from '../actions/ActionTypes';

let itemId=0;

function items(state=[], action){
	console.log(action.type);
	switch(action.type){
		case ADD_ITEM:
			return Object.assign([], [...state, {"id":itemId++, "name":action.text}]);
		case REMOVE_ITEM:{
			var newState = [];
			newState=state.filter((item, index)=>{
				if(item.id != action.id){
					return true
				}
				return false;
			})
			return newState
		}
		default:
			return state
	}
}

const insightApp = combineReducers({
  items
});

export default insightApp;