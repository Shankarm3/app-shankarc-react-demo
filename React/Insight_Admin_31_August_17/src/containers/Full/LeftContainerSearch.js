import React from 'react';
import Highcharts from 'highcharts';
import { Link } from 'react-router-dom';

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
					data: json,
				});
		});
		
	}

	handleClick(event){
		let selectedInsightId = event.target.attributes.getNamedItem('data').value;
		sessionStorage.setItem("selectedInsightId",selectedInsightId);
		console.log(sessionStorage.getItem("selectedInsightId"));
	}

	render() {
		var searchResult="";
		if(this.state.data["searchResult"] && this.state.data["searchResult"].length>0){
			console.log(this.state.data["searchResult"]);
			searchResult = this.state.data["searchResult"].map((item, index)=>{
				return <p className="card-text" data={item["id"]} key={item["id"]}>{item["text"]}</p>
			})
		}
		var moreResult="";
		if(this.state.data["moreResult"] && this.state.data["moreResult"].length>0){
			console.log(this.state.data["moreResult"]);
			moreResult = this.state.data["moreResult"].map((item, index)=>{
				return <p className="card-text1" data={item["id"]} key={item["id"]}><Link className="card-text" data={item["id"]} key={item["id"]} onClick={this.handleClick} to={'/insight_hub'}>{item["text"]}</Link></p>
			})
		}
		var relatedSearch="";
		if(this.state.data["relatedSearch"] && this.state.data["relatedSearch"].length>0){
			console.log(this.state.data["relatedSearch"]);
			relatedSearch = this.state.data["relatedSearch"].map((item, index)=>{
				return <p className="card-text1" data={item["id"]} key={item["id"]}>{item["text"]}<hr/></p>
			})
		}
		return(
			<div className="row">
				<div className="col-sm-12">
					<div className="search-top-section">
							<h6 className="card-title"><strong>SEARCH RESULT:</strong></h6>
							{searchResult}
							<h6 className="card-title"><strong>MORE DETAILS:</strong></h6>
							{moreResult}
					</div>
					<div className="search-bottom-section">
							<h6 className="card-title"><strong>RELATED SEARCH:</strong></h6><hr/>
							{relatedSearch}
					</div>
				</div>
			</div>
		)
    }
	componentWillUnmount() {
    }
}