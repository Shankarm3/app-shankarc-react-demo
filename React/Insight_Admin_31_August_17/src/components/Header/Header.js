import React, { Component } from 'react';
import { Dropdown, DropdownMenu, DropdownItem } from 'reactstrap';
import SearchBar from '../../containers/Full/SearchBar.js';
import LogoutButton from '../../containers/Full/LogoutButton';

export default class Header extends Component {

  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      dropdownOpen: false
    };
  }

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  sidebarToggle(e) {
    e.preventDefault();
    document.body.classList.toggle('sidebar-hidden');
  }

  sidebarMinimize(e) {
    e.preventDefault();
    document.body.classList.toggle('sidebar-minimized');
  }

  mobileSidebarToggle(e) {
    e.preventDefault();
    document.body.classList.toggle('sidebar-mobile-show');
  }

  asideToggle(e) {
    e.preventDefault();
    document.body.classList.toggle('aside-menu-hidden');
  }

  render() {
    return (
				<nav id="top-navbar" className="navbar navbar-default navbar-static-top bg-info">
						<div className="row row-no-margin">
							<div className="col-sm-2 col-8" id="logo-container">
								<div className="opera-logo-header">
								</div>
							</div>
							<div className="col-sm-1 col-4 pull-left">
							  <a className="navbar-brand-label"><strong>AI <small><strong>FOR</strong></small> BI</strong></a>
							</div>
							<div className="col-sm-6 col-7" id="search-insight-dropdown">
								<SearchBar/>
							</div>
							<div className="col-sm-3 col-5">
								<Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle} className="user-login-menu">
								  <img src={'img/user-image.png'} className="img-fluid pull-left d-none d-sm-block" alt="userImage"/>
								  <button onClick={this.toggle} className="pull-center nav-link dropdown-toggle" data-toggle="dropdown" type="button" aria-haspopup="true" aria-expanded={this.state.dropdownOpen}>
									<span id="user-name-text" className="d-md-down-none">Jon Snow</span>
								  </button>

								  <DropdownMenu id="header-dropdown-menu" className="dropdown-menu">
									<DropdownItem header className="text-center"><strong>Account</strong></DropdownItem>
									<DropdownItem><i className="fa fa-user"></i> Profile</DropdownItem>
									<DropdownItem><i className="fa fa-wrench"></i> Settings</DropdownItem>
									<i className="dropdown-item fa fa-lock"><LogoutButton/></i>
								  </DropdownMenu>
								</Dropdown>
							</div>
					  </div>
				</nav>
    )
  }
}
