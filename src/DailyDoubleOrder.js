import React, { Component } from 'react'
import './DailyDoubleOrder.css'
import { select } from 'd3-selection'
import { ticks, max } from 'd3-array'
import { format } from 'd3-format'
import { scalePoint, scaleLinear } from 'd3-scale'
import { axisBottom, axisLeft } from 'd3-axis'
import { interpolateNumber } from 'd3-interpolate'

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

		select(node)
			.append("g")
			.attr("class", "bars")
			.selectAll("rect")
			.data(this.props.round === "j" ? this.props.data.jOrder : this.props.data.djOrder)
			.enter().append("rect")
			.attr("class", "bar")
			.attr("x", function(d, i) {
				return i * (width / 30);
			})
			.attr("y", function(d) {
				return height - yScale(d * factor) - 25;
			})
			.attr("width", width / 30 - 2)
			.attr("height", function(d) { return yScale(d * factor); });

		select(node)
			.append("g")
			.attr("class", "bar-values")
			.selectAll("text")
			.data(this.props.round === "j" ? this.props.data.jOrder : this.props.data.djOrder)
			.enter().append("text")
			.attr("class", "bar-value")
			.attr("text-anchor", "middle")
			.attr("font-size", 10)
			.attr("font-family", "sans-serif")
			.attr("fill", "#fff")
			.attr("x", function(d, i) {
				return i * (width / 30) + (width / 60) - 2;
			})
			.attr("y", function(d) {
				return height - yScale(d * factor) - 31;
			})
			.text(function(d) { return d; });

		var xScale = scalePoint()
			.domain(ticks(1,30,30))
			.range([0, width - 25]);

		var xAxis = axisBottom(xScale);

		select(node)
			.append("g")
			.attr("transform", function() {
				return "translate(" + (width / 30 / 2) + " " + (height - 21) + ")";
			})
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
			.attr("y", function(d) {
				return height - yScale(d * factor) - 25;
			})
			.attr("height", function(d) { return yScale(d * factor); });

		select(node)
			.selectAll("g.bar-values text")
			.data(this.props.round === "j" ? this.props.data.jOrder : this.props.data.djOrder)
			.transition().duration(1000)
			.attr("y", function(d) {
				return height - yScale(d * factor) - 31;
			})
			.tween("text", function(d) {
				var that = select(this),
					i = interpolateNumber(that.text(), d);
				return function(t) { that.text(fmt(i(t))); };
			});
	}

	render() {
		return <svg ref={node => this.node = node} width={710} height={200} viewBox="0 0 710 200" preserveAspectRatio="xMinYMax meet"></svg>
	}
}

export default DailyDoubleOrder;