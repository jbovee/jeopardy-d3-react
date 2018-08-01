import React, { Component } from 'react'
import SeasonSlider from './SeasonSlider'
import DailyDoubleHeatMap from './DailyDoubleHeatMap'
import RoundStats from './RoundStats'
import DailyDoubleOrder from './DailyDoubleOrder'
import seasonsdata from './jeopardy-seasons-data'
import seasonsdataall from './jeopardy-seasons-data-all'

class AppWrapper extends Component {
	constructor(props) {
		super(props);
        this.state = { all: false, season: 1};
        this.handleSeasonChange = this.handleSeasonChange.bind(this);
    }

    componentDidMount() {
        this.setState({ all: false, season: 1});
    }

    handleSeasonChange(all, season) {
        this.setState({
            all: all,
            season: season
        });
    }

	render() {
        const data = this.state.all ? seasonsdataall : seasonsdata.seasons[this.state.season - 1];
        return [
            <h1 className="App-title">Jeopardy Visualizations</h1>,
            <SeasonSlider startSeason={1} handlerFromParent={this.handleSeasonChange} />,
            <DailyDoubleHeatMap data={data} />,
            <RoundStats title={"Daily Double Wagers"} type={"dd"} data={data} />,
            <RoundStats title={"Final Jeopardy Wagers"} type={"fj"} data={data} />,
            <h2 className="subtitle indent">Daily Double Pick Order</h2>,
            <DailyDoubleOrder title={"Jeopardy Round"} data={data} round={"j"}/>,
            <DailyDoubleOrder title={"Double Jeopardy Round"} data={data} round={"dj"}/>
        ];
	}
}

export default AppWrapper;