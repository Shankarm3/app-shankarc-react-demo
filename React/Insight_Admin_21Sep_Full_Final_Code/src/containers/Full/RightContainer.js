import React from 'react';
import { ListGroup, ListGroupItem } from 'reactstrap';
import { Link } from 'react-router-dom';

export default class RightContainer extends React.Component {
    constructor(props, context) {
      super(props);
	  this.state={
		  data:[],
		  activeIndex: 0,
		  loading:true
	  }
	  this.handleClick = this.handleClick.bind(this);
    }
	componentDidMount(){
		fetch('/insight.json')
			.then(response => response.json())
			.then(json => {
				this.setState({
					loading:false,
					data: json.data
				});
				let selectedInsightId = this.state.data[0]["id"];
				sessionStorage.setItem("selectedInsightId",selectedInsightId);
		});

	}
	handleClick(event){
		/*fetch('http://localhost:3000/chart1.json')
			.then(response => response.json())
			.then(json => {
			this.props.changeData(json.data);
		});*/
		let selectedInsightId = event.target.attributes.getNamedItem('data').value;
		sessionStorage.setItem("selectedInsightId",selectedInsightId);
		console.log(sessionStorage.getItem("selectedInsightId"));
	}
	render(){
		if(this.state.loading){
			return (
				<div className="ajax-loader-charts"><img src="img/spinner.gif" alt="Loader"/></div>
			)
		}
		else{
			
			var listItems = this.state.data.map((item, index)=>{
				return <ListGroupItem data={item["id"]} key={item["id"]}><Link to='/insight_hub' data={item["id"]} onClick={this.handleClick}>{item["insight_text"]}<br/> <span className="pull-right time-period-text"><small>{item["time_period"]}</small></span></Link></ListGroupItem>
			})
			return(
				<ListGroup>
					<ListGroupItem id="insight-header"><h6>INSIGHTS FEED<sup><span className="badge badge-danger">20</span></sup></h6><a className="settings-icon-right"><i className="icon-settings"></i></a></ListGroupItem>
					{listItems}
				</ListGroup>
			)
		}
	}
}
