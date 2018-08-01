import React, { Component } from 'react';
import { scaleSequential } from 'd3-scale';
import { interpolateBlues } from 'd3-scale-chromatic';
import { transition } from 'd3-transition';
import { select } from 'd3-selection';
import { max } from 'd3-array';

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
		const node = this.node,
			colors = this.colors,
			factor = 10,
			cellWidth = 100,
			cellHeight = 80,
			labelFontSize = 22,
			margin = {"top": 40, "left": 40, "bottom": 40, "right": 40};

		const { locationTotals, reduced, rowTotals, colTotals } = this.props.data;

		const labels = select(node)
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
			.attr("transform", () => "translate(" + margin.left / 2 + " " + ((5 * cellHeight / 2) + margin.top) + ")rotate(-90)")
			.attr("font-size", labelFontSize)
			.attr("text-anchor", "middle")
			.attr("alignment-baseline", "central")
			.text("Values");

		labels.append("text")
			.attr("class", "colTitle")
			.attr("fill", "#fff")
			.attr("transform", () => "translate(" + (margin.left + (7 * cellWidth) + 10 + (margin.right / 2)) + " " + ((5 * cellHeight / 2) + margin.top) + ")rotate(-90)")
			.attr("font-size", labelFontSize)
			.attr("text-anchor", "middle")
			.attr("alignment-baseline", "central")
			.text("Totals");

		const rects = select(node)
			.selectAll("g.col")
			.data(locationTotals)
			.enter().append("g")
			.attr("class", "col")
			.attr("transform", (d, i) => "translate(" + (i * cellWidth + margin.left) + " " + margin.top + ")");

		colors.domain([1, max(reduced) * factor]);

		const cells = rects.selectAll("g")
			.data(locationTotals);

		cells.data(d => d)
			.enter().append("rect")
			.attr("x", 0)
			.attr("y", (d, i) => i * cellHeight)
			.attr("height", cellHeight)
			.attr("width", cellWidth)
			.attr("class", "heatCell")
			.attr("z-index", 2)
			.attr("fill", "#fff");

		colors.domain([1, max(rowTotals) * factor]);

		const heatRows = select(node)
			.append("g")
			.attr("class", "rowTotals")
			.attr("transform", () => "translate(" + (6 * cellWidth + 10 + margin.left) + " " + margin.top + ")");

		heatRows.selectAll("rect")
			.data(rowTotals)
			.enter().append("rect")
			.attr("x", 0)
			.attr("y", (d, i) => i * cellHeight)
			.attr("height", cellHeight)
			.attr("width", cellWidth)
			.attr("class", "heatRow")
			.attr("fill", "#fff");

		colors.domain([1, max(colTotals) * factor])

		const heatCols = select(node)
			.append("g")
			.attr("class", "colTotals")
			.attr("transform", () => "translate(" + margin.left + " " + (5 * cellHeight + 10 + margin.top) + ")");

		heatCols.selectAll("rect")
			.data(colTotals)
			.enter().append("rect")
			.attr("x", (d, i) => i * cellWidth)
			.attr("y", 0)
			.attr("height", cellHeight)
			.attr("width", cellWidth)
			.attr("class", "heatCol")
			.attr("fill", "#fff");

		const g = cells.enter().append("g")
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

		g.data(d => d)
			.append("rect")
			.attr("fill", "#000")
			.attr("fill-opacity", 0.4)
			.attr("x", 0)
			.attr("y", (d, i) => i * cellHeight)
			.attr("height", cellHeight)
			.attr("width", cellWidth)
			.attr("class", "tipCell");

		g.data(d => d)
			.append("text")
			.attr("x", (cellWidth / 2))
			.attr("y", (d, i) => i * cellHeight + (cellHeight / 2))
			.attr("font-family", "sans-serif")
			.attr("font-size", "24")
			.attr("fill", "#fff")
			.attr("text-anchor", "middle")
			.attr("alignment-baseline", "central")
			.attr("class", "tip")
			.text("");

		const gRow = heatRows.selectAll("g.rowTip")
			.data(rowTotals)
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
			.attr("y", (d, i) => i * cellHeight)
			.attr("height", cellHeight)
			.attr("width", cellWidth)
			.attr("class", "rowTipCell");

		gRow.append("text")
			.attr("x", (cellWidth / 2))
			.attr("y", (d, i) => i * cellHeight + (cellHeight / 2))
			.attr("font-family", "sans-serif")
			.attr("font-size", 24)
			.attr("fill", "#fff")
			.attr("text-anchor", "middle")
			.attr("alignment-baseline", "central")
			.attr("class", "rowTipText")
			.text("");

		const gCol = heatCols.selectAll("g.colTip")
			.data(colTotals)
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
			.attr("x", (d, i) => i * cellWidth)
			.attr("y", 0)
			.attr("height", cellHeight)
			.attr("width", cellWidth)
			.attr("class", "colTipCell");

		gCol.append("text")
			.attr("x", (d, i) => i * cellWidth + (cellWidth / 2))
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
		const node = this.node,
			colors = this.colors,
			factor = 10;

		const { locationTotals, reduced, rowTotals, colTotals } = this.props.data;

		colors.domain([1, max(reduced) * factor]);

		const g= select(node)
			.selectAll("g.col")
			.data(locationTotals);

		g.selectAll("rect.heatCell")
			.data(d => d)
			.transition().duration(1000)
			.attr("fill", d => colors(d * factor));

		g.selectAll("text.tip")
			.data(d => d)
			.transition().duration(1000)
			.text(d => d);

		colors.domain([1, max(rowTotals) * factor]);

		const gRow = select(node)
			.select("g.rowTotals");

		gRow.selectAll("rect.heatRow")
			.data(rowTotals)
			.transition().duration(1000)
			.attr("fill", d => colors(d * factor));

		gRow.selectAll("text.rowTipText")
			.data(rowTotals)
			.transition().duration(1000)
			.text(d => d);

		colors.domain([1, max(colTotals) * factor]);

		const gCol = select(node)
			.select("g.colTotals");

		gCol.selectAll("rect.heatCol")
			.data(colTotals)
			.transition().duration(1000)
			.attr("fill", d => colors(d * factor));

		gCol.selectAll("text.colTipText")
			.data(colTotals)
			.transition().duration(1000)
			.text(d => d);
	}

	render() {
		return <svg ref={node => this.node = node} width={790} height={570} viewBox="0 0 790 570" preserveAspectRatio="xMidYMin meet" />;
	}
}

export default DailyDoubleHeatMap;