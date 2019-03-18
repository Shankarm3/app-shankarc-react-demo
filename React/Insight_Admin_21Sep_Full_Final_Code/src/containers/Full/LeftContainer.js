import React from 'react';
import Highcharts from 'highcharts';

export default class LeftContainer extends React.Component {

    constructor(props, context) {
		super(props);
		this.state={
			barData: [],
			lineData: [],
			stackedBarData: [],
			chartFourData: [],
			chartFiveData: [],
		}
    }

	componentDidMount(){
		
		sessionStorage.setItem("selectedInsightId","insight_1");
		fetch('/chart-1.json')
			.then(response => response.json())
			.then(json => {
				this.setState({
					barData: json.data,
				});
		});

		fetch('/chart-2.json')
			.then(response => response.json())
			.then(json => {
				this.setState({
					lineData: json.data,
				});
		});

		fetch('/chart-3.json')
			.then(response => response.json())
			.then(json => {
				this.setState({
					stackedBarData: json.data,
				});
		});

		fetch('/chart-4.json')
			.then(response => response.json())
			.then(json => {
				this.setState({
					chartFourData: json.data,
				});
		});
		
		fetch('/chart5.json')
			.then(response => response.json())
			.then(json => {
				this.setState({
					chartFiveData: json.data,
				});
		});
		
	}
	
	componentDidUpdate(prevProps, prevState){
		this.chart1=new Highcharts[this.props.type || "Chart"](
			this.refs.chart1,
			this.state.barData
		);
		this.chart2=new Highcharts[this.props.type || "Chart"](
			this.refs.chart2,
			this.state.lineData
		);
		this.chart3=new Highcharts[this.props.type || "Chart"](
			this.refs.chart3,
			this.state.stackedBarData
		);
		this.chart4=new Highcharts[this.props.type || "Chart"](
			this.refs.chart4,
			this.state.chartFourData
		);
		/*this.chart5=new Highcharts[this.props.type || "Chart"](
			this.refs.chart5,
			this.state.chartFiveData
		);*/
	}
	render() {
		return (
			<div id="chart-container">
			<div className="row">
				<div className="chart-column col-sm-6">
					<div className="dashboard-charts" ref="chart1"><div className="ajax-loader-charts"><img src="img/spinner.gif" alt="Loader"/></div></div>
				</div>
				<div className="chart-column col-sm-6">
					<div className="dashboard-charts" ref="chart2"><div className="ajax-loader-charts"><img src="img/spinner.gif" alt="Loader"/></div></div>
				</div>
			</div>
			<div className="row">
				<div className="chart-column col-sm-6">
					<div className="dashboard-charts" ref="chart3"><div className="ajax-loader-charts"><img src="img/spinner.gif" alt="Loader"/></div></div>
				</div>
				<div className="chart-column col-sm-6">
					<div className="dashboard-charts" ref="chart4"><div className="ajax-loader-charts"><img src="img/spinner.gif" alt="Loader"/></div></div>
				</div>
			</div>
			{/*<div className="row">
				<div className="chart-column col-sm-6">
					<div className="dashboard-charts" ref="chart5"></div>
				</div>
				<div className="chart-column col-sm-6">
					<div className="dashboard-charts" ref="chart6"></div>
				</div>
			</div>*/}
			</div>
		)
    }
	componentWillUnmount() {
		this.chart1.destroy();
		this.chart2.destroy();
		this.chart3.destroy();
		this.chart4.destroy();
    }
}