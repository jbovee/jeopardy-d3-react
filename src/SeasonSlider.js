import React, { Component } from 'react'
import './SeasonSlider.css'
import DailyDoubleHeatMap from './DailyDoubleHeatMap'
import seasonsdata from './jeopardy-seasons-data'
import { sliderHorizontal } from 'd3-simple-slider'
import { select } from 'd3-selection'

class SeasonSlider extends Component {
	constructor(props) {
		super(props);
		this.state = { season: 1 };
		this.createSeasonSlider = this.createSeasonSlider.bind(this);
	}

	componentDidMount() {
		this.createSeasonSlider();
	}

	createSeasonSlider() {
		const node = this.node
		const numSeasons = 33,
			seasons = Array.from(new Array(numSeasons), (val,index)=>index+1);

		const slider = sliderHorizontal()
			.min(1)
			.max(numSeasons)
			.step(1)
			.width(690)
			.tickValues(seasons)
			.on('end', val => {
				this.setState({ season: val });
			});

		select(node)
			.append("g")
			.attr("transform", "translate(10,10)")
			.call(slider);
	}

	render() {
		return [
			<div><svg id="slider" ref={node => this.node = node} width={675} height={55} viewBox="0 0 710 55" preserveAspectRatio="xMinYMax meet"> </svg></div>,
			<div><DailyDoubleHeatMap data={seasonsdata.seasons[this.state.season - 1]}/></div>
		];
	}
}

export default SeasonSlider;