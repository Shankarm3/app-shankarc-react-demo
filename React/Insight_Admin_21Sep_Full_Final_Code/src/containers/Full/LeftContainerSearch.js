import React from 'react';
import Highcharts from 'highcharts';
import { Link } from 'react-router-dom';
import { ListGroup, ListGroupItem } from 'reactstrap';

export default class LeftContainerSearch extends React.Component {

    constructor(props, context) {
		super(props);
		this.state={
		  data:[],
		}
		this.handleClick = this.handleClick.bind(this);
    }

	componentDidMount(){
		
		fetch('/search.json')
			.then(response => response.json())
			.then(json => {
				this.setState({
					data:json.searchResult
				})
		});
		
	}
	
	handleClick(event){
		let selectedInsightId = event.target.attributes.getNamedItem('data').value;
		sessionStorage.setItem("selectedInsightId",selectedInsightId);
		console.log(sessionStorage.getItem("selectedInsightId"));
	}

	render() {

		let searchedQuestionId = sessionStorage.getItem("searchedQuestionId");
		let relatedInsights = [];
		var listItems = null;
		console.log(this.state.data);
		this.state.data.map((item, index)=>{
			if(item["id"].toString() === searchedQuestionId.toString()){
				relatedInsights = item["relatedInsights"];
			}
		})

		var searchResult="";
		if(relatedInsights && relatedInsights.length>0){
			console.log(relatedInsights);
			searchResult = relatedInsights.map((item, index)=>{
				return <ListGroupItem className="card-text" data={item["id"]} key={item["id"]+""+index}><span className="badge badge-pill badge-primary d-none d-sm-block">{index+1}.</span>&nbsp;&nbsp;<Link data={item["id"]} to="/insight_detail" onClick={this.handleClick}>{item["label"]}</Link></ListGroupItem>
			})
		}
		
		return(
			<div className="row">
				<div className="col-sm-12">
					<div className="search-top-section">
							<h6 className="card-title"><strong>Top Results</strong></h6>
							<ListGroup>
								{searchResult}
							</ListGroup>
					</div>
				</div>
			</div>
		)
    }
	componentWillUnmount() {
    }
}