import React from 'react';
import {InputGroup, Button} from 'react-bootstrap';

import {Typeahead} from 'react-bootstrap-typeahead'; // ES2015
import options from './ExampleData.js';
import {Link} from 'react-router-dom';

export default class SearchBar extends React.Component {
  
  constructor(props) {
	super(props);
    this.state={
      submitFormOnEnter: true,
	  selectedOption: "",
    };
	this.updateState = this.updateState.bind(this);
  };

  updateState(array){
   	  if(array && array.length>0){
		  sessionStorage.setItem("searchedInsight",array[0].label);
		  this.setState({
			selectedOption: array[0].label
		  })
	  }
	  else{
		  sessionStorage.setItem("searchedInsight","");
		  this.setState({
			selectedOption: ""
		  })
	  }
	  console.log(this.state.selectedOption);
  }
  render() {

	const {submitFormOnEnter} = this.state;
    return (
      <form>
        <InputGroup>
          <Typeahead
			width="200"
			ref="typeahead"
            labelKey="label"
			onChange={this.updateState}
            options={options}
            placeholder="Search for Insights..."
            submitFormOnEnter={submitFormOnEnter}
          />
		  {/*<Button type="button"><Link to={`/details/?name=${this.state.selectedOption}`}>Go</Link></Button>*/}
			{/*<Button type="button">Go</Button>*/}
			<Link className="btn btn-primary" to={`/search_page`}><i className="fa fa-search"></i></Link>
        </InputGroup>
      </form>
    );
  }
}
