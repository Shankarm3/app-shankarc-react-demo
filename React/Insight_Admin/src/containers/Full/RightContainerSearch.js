import React from 'react';
import { ListGroup, ListGroupItem } from 'reactstrap';
import { Link } from 'react-router-dom';

export default class RightContainerSearch extends React.Component {
    constructor(props, context) {
	  console.log('right search called');
      super(props);
	  this.state={
		  data:[],
		  selectedQuestion:null
	  }
	  this.handleClick = this.handleClick.bind(this);
    }
	componentDidMount(){
		console.log('right search called');
		fetch('/search.json')
			.then(response => response.json())
			.then(json => {
				this.setState({
					data:json.searchResult
				})
		});
	}
	handleClick(event){
		let searchedQuestionId = event.target.attributes.getNamedItem('data').value;
		sessionStorage.setItem("searchedQuestionId",searchedQuestionId);
		sessionStorage.setItem("searchedInsight",event.target.attributes.getNamedItem('data-key').value);
	}
	render(){
			console.log(sessionStorage.getItem("searchedInsight"));
			let searchedQuestionId = sessionStorage.getItem("searchedQuestionId");
			let relatedSearches = [];
			var listItems = null;
			this.state.data.map((item, index)=>{
				if(item["id"].toString() === searchedQuestionId.toString()){
					relatedSearches = item["relatedSearches"];
				}
			})
			console.log(relatedSearches);
			var listItems = relatedSearches.map((item, index)=>{
				var activeClass="";
				console.log('found:'+item["id"]+"::"+searchedQuestionId);
				if(item["id"].toString() === searchedQuestionId.toString()){
					activeClass="active";
					console.log(item["label"]);
				}
				return <ListGroupItem key={item["id"]+""+index}><Link to='/search_page' data={item["id"]} data-key={item.id+"::"+item.label} onClick={this.handleClick}>{item["label"]}</Link></ListGroupItem>
			})
			return(
				<div className="search-top-section">
				<h6 className="related-search"><i className="fa fa-search" aria-hidden="true"></i>&nbsp;&nbsp;PEOPLE ALSO SEARCHED</h6>
				<ListGroup>
					{listItems}
				</ListGroup>
				</div>
			)
		}
}
