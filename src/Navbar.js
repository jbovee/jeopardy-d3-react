import React, { Component } from 'react';
import SeasonSlider from './SeasonSlider'

class Navbar extends Component {
	render() {
		return (
            <nav id="nav" class="navbar fixed-top navbar-dark bg-dark">
                <div className="mx-auto">
                    <a class="navbar-brand" href="#">Jeopardy Visualizations</a>
                    <SeasonSlider startSeason={1} handlerFromParent={this.props.handlerFromParent} />
                </div>
            </nav>
		);
	}
}

export default Navbar;