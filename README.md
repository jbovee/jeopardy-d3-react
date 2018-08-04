This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

You can find the most recent version of the guide [here](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md).

# Jeopardy D3 React
Wrapping D3.js with ReactJS to visualize Jeopardy question info obtained by running [j-archive parsing script](https://github.com/jbovee/j-archive-parser)

**INTERACTIVE DEMO HERE [jbovee.github.io/jeoparyd-d3-react](https://jbovee.github.io/jeopardy-d3-react/)**

## About

jeopardy-d3-react utilizes the [d3js](https://d3js.org/) and [reactjs](https://reactjs.org/) JavaScript libraries to generate interactive statistics and visualizations of question information from Jeopardy games.
Examples include:
- Maximum/minimum/average Daily Double bets by season
- Maximum/minimum/average Final Jeopardy bets by season
- Heatmap of Daily Double pick locations by season, including total by column and row

## Future Plans
- ~~Add a button/switcher to change heatmap between Jeopardy Round, Double Jeopardy Round, and both~~
- Add a button to change hover values above heatmap cells between raw count and percentages

Jeopardy question information was obtained using [j-archive parsing script](https://github.com/jbovee/j-archive-parser), and is stored by season in the j-archive-csv directory.
