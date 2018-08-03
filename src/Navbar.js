import React, { Component } from 'react';
import SeasonSlider from './SeasonSlider';
import MediaQuery from 'react-responsive';
import { Button, FormGroup, Input, Navbar, Nav, NavItem } from 'reactstrap';

class NavBar extends Component {
	constructor(props) {
		super(props);
		this.season = React.createRef();
		this.state = {
			all: false,
			dropdownOpen: false,
			season: 1
		};
		this.handleChange = this.handleChange.bind(this);
		this.buttonToggle = this.buttonToggle.bind(this);
	}

	handleChange(e) {
		this.props.handlerFromParent(false, e.target.value);
		this.setState({
			season: e.target.value
		});
	}

	buttonToggle() {
		const all = !this.state.all;
		this.props.handlerFromParent(all, this.state.season);
		this.setState({
			all: all
		});
	}

	render() {
		return (
            <div>
                <MediaQuery query="(min-device-width: 710px)">
					<Navbar color="dark" dark fixed="top">
						<Nav className="mx-auto" navbar>
                            <SeasonSlider startSeason={1} handlerFromParent={this.props.handlerFromParent} />
						</Nav>
					</Navbar>
                </MediaQuery>
                <MediaQuery query="(max-device-width: 710px)">
					<Navbar color="dark" dark fixed="top">
						<Nav className="mx-auto" navbar>
							<NavItem>
								<FormGroup>
									<Input type="select" name="season" id="season-select" disabled={this.state.all} onChange={this.handleChange} value={this.state.season}>
										{[...Array(34).keys()].map(n => <option value={n+1}>{n+1}</option>)}
									</Input>
								</FormGroup>
							</NavItem>
							<NavItem>
								<Button color="secondary" active={this.state.all} onClick={this.buttonToggle}>All</Button>
							</NavItem>
						</Nav>
					</Navbar>
                </MediaQuery>
            </div>
		);
	}
}

export default NavBar;