import React from 'react';
import Highcharts from 'highcharts';
import { Link } from 'react-router-dom';
import BottomContainerInsight from './BottomContainerInsight.js';

export default class MiddleContainerInsight extends React.Component {
    constructor(props, context) {
      super(props);
	  this.state={
		  data:[]
	  }
	  this.handleClick = this.handleClick.bind(this);
    }
	handleClick(event){
		let selectedInsightId = event.target.attributes.getNamedItem('data').value;
		sessionStorage.setItem("selectedInsightId",selectedInsightId);
		console.log(sessionStorage.getItem("selectedInsightId"));
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
	componentDidUpdate(){
		let selectedInsightId = sessionStorage.getItem("selectedInsightId");
		let selectedChart = "";
		switch(selectedInsightId){
			
			case "insight_1":{
				selectedChart="chart.json";
				break;
			}
			case "insight_2":{
				selectedChart="line.json";
				break;
			}
			case "insight_3":{
				selectedChart="barChart.json";
				break;
			}
			case "insight_4":{
				selectedChart="chart4.json";
				break;
			}
			case "insight_5":{
				selectedChart="chart5.json";
				break;
			}
			
		}
		if(selectedChart && selectedChart.length>0){
			fetch('/'+selectedChart)
				.then(response => response.json())
				.then(json => {
					this.chart=new Highcharts[this.props.type || "Chart"](
						this.refs.chart,
						json.data
					);
			});
		}
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
		<div>
			<div className="row">
				<div className="col-sm-12 text-center">
					<header><h6 className="middle-part-heading">{insightLabelText}</h6></header>
				</div>
				<div className="chart-column col-sm-12" id="chart-outer-wrapper">
					<div ref="chart" id="middle-chart-container"></div>
				</div>
			</div>
			<div className="row">
				<div className="col-sm-12 mt-10">
					<header><h6 className="middle-part-heading">INSIGHTS</h6></header>
					<div className="rounded-list">
						<ol>
							{listItems}
						</ol>
					</div>
				</div>
			</div>
		</div>
		)
	}
}
