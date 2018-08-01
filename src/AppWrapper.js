import React, { Component } from 'react'
import { Button, ButtonGroup } from 'reactstrap'
import SeasonSlider from './SeasonSlider'
import DailyDoubleHeatMap from './DailyDoubleHeatMap'
import RoundStats from './RoundStats'
import DailyDoubleOrder from './DailyDoubleOrder'
import seasonsdata from './jeopardy-seasons-data'
import seasonsdataall from './jeopardy-seasons-data-all'

class AppWrapper extends Component {
	constructor(props) {
		super(props);
        this.state = { all: false, heatmapRound: 2, season: 1};
        this.handleSeasonChange = this.handleSeasonChange.bind(this);
        this.changeHeatmapRound = this.changeHeatmapRound.bind(this);
    }

    componentDidMount() {
        this.setState({ all: false, heatmapRound: 2, season: 1});
    }

    changeHeatmapRound(round) {
        this.setState({
            heatmapRound: round
        });
    }

    handleSeasonChange(all, season) {
        this.setState({
            all: all,
            season: season
        });
    }

	render() {
        const data = this.state.all ? seasonsdataall : seasonsdata.seasons[this.state.season - 1];
        return (
            <div className="app-wrapper">
                <h1 className="App-title">Jeopardy Visualizations</h1>
                <SeasonSlider startSeason={1} handlerFromParent={this.handleSeasonChange} />
                <ButtonGroup>
                    <Button color="secondary" onClick={() => this.changeHeatmapRound(0)} active={this.state.heatmapRound === 0} >Jeopardy</Button>
                    <Button color="secondary" onClick={() => this.changeHeatmapRound(1)} active={this.state.heatmapRound === 1} >Double Jeopardy</Button>
                    <Button color="secondary" onClick={() => this.changeHeatmapRound(2)} active={this.state.heatmapRound === 2} >All</Button>
                </ButtonGroup>
                <DailyDoubleHeatMap data={data} round={this.state.heatmapRound} />
                <RoundStats title={"Daily Double Wagers"} type={"dd"} data={data} />
                <RoundStats title={"Final Jeopardy Wagers"} type={"fj"} data={data} />
                <h2 className="subtitle indent">Daily Double Pick Order</h2>
                <DailyDoubleOrder title={"Jeopardy Round"} data={data} round={"j"}/>
                <DailyDoubleOrder title={"Double Jeopardy Round"} data={data} round={"dj"}/>
            </div>
        );
	}
}

export default AppWrapper;