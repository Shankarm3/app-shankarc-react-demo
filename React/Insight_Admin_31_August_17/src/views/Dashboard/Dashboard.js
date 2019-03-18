import React, { Component } from 'react';

class Dashboard extends Component {
	
	render() {
		return (
			<div className="animated fadeIn">
				<div className="row mt-2"></div>
				<div className="row">
					<div className="col-sm-6 col-lg-3">
						<div className="card card-inverse card-primary">
							<div className="row card-row">
								<div className="col-sm-6">
									<i className="fa fa-sitemap fa-lg" aria-hidden="true"></i>
								</div>
								<div className="col-sm-6">
									<h2 className="mb-0 text-right label-number">9</h2>
									<p className="text-right label-text">Organisations</p>
								</div>
							</div>
						</div>
					</div>
					<div className="col-sm-6 col-lg-3">
						<div className="card card-inverse card-danger">
							<div className="row card-row">
								<div className="col-sm-6">
									<i className="fa fa-sitemap fa-lg" aria-hidden="true"></i>
								</div>
								<div className="col-sm-6">
									<h2 className="mb-0 text-right label-number">19</h2>
									<p className="text-right label-text">Organisations</p>
								</div>
							</div>
						</div>
					</div>
					<div className="col-sm-6 col-lg-3">
						<div className="card card-inverse card-success">
							<div className="row card-row">
								<div className="col-sm-6">
									<i className="fa fa-users fa-lg" aria-hidden="true"></i>
								</div>
								<div className="col-sm-6">
									<h2 className="mb-0 text-right label-number">41</h2>
									<p className="text-right label-text">Users</p>
								</div>
							</div>
						</div>
					</div>
					<div className="col-sm-6 col-lg-3">
						<div className="card card-inverse card-primary">
							<div className="row card-row">
								<div className="col-sm-6">
									<i className="fa fa-users fa-lg" aria-hidden="true"></i>
								</div>
								<div className="col-sm-6">
									<h2 className="mb-0 text-right label-number">51</h2>
									<p className="text-right label-text">Users</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default Dashboard;
