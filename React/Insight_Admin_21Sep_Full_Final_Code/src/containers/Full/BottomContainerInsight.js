import React from 'react';
import { Link } from 'react-router-dom';

export default class BottomContainerInsight extends React.Component {
    constructor(props, context) {
      super(props);
	  this.state={
		  data:[]
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
		let selectedInsightId = event.target.attributes.getNamedItem('data').value;
		sessionStorage.setItem("selectedInsightId",selectedInsightId);
		console.log(sessionStorage.getItem("selectedInsightId"));
	}
	render(){
		let selectedInsightId = sessionStorage.getItem("selectedInsightId");
		let releventInsights = [];
		let insightLabelText = "";
		var listItems = this.state.data.map((item, index)=>{
			if(item["id"] == selectedInsightId){
				releventInsights = item["releventInsights"];
				insightLabelText = item["insight_text"];
			}
		})
		var listItems = releventInsights.map((item, index)=>{
			for(let obj of this.state.data){
				if(obj.id == item){
					return <li data={obj["id"]} key={obj["id"]}><p><Link to='/insight_hub' data={obj["id"]} onClick={this.handleClick}>{obj["insight_text"]}</Link></p></li>
				}
			}
		})

		return(
			<div className="rounded-list">
				<ol>
				{listItems}
				</ol>
			</div>
		)
	}
}
