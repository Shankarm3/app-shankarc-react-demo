import React from 'react';
import { ListGroup, ListGroupItem } from 'reactstrap';
import { Link } from 'react-router-dom';

export default class LeftContainerInsight extends React.Component {
    constructor(props, context) {
      super(props);
	  this.state={
		  data:[],
		  topThreePicks:[],
		  mostViewed:[],
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
					topThreePicks: json.topThreePicks,
					mostViewed:json.mostViewed
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
		//console.log(sessionStorage.getItem("selectedInsightId"));
	}
	render(){
		let selectedInsightId = sessionStorage.getItem("selectedInsightId");
		var listItemsTopThree = this.state.topThreePicks.map((item, index)=>{
			return <ListGroupItem data={item["id"]} key={item["id"]}><Link to='/insight_detail' data={item["id"]} onClick={this.handleClick}>{item["insight_text"]}<br/> <span className="pull-right time-period-text"><small>{item["time_period"]}</small></span></Link></ListGroupItem>
		})
		var listItemsMostViewed = this.state.mostViewed.map((item, index)=>{
			return <ListGroupItem data={item["id"]} key={item["id"]}><Link to='/insight_detail' data={item["id"]} onClick={this.handleClick}>{item["insight_text"]}<br/> <span className="pull-right time-period-text"><small>{item["time_period"]}</small></span></Link></ListGroupItem>
		})
		return(
			<div id="right_container">
				<div className="right_container">
					<div id="insight-header"><h6><img src="img/top-three-picks.png" alt="top3Picks"/>&emsp;TOP 3 PICKS</h6></div>
					<div className="scrollbar-left-hub" id="left-sidebar-scroll-hub">
						<div className="force-overflow1">
							<ListGroup>
								{listItemsTopThree}
							</ListGroup>
						</div>
					</div>
				</div>
				<div>&nbsp;</div>
				<div id="right_container" className="right_container">
					<div id="insight-header1"><h6><img src="img/most-viewed.png" alt="top3Picks"/>&emsp;TOP 3 PICKS</h6></div>
					<div className="scrollbar-left-hub" id="left-sidebar-scroll-hub">
						<div className="force-overflow1">
							<ListGroup>
								{listItemsMostViewed}
							</ListGroup>
						</div>
					</div>
				</div>
			</div>
		)
	}
}
