import React from 'react';
import { ListGroup, ListGroupItem } from 'reactstrap';
import { Link } from 'react-router-dom';

export default class RightContainerInsight extends React.Component {
    constructor(props, context) {
      super(props);
	  this.state={
		  data:[],
		  activeIndex: 0
	  }
	  this.handleClick = this.handleClick.bind(this);
    }
	componentDidMount(){
		fetch('/insight-hub.json')
			.then(response => response.json())
			.then(json => {
				this.setState({
					data: json.data,
				});
		});

	}
	handleClick(event){
		/*fetch('http://localhost:3000/chart1.json')
			.then(response => response.json())
			.then(json => {
			this.props.changeData(json.data);
		});*/
		//this.setState({activeIndex: event.target.attributes.getNamedItem('data').value});
		let selectedInsightId = event.target.attributes.getNamedItem('data').value;
		sessionStorage.setItem("selectedInsightId",selectedInsightId);
		console.log(sessionStorage.getItem("selectedInsightId"));
	}
	render(){
		let selectedInsightId = sessionStorage.getItem("selectedInsightId");
		let relatedInsights = [];
		var listItems = this.state.data.map((item, index)=>{
			if(item["id"] == selectedInsightId){
				relatedInsights = item["relatedInsights"];
			}
		})
		var listItems = relatedInsights.map((item, index)=>{
			for(let obj of this.state.data){
				if(obj.id == item){
					return <ListGroupItem data={obj["id"]} key={obj["id"]}><Link to='/insight_hub' data={obj["id"]} onClick={this.handleClick}>{obj["insight_text"]}</Link></ListGroupItem>
				}
			}
		})
		console.log(listItems);
		return(
			<ListGroup>
				<ListGroupItem id="insight-header"><h6>RELEVENT INSIGHTS<sup></sup></h6></ListGroupItem>
				{listItems}
			</ListGroup>
		)
	}
}
