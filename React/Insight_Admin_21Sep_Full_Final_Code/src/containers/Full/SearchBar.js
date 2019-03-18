import React from 'react';
import {InputGroup} from 'react-bootstrap';

import {Typeahead} from 'react-bootstrap-typeahead'; // ES2015
import options from './ExampleData.js';
import {Link} from 'react-router-dom';

export default class SearchBar extends React.Component {
  
  constructor(props) {
	super(props);
    this.state={
      submitFormOnEnter: false,
	  selectedOption: "",
    };
	this.updateState = this.updateState.bind(this);
	this.submitLink = this.submitLink.bind(this);
  };

  updateState(array){
   	  if(array && array.length>0){
		  sessionStorage.setItem("searchedInsight",array[0].label);
		  sessionStorage.setItem("searchedQuestionId",array[0].id);
		  this.setState({
			selectedOption: array[0].label,
			submitFormOnEnter:true
		  })
	  }
	  else{
		  sessionStorage.setItem("searchedQuestionId",null);
		  sessionStorage.setItem("searchedInsight",null);
		  this.setState({
			selectedOption: "",
			submitFormOnEnter:false
		  })
	  }
  }
  submitLink(event){
	if(this.state.submitFormOnEnter){
		 //to - do
	} 
	else{
		event.preventDefault();
	}
  }
  render() {

    return (
      <form>
        <InputGroup>
          <Typeahead
			ref="typeahead"
			labelKey="label"
			disabled={false}
			onChange={this.updateState}
			options={options}
			placeholder="Search..."
			submitFormOnEnter={this.state.submitFormOnEnter}
          />
		  {/*<Button type="button"><Link to={`/details/?name=${this.state.selectedOption}`}>Go</Link></Button>
			<Button type="submit">Go</Button>
				<button type="button" className="btn btn-sm" disabled><i className="fa fa-search"></i></button>*/}
			<Link onClick={this.submitLink} className="btn btn-sm" to={`/search_page`}><i className="fa fa-search"></i></Link>
        </InputGroup>
      </form>
    );
  }
}
