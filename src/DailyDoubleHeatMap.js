import React, { Component } from 'react'
import { scaleSequential } from 'd3-scale'
import { interpolateBlues } from 'd3-scale-chromatic'
import { transition } from 'd3-transition'
import { select } from 'd3-selection'
import { max } from 'd3-array'

class DailyDoubleHeatMap extends Component {
	constructor(props) {
		super(props);
		this.createHeatMap = this.createHeatMap.bind(this);
		this.updateHeatMap = this.updateHeatMap.bind(this);
		this.colors = scaleSequential()
			.interpolator(interpolateBlues);
	}

	componentDidMount() {
		this.createHeatMap()
	}

	componentDidUpdate() {
		this.updateHeatMap()
	}

	createHeatMap() {
		const node = this.node
		const colors = this.colors
		const factor = 10
		const cellWidth = 100
		const cellHeight = 80
		const margin = {"top": 40, "left": 60}

		select(node)
			.append("text")
			.attr("class", "colTitle")
			.attr("fill", "#fff")
			.attr("x", 300 + margin.left)
			.attr("y", margin.top / 2)
			.attr("font-size", 18)
			.attr("text-anchor", "middle")
			.attr("alignment-baseline", "central")
			.text("Categories");

		select(node)
			.append("text")
			.attr("class", "colTitle")
			.attr("fill", "#fff")
			.attr("x", 660 + margin.left)
			.attr("y", margin.top / 2)
			.attr("font-size", 18)
			.attr("text-anchor", "middle")
			.attr("alignment-baseline", "central")
			.text("Totals");

		select(node)
			.selectAll("text.rowTitle")
			.data(["200", "400", "600", "800", "1000"])
			.enter().append("text")
			.attr("class", "rowTitle")
			.attr("fill", "#fff")
			.attr("transform", function(d, i) {
				return "translate(" + margin.left / 2 + " " + ((i * cellHeight) + cellHeight / 2 + margin.top) + ")";
			})
			.attr("font-size", 18)
			.attr("text-anchor", "middle")
			.attr("alignment-baseline", "central")
			.text(function(d) { return d; })

		select(node)
			.append("text")
			.attr("class", "rowTitle")
			.attr("fill", "#fff")
			.attr("transform", function() {
				return "translate(" + margin.left / 2 + " " + ((5 * cellHeight) + cellHeight / 2 + margin.top + 10) + ")";
			})
			.attr("font-size", 18)
			.attr("text-anchor", "middle")
			.attr("alignment-baseline", "central")
			.text("Totals");

		const rects = select(node)
			.selectAll("g.col")
			.data(this.props.data.locationTotals)
			.enter().append("g")
			.attr("class", "col")
			.attr("transform", function(d, i) {
				return "translate(" + (i * cellWidth + margin.left) + " " + margin.top + ")";
			});

		colors.domain([1, max(this.props.data.reduced) * factor]);

		const cells = rects.selectAll("g")
			.data(this.props.data.locationTotals);

		cells.data(function(d) { return d; })
			.enter().append("rect")
			.attr("x", 0)
			.attr("y", function(d, i) {
				return i * cellHeight;
			})
			.attr("height", cellHeight)
			.attr("width", cellWidth)
			.attr("class", "heatCell")
			.attr("z-index", 2)
			.attr("fill", "#fff")
			.transition().duration(1000)
			.attr("fill", function(d) {
				return colors(d * factor);
			});

		colors.domain([1, max(this.props.data.rowTotals) * factor]);

		select(node)
			.append("g")
			.attr("class", "rowTotals")
			.attr("transform", function() {
				return "translate(" + (6 * cellWidth + 10 + margin.left) + " " + margin.top + ")";
			})
			.selectAll("rect")
			.data(this.props.data.rowTotals)
			.enter().append("rect")
			.attr("x", 0)
			.attr("y", function(d, i) {
				return i * cellHeight;
			})
			.attr("height", cellHeight)
			.attr("width", cellWidth)
			.attr("class", "heatRow")
			.attr("fill", "#fff")
			.transition().duration(1000)
			.attr("fill", function(d) {
				return colors(d * factor);
			});

		colors.domain([1, max(this.props.data.colTotals) * factor])

		select(node)
			.append("g")
			.attr("class", "colTotals")
			.attr("transform", function() {
				return "translate(" + margin.left + " " + (5 * cellHeight + 10 + margin.top) + ")";
			})
			.selectAll("rect")
			.data(this.props.data.colTotals)
			.enter().append("rect")
			.attr("x", function(d, i) {
				return i * cellWidth;
			})
			.attr("y", 0)
			.attr("height", cellHeight)
			.attr("width", cellWidth)
			.attr("class", "heatCol")
			.attr("fill", "#fff")
			.transition().duration(1000)
			.attr("fill", function(d) {
				return colors(d * factor);
			});
	}

	updateHeatMap() {
		const node = this.node
		const colors = this.colors
		const factor = 10

		colors.domain([1, max(this.props.data.reduced) * factor]);

		const g= select(node)
			.selectAll("g.col")
			.data(this.props.data.locationTotals);

		g.selectAll("rect.heatCell")
			.data(function(d) { return d; })
			.transition().duration(1000)
			.attr("fill", function(d) {
				return colors(d * factor);
			});

		colors.domain([1, max(this.props.data.rowTotals) * factor]);

		const gCol = select(node)
			.select("g.rowTotals");

		gCol.selectAll("rect.heatRow")
			.data(this.props.data.rowTotals)
			.transition().duration(1000)
			.attr("fill", function(d) {
				return colors(d * factor);
			});

		colors.domain([1, max(this.props.data.colTotals) * factor]);

		const gRow = select(node)
			.select("g.colTotals");

		gRow.selectAll("rect.heatCol")
			.data(this.props.data.colTotals)
			.transition().duration(1000)
			.attr("fill", function(d) {
				return colors(d * factor);
			});
	}

	render() {
		return <svg ref={node => this.node = node}
		width={770} height={530} viewBox="0 0 750 530" preserveAspectRatio="xMinYMax meet">
		</svg>
	}
}

export default DailyDoubleHeatMap;