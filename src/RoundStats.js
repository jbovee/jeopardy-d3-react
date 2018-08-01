import React, { Component } from 'react';
import './RoundStats.css';
import { interpolateNumber } from 'd3-interpolate';
import { select } from 'd3-selection';
import { format } from 'd3-format';

class RoundStats extends Component {
	constructor(props) {
		super(props);
		this.createStats = this.createStats.bind(this);
		this.updateStats = this.updateStats.bind(this);
	}

	componentDidMount() {
		this.createStats()
	}

	componentDidUpdate() {
		this.updateStats()
	}

	createStats() {
		const node = this.node,
			fmt = format(",d"),
			type = { dd: [this.props.data.ddMax, this.props.data.ddMin, this.props.data.ddAvg], fj: [this.props.data.fjMax, this.props.data.fjMin, this.props.data.fjAvg] },
			canvas = document.createElement("canvas"),
			ctx = canvas.getContext("2d");
		ctx.font = "24px sans-serif";

		const margin = select(node)
			.append("g")
			.attr("class", "svg-margins")
			.attr("transform", "translate(40)");

		margin.selectAll("text.stat-label")
			.data(["Max: ", "Min: ", "Avg: "])
			.enter().append("text")
			.attr("class", "stat-label")
			.attr("x", (d, i) => (i * 180) + 60 - ctx.measureText(d).width)
			.attr("y", 40)
			.text(d => d);

		margin.selectAll("text.stat-value")
			.data(type[this.props.type])
			.enter().append("text")
			.attr("class", "stat-value")
			.attr("x", (d, i) => (i * 180) + 60)
			.attr("y", 40)
			.text(d => fmt(d));

		canvas.remove();
	}

	updateStats() {
		const node = this.node,
			fmt = format(",d"),
			type = { dd: [this.props.data.ddMax, this.props.data.ddMin, this.props.data.ddAvg], fj: [this.props.data.fjMax, this.props.data.fjMin, this.props.data.fjAvg]};

		select(node)
			.selectAll("text.stat-value")
			.data(type[this.props.type])
			.transition()
			.duration(1000)
			.tween("text", function(d) {
				const that = select(this),
					i = interpolateNumber(that.text().replace(/,/g, ""), d);
				return t => that.text(fmt(i(t)));
			});
	}

	render() {
		return [
			<h2 className="subtitle indent">{this.props.title}</h2>,
			<svg ref={node => this.node = node} width={546} height={63} viewBox="0 0 546 63" preserveAspectRatio="xMinYMax meet" />
		];
	}
}

export default RoundStats;