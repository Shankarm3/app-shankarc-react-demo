import React from 'react';
import { ListGroup, ListGroupItem } from 'reactstrap';

export default class RightContainerSearch extends React.Component {
    constructor(props, context) {
      super(props);
	  this.state={
		  data:[],
	  }
	  this.handleClick = this.handleClick.bind(this);
    }
	componentDidMount(){
		fetch('/insight-search.json')
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
		});
		let selectedInsightId = event.target.attributes.getNamedItem('data').value;
		sessionStorage.setItem("selectedInsightId",selectedInsightId);
		console.log(sessionStorage.getItem("selectedInsightId"));*/
	}
	render(){
		var listItems = this.state.data.map((item, index)=>{
			return <ListGroupItem data={item["id"]} key={item["id"]}><a href="#">{item["insight_text"]}<br/> <span className="pull-right"><small>{item["time_period"]}</small></span></a></ListGroupItem>
		})
		return(
			<ListGroup>
				<ListGroupItem id="insight-header"><h6>SEARCHED INSIGHTS</h6></ListGroupItem>
				{listItems}
			</ListGroup>
		)
	}
}
