import React from 'react';
import { ListGroup, ListGroupItem } from 'reactstrap';
import { Link } from 'react-router-dom';

export default class RightContainerInsightDetail extends React.Component {
    constructor(props, context) {
      super(props);
	  this.state={
		  data:[],
		  loading:true,
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
					loading:false
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
		var listItems = null;
		
		this.state.data.map((item, index)=>{
			if(item["id"].toString() === selectedInsightId.toString()){
				relatedInsights = item["relatedInsights"];
			}
		})
		
		listItems = relatedInsights.map((item, index)=>{
			for(let obj of this.state.data){
				if(obj.id.toString() === item.toString()){
					return <ListGroupItem data={obj["id"]} key={obj["id"]}><Link to='/insight_detail' data={obj["id"]} onClick={this.handleClick}>{obj["insight_text"]}<br/> <span className="pull-right time-period-text"><small>{obj["time_period"]}</small></span></Link></ListGroupItem>
				}
			}
		})
		console.log(listItems);
		if(this.state.loading){
			return (
				<div className="ajax-loader-charts"><img src="img/spinner.gif" alt="Loader"/></div>
			)
		}
		else{
			return(
			<div>
				<div id="insight-header"><h6><span className="insigh-right-span"><img src="img/insight-right-icon.png" alt="rightIcon"/></span>&emsp;YOU MIGHT ALSO LIKE<sup></sup></h6></div>
				<div className="scrollbar-right" id="right-sidebar-scroll">
					<div className="force-overflow">
						<ListGroup>
							{listItems}
						</ListGroup>
					</div>
				</div>
			</div>
			)
		}
	}
}
