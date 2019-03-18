import React from 'react';
import Highcharts from 'highcharts';
import { Link } from 'react-router-dom';
import RightContainerInsightDetail from './RightContainerInsightDetail.js';

export default class MiddleContainerInsightDetail extends React.Component {
    constructor(props, context) {
      super(props);
	  this.state={
		  data:[],
		  loading:true
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
					loading:false
				});
		});
	}
	componentDidUpdate(){
		let selectedInsightId = sessionStorage.getItem("selectedInsightId");
		let selectedChart = "";
		switch(selectedInsightId){
			
			case "insight_1":{
				selectedChart="chart-1.json";
				break;
			}
			case "insight_2":{
				selectedChart="chart-2.json";
				break;
			}
			case "insight_3":{
				selectedChart="chart-3.json";
				break;
			}
			case "insight_4":{
				selectedChart="chart-4.json";
				break;
			}
			case "insight_5":{
				selectedChart="chart-5.json";
				break;
			}
			case "insight_6":{
				selectedChart="chart-6.json";
				break;
			}
			case "insight_7":{
				selectedChart="chart-7.json";
				break;
			}
			case "insight_8":{
				selectedChart="chart-8.json";
				break;
			}
			case "insight_9":{
				selectedChart="chart-9.json";
				break;
			}
			case "insight_10":{
				selectedChart="chart-10.json";
				break;
			}
			case "insight_11":{
				selectedChart="chart-11.json";
				break;
			}
			case "insight_12":{
				selectedChart="chart-12.json";
				break;
			}
			case "insight_13":{
				selectedChart="chart-13.json";
				break;
			}
			case "insight_14":{
				selectedChart="chart-14.json";
				break;
			}
			case "insight_15":{
				selectedChart="chart-15.json";
				break;
			}
			case "insight_16":{
				selectedChart="chart-16.json";
				break;
			}
			case "insight_17":{
				selectedChart="chart-17.json";
				break;
			}
			case "insight_18":{
				selectedChart="chart-18.json";
				break;
			}
			case "insight_19":{
				selectedChart="chart-19.json";
				break;
			}
			case "insight_20":{
				selectedChart="chart-20.json";
				break;
			}
			case "insight_21":{
				selectedChart="chart-21.json";
				break;
			}
			case "insight_22":{
				selectedChart="chart-22.json";
				break;
			}
			case "insight_23":{
				selectedChart="chart-23.json";
				break;
			}
			case "insight_24":{
				selectedChart="chart-24.json";
				break;
			}
			case "insight_25":{
				selectedChart="chart-25.json";
				break;
			}
			case "insight_26":{
				selectedChart="chart-26.json";
				break;
			}
			case "insight_27":{
				selectedChart="chart-27.json";
				break;
			}
			case "insight_28":{
				selectedChart="chart-28.json";
				break;
			}
			case "insight_29":{
				selectedChart="chart-29.json";
				break;
			}
			case "insight_30":{
				selectedChart="chart-30.json";
				break;
			}
			case "insight_31":{
				selectedChart="chart-31.json";
				break;
			}
			case "insight_32":{
				selectedChart="chart-32.json";
				break;
			}
			case "insight_33":{
				selectedChart="chart-33.json";
				break;
			}
			case "insight_34":{
				selectedChart="chart-34.json";
				break;
			}
			case "insight_35":{
				selectedChart="chart-35.json";
				break;
			}
			case "insight_36":{
				selectedChart="chart-36.json";
				break;
			}
			case "insight_37":{
				selectedChart="chart-37.json";
				break;
			}
			case "insight_38":{
				selectedChart="chart-38.json";
				break;
			}
			case "insight_39":{
				selectedChart="chart-39.json";
				break;
			}
			default:{
				selectedChart="chart-6.json";
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
		let listItems = null;
		let showBottom = false;
		let showBottomClass = "";
		this.state.data.map((item, index)=>{
			if(item["id"].toString() === selectedInsightId.toString()){
				releventInsights = item["releventInsights"];
				insightLabelText = item["insight_text"];
			}
		})
		
		listItems = releventInsights.map((item, index)=>{
			for(let obj of this.state.data){
				if(obj.id.toString() === item.toString()){
					return <li data={obj["id"]} key={obj["id"]} className="list-group-item"><span className="badge badge-pill badge-primary d-none d-sm-block">{index+1}.</span><Link to='/insight_hub' data={obj["id"]} onClick={this.handleClick}>{obj["insight_text"]}</Link><span className="right-icon-gt pull-right d-none d-sm-block"><i className="pull-right fa fa-chevron-right" aria-hidden="true"></i></span></li>
				}
			}
		})
		if(listItems && listItems.length>0){
			showBottomClass = "show-middle-bottom-section";
		}
		else{
			showBottomClass = "";
		}
		return(
		<div>
				<div className="row">
					<div className="col-sm-12">
						<header><h6 className="middle-part-heading"><strong>{insightLabelText}</strong></h6></header>
					</div>
				</div>
				<div className="row">
					<div className="chart-column col-sm-8">
						<div className="middle-outer-wrapper" id="chart-outer-wrapper">
							<div ref="chart" id="middle-chart-container">
									<div className="ajax-loader-charts"><img src="img/spinner.gif" alt="Loader"/>
									</div>
							</div>
						</div>
						<div className={"bottom-container mt-20 middle-outer-wrapper-b "+showBottomClass} id="bottom-container">
									<header><h6 id="bottom-part-heading"><span><img src="img/insight-bottom-icon.png" alt="bottomIcon"/></span>&emsp;DID YOU KNOW?</h6></header>
									<div className="rounded-list">
										<div className="list-group">
											{listItems}
										</div>
									</div>
						</div>
					</div>
					<div className="col-sm-4">
						<div id="right_container" className="right_container">
							<RightContainerInsightDetail/>
						</div>
					</div>
				</div>
				{/*<div className="row bottom-container" id="bottom-container">
					<div className="col-sm-8 middle-outer-wrapper-b">
							<header><h6 id="bottom-part-heading"><span><i className="fa fa-snowflake-o fa-lg" aria-hidden="true"></i></span>DID YOU KNOW?</h6></header>
							<div className="rounded-list">
								<div className="list-group">
									{listItems}
								</div>
							</div>
					</div>
				</div>*/}
		</div>
		)
	}
}
