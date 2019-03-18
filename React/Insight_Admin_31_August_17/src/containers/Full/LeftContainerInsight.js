import React from 'react';
import { ListGroup, ListGroupItem } from 'reactstrap';
import { Link } from 'react-router-dom';

export default class LeftContainerInsight extends React.Component {
    constructor(props, context) {
      super(props);
	  this.state={
		  data:[],
		  activeIndex: 0
	  }
	  this.handleClick = this.handleClick.bind(this);
    }
	componentDidMount(){
		fetch('/insight.json')
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
		//console.log(sessionStorage.getItem("selectedInsightId"));
	}
	render(){
		let selectedInsightId = sessionStorage.getItem("selectedInsightId");
		var listItems = this.state.data.map((item, index)=>{
			var activeClass="";
			console.log('found:'+item["id"]+"::"+selectedInsightId);
			if(item["id"] == selectedInsightId){
				activeClass="active";
			}
			return <ListGroupItem data={item["id"]} key={item["id"]} className={activeClass}><Link to='/insight_hub' data={item["id"]} onClick={this.handleClick}>{item["insight_text"]}</Link></ListGroupItem>
		})
		return(
			<ListGroup>
				<ListGroupItem id="insight-header"><h6>INSIGHTS FEED<sup><span className="badge badge-danger">20</span></sup></h6><a className="settings-icon-right"><i className="icon-settings"></i></a></ListGroupItem>
				{listItems}
			</ListGroup>
		)
	}
}
