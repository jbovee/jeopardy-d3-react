import React, { Component } from 'react';
import './DailyDoubleOrder.css';
import { select } from 'd3-selection';
import { ticks, max } from 'd3-array';
import { format } from 'd3-format';
import { scalePoint, scaleLinear } from 'd3-scale';
import { axisBottom } from 'd3-axis';
import { interpolateNumber } from 'd3-interpolate';

class DailyDoubleOrder extends Component {
	constructor(props) {
		super(props);
		this.createChart = this.createChart.bind(this);
		this.updateChart = this.updateChart.bind(this);
	}

	componentDidMount() {
		this.createChart()
	}

	componentDidUpdate() {
		this.updateChart()
	}

	createChart() {
		const node = this.node
		const height = 200
		const width = 710
		const factor = 2

		var yScale = scaleLinear()
			.domain([0, max(this.props.round === "j" ? this.props.data.jOrder : this.props.data.djOrder) * factor])
			.range([0, height - 50]);

		var margin = select(node)
			.append("g")
			.attr("class", "svg-margins")
			.attr("transform", "translate(40)");

		margin.append("g")
			.attr("class", "bars")
			.selectAll("rect")
			.data(this.props.round === "j" ? this.props.data.jOrder : this.props.data.djOrder)
			.enter().append("rect")
			.attr("class", "bar")
			.attr("x", (d, i) => i * (width / 30))
			.attr("y", d => height - yScale(d * factor) - 25)
			.attr("width", width / 30 - 2)
			.attr("height", d => yScale(d * factor));

		margin.append("g")
			.attr("class", "bar-values")
			.selectAll("text")
			.data(this.props.round === "j" ? this.props.data.jOrder : this.props.data.djOrder)
			.enter().append("text")
			.attr("class", "bar-value")
			.attr("text-anchor", "middle")
			.attr("font-size", 10)
			.attr("font-family", "sans-serif")
			.attr("fill", "#fff")
			.attr("x", (d, i) => i * (width / 30) + (width / 60) - 2)
			.attr("y", d => height - yScale(d * factor) - 31)
			.text(d => d);

		var xScale = scalePoint()
			.domain(ticks(1,30,30))
			.range([0, width - 25]);

		var xAxis = axisBottom(xScale);

		margin.append("g")
			.attr("class", "x-axis")
			.attr("transform", () => "translate(" + (width / 30 / 2) + " " + (height - 21) + ")")
			.call(xAxis);
	}

	updateChart() {
		const node = this.node
		const factor = 2
		const height = 200
		const fmt = format(",d");

		var yScale = scaleLinear()
			.domain([0, max(this.props.round === "j" ? this.props.data.jOrder : this.props.data.djOrder) * factor])
			.range([0, height - 50]);

		select(node)
			.selectAll("g.bars rect")
			.data(this.props.round === "j" ? this.props.data.jOrder : this.props.data.djOrder)
			.transition().duration(1000)
			.attr("y", d => height - yScale(d * factor) - 25)
			.attr("height", d => yScale(d * factor));

		select(node)
			.selectAll("g.bar-values text")
			.data(this.props.round === "j" ? this.props.data.jOrder : this.props.data.djOrder)
			.transition().duration(1000)
			.attr("y", d => height - yScale(d * factor) - 31)
			.tween("text", function(d) {
				var that = select(this),
					i = interpolateNumber(that.text(), d);
				return t => that.text(fmt(i(t)));
			});
	}

	render() {
		return [
			<h3 className="subsubtitle indent">{this.props.title}</h3>,
			<svg ref={node => this.node = node} width={790} height={200} viewBox="0 0 790 200" preserveAspectRatio="xMidYMin meet" />
		];
	}
}

export default DailyDoubleOrder;