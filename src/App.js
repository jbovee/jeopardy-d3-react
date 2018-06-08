import React, { Component } from 'react';
import SeasonSlider from './SeasonSlider'
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <h1 className="App-title">Jeopardy Visualizations</h1>
	      <div>
	      <SeasonSlider />
	      </div>
      </div>
    );
  }
}

export default App;
