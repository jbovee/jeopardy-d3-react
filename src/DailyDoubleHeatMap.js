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
		const labelFontSize = 22
		const margin = {"top": 40, "left": 40, "bottom": 40, "right": 40}

		var labels = select(node)
			.append("g")
			.attr("class", "labels")

		labels.append("text")
			.attr("class", "colTitle")
			.attr("fill", "#fff")
			.attr("x", 300 + margin.left)
			.attr("y", margin.top / 2)
			.attr("font-size", labelFontSize)
			.attr("text-anchor", "middle")
			.attr("alignment-baseline", "central")
			.text("Categories");

		labels.append("text")
			.attr("class", "colTitle")
			.attr("fill", "#fff")
			.attr("x", 300 + margin.left)
			.attr("y", margin.top + (6 * cellHeight) + 10 + (margin.bottom / 2))
			.attr("font-size", labelFontSize)
			.attr("text-anchor", "middle")
			.attr("alignment-baseline", "central")
			.text("Totals");

		labels.append("text")
			.attr("class", "colTitle")
			.attr("fill", "#fff")
			.attr("transform", function() {
				return "translate(" + margin.left / 2 + " " + ((5 * cellHeight / 2) + margin.top) + ")rotate(-90)";
			})
			.attr("font-size", labelFontSize)
			.attr("text-anchor", "middle")
			.attr("alignment-baseline", "central")
			.text("Values");

		labels.append("text")
			.attr("class", "colTitle")
			.attr("fill", "#fff")
			.attr("transform", function() {
				return "translate(" + (margin.left + (7 * cellWidth) + 10 + (margin.right / 2)) + " " + ((5 * cellHeight / 2) + margin.top) + ")rotate(-90)";
			})
			.attr("font-size", labelFontSize)
			.attr("text-anchor", "middle")
			.attr("alignment-baseline", "central")
			.text("Totals");

		var rects = select(node)
			.selectAll("g.col")
			.data(this.props.data.locationTotals)
			.enter().append("g")
			.attr("class", "col")
			.attr("transform", function(d, i) {
				return "translate(" + (i * cellWidth + margin.left) + " " + margin.top + ")";
			});

		colors.domain([1, max(this.props.data.reduced) * factor]);

		var cells = rects.selectAll("g")
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
			.attr("fill", "#fff");

		colors.domain([1, max(this.props.data.rowTotals) * factor]);

		var heatRows = select(node)
			.append("g")
			.attr("class", "rowTotals")
			.attr("transform", function() {
				return "translate(" + (6 * cellWidth + 10 + margin.left) + " " + margin.top + ")";
			});

		heatRows.selectAll("rect")
			.data(this.props.data.rowTotals)
			.enter().append("rect")
			.attr("x", 0)
			.attr("y", function(d, i) {
				return i * cellHeight;
			})
			.attr("height", cellHeight)
			.attr("width", cellWidth)
			.attr("class", "heatRow")
			.attr("fill", "#fff");

		colors.domain([1, max(this.props.data.colTotals) * factor])

		var heatCols = select(node)
			.append("g")
			.attr("class", "colTotals")
			.attr("transform", function() {
				return "translate(" + margin.left + " " + (5 * cellHeight + 10 + margin.top) + ")";
			});

		heatCols.selectAll("rect")
			.data(this.props.data.colTotals)
			.enter().append("rect")
			.attr("x", function(d, i) {
				return i * cellWidth;
			})
			.attr("y", 0)
			.attr("height", cellHeight)
			.attr("width", cellWidth)
			.attr("class", "heatCol")
			.attr("fill", "#fff");

		var g = cells.enter().append("g")
			.attr("opacity", 0)
			.on("mouseover", function() {
				select(this).transition()
					.duration(250)
					.attr("opacity", 1);
			})
			.on("mouseout", function() {
				select(this).transition()
					.duration(250)
					.attr("opacity", 0);
			});

		g.data(function(d) { return d; })
			.append("rect")
			.attr("fill", "#000")
			.attr("fill-opacity", 0.4)
			.attr("x", 0)
			.attr("y", function(d, i) {
				return i * cellHeight;
			})
			.attr("height", cellHeight)
			.attr("width", cellWidth)
			.attr("class", "tipCell");

		g.data(function(d) { return d; })
			.append("text")
			.attr("x", (cellWidth / 2))
			.attr("y", function(d, i) {
				return i * cellHeight + (cellHeight / 2);
			})
			.attr("font-family", "sans-serif")
			.attr("font-size", "24")
			.attr("fill", "#fff")
			.attr("text-anchor", "middle")
			.attr("alignment-baseline", "central")
			.attr("class", "tip")
			.text("");

		var gRow = heatRows.selectAll("g.rowTip")
			.data(this.props.data.rowTotals)
			.enter().append("g")
			.attr("opacity", 0)
			.on("mouseover", function() {
				select(this).transition()
					.duration(250)
					.attr("opacity", 1);
			})
			.on("mouseout", function() {
				select(this).transition()
					.duration(250)
					.attr("opacity", 0);
			});

		gRow.append("rect")
			.attr("fill", "#000")
			.attr("fill-opacity", 0.4)
			.attr("x", 0)
			.attr("y", function(d, i) {
				return i * cellHeight;
			})
			.attr("height", cellHeight)
			.attr("width", cellWidth)
			.attr("class", "rowTipCell");

		gRow.append("text")
			.attr("x", (cellWidth / 2))
			.attr("y", function(d, i) {
				return i * cellHeight + (cellHeight / 2);
			})
			.attr("font-family", "sans-serif")
			.attr("font-size", 24)
			.attr("fill", "#fff")
			.attr("text-anchor", "middle")
			.attr("alignment-baseline", "central")
			.attr("class", "rowTipText")
			.text("");

		var gCol = heatCols.selectAll("g.colTip")
			.data(this.props.data.colTotals)
			.enter().append("g")
			.attr("opacity", 0)
			.on("mouseover", function() {
				select(this).transition()
					.duration(250)
					.attr("opacity", 1);
			})
			.on("mouseout", function() {
				select(this).transition()
					.duration(250)
					.attr("opacity", 0);
			});

		gCol.append("rect")
			.attr("fill", "#000")
			.attr("fill-opacity", 0.4)
			.attr("x", function(d, i) {
				return i * cellWidth;
			})
			.attr("y", 0)
			.attr("height", cellHeight)
			.attr("width", cellWidth)
			.attr("class", "colTipCell");

		gCol.append("text")
			.attr("x", function(d, i) {
				return i * cellWidth + (cellWidth / 2);
			})
			.attr("y", (cellHeight / 2))
			.attr("font-family", "sans-serif")
			.attr("font-size", 24)
			.attr("fill", "#fff")
			.attr("text-anchor", "middle")
			.attr("alignment-baseline", "central")
			.attr("class", "colTipText")
			.text("");
	}

	updateHeatMap() {
		const node = this.node
		const colors = this.colors
		const factor = 10

		colors.domain([1, max(this.props.data.reduced) * factor]);

		var g= select(node)
			.selectAll("g.col")
			.data(this.props.data.locationTotals);

		g.selectAll("rect.heatCell")
			.data(function(d) { return d; })
			.transition().duration(1000)
			.attr("fill", function(d) {
				return colors(d * factor);
			});

		g.selectAll("text.tip")
			.data(function(d) { return d; })
			.transition().duration(1000)
			.text(function(d) { return d; });

		colors.domain([1, max(this.props.data.rowTotals) * factor]);

		var gRow = select(node)
			.select("g.rowTotals");

		gRow.selectAll("rect.heatRow")
			.data(this.props.data.rowTotals)
			.transition().duration(1000)
			.attr("fill", function(d) {
				return colors(d * factor);
			});

		gRow.selectAll("text.rowTipText")
			.data(this.props.data.rowTotals)
			.transition().duration(1000)
			.text(function(d) { return d; });

		colors.domain([1, max(this.props.data.colTotals) * factor]);

		var gCol = select(node)
			.select("g.colTotals");

		gCol.selectAll("rect.heatCol")
			.data(this.props.data.colTotals)
			.transition().duration(1000)
			.attr("fill", function(d) {
				return colors(d * factor);
			});

		gCol.selectAll("text.colTipText")
			.data(this.props.data.colTotals)
			.transition().duration(1000)
			.text(function(d) { return d; });
	}

	render() {
		return <svg ref={node => this.node = node}
		width={790} height={570} viewBox="0 0 790 570" preserveAspectRatio="xMinYMax meet">
		</svg>
	}
}

export default DailyDoubleHeatMap;