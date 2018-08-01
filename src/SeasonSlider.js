import React, { Component } from 'react';
import './SeasonSlider.css';
import { sliderHorizontal } from 'd3-simple-slider';
import { select } from 'd3-selection';

class SeasonSlider extends Component {
	constructor(props) {
		super(props);
		this.state = { all: false, season: this.props.startSeason };
		this.createSeasonSlider = this.createSeasonSlider.bind(this);
	}

	componentDidMount() {
		this.createSeasonSlider();
		this.setState({ all: false, season: this.props.startSeason });
	}

	createSeasonSlider() {
		const node = this.node
		const numSeasons = 34,
			seasons = Array.from(new Array(numSeasons), (val,index)=>index+1);

		var slider = sliderHorizontal()
			.min(1)
			.max(numSeasons)
			.step(1)
			.width(640)
			.tickValues(seasons)
			.on('end', val => {
				this.props.handlerFromParent(false, val);
			});

		var margin = select(node)
			.append("g")
			.attr("class", "svg-margins")
			.attr("transform", "translate(40)");

		margin.append("g")
			.attr("id", "season-slider")
			.attr("transform", "translate(10 10)")
			.call(slider);

		var btn = margin.append("g")
			.attr("id", "all-button")
			.attr("transform", "translate(666 5)");

		btn.append("rect")
			.attr("x", 0)
			.attr("y", 0)
			.attr("width", 40)
			.attr("height", 40)
			.attr("rx", 10)
			.attr("ry", 10)
			.attr("z-index", 2);

		btn.append("text")
			.attr("x", 20)
			.attr("y", 20)
			.attr("text-anchor", "middle")
			.attr("alignment-baseline", "central")
			.text("All");

		btn.append("g")
			.attr("opacity", 0)
			.append("rect")
			.attr("class", "all-button-click")
			.attr("x", 0)
			.attr("y", 0)
			.attr("width", 45)
			.attr("height", 45)
			.attr("rx", 10)
			.attr("ry", 10)
			.on("click", function() {
				select(node).select("g#season-slider").classed("disabled", !select(node).select("g#season-slider").classed("disabled"));
				select(node).select("g#all-button rect").classed("clicked", !select(node).select("g#all-button rect").classed("clicked"));
				if(select(node).select("g#all-button rect").classed("clicked")) {
					this.props.handlerFromParent(true, 0);
				} else {
					var s = parseInt(select(node).select("g#season-slider .parameter-value text").text());
					this.props.handlerFromParent(false, s);
				}
			}.bind(this));
	}

	render() {
		return <svg id="slider" ref={node => this.node = node} width={790} height={55} viewBox="0 0 710 55" preserveAspectRatio="xMinYMax meet" />;
	}
}

export default SeasonSlider;