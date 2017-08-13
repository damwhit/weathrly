import React, { Component } from 'react';
import $ from "jquery";
import createHistory from 'history/createBrowserHistory'
const history = createHistory();

class SearchResults extends Component {
  constructor(props) {
    super(props);
    this.state = {hasResult: false};
  }

  componentDidMount() {
    const locationQuery = history.location.search.split("=")[1];
    $.getJSON( `http://api.wunderground.com/api/2bac2cfbc182e18d/geolookup/q/${locationQuery}.json` )
    .then((json) => {
      if (json.response.error) {
        return this.setState({hasResult: false});
      } else {
        this.setState({hasResult: true});
        const firstResult = json.response.results[0];
        this.setState({currentCity: firstResult.city});
        const firstResultShortCode = firstResult.l;
        $.getJSON( `http://api.wunderground.com/api/2bac2cfbc182e18d/conditions${firstResultShortCode}.json` )
        .then((json) => {
          this.setState({
            currentTemp: `${json.current_observation.temp_f} °F`
          });
        })
        .catch((error) => {
        });
        $.getJSON( `http://api.wunderground.com/api/2bac2cfbc182e18d/forecast${firstResultShortCode}.json` )
        .then((json) => {
          const simpleForecast = json.forecast.simpleforecast.forecastday[0];
          const txtForecast = json.forecast.txt_forecast.forecastday[0];
          const formattedDay = `${simpleForecast.weekday}, ${simpleForecast.monthname}, ${simpleForecast.day}`
          this.setState({
            currentCondition: simpleForecast.conditions,
            currentDay: formattedDay,
            currentHigh: `${simpleForecast.high.fahrenheit} °F`,
            currentLow: `${simpleForecast.low.fahrenheit} °F`,
            currentSummary: txtForecast.fcttext,
          });
        })
        .catch((error) => {
        });
      }
    })
    .catch((error) => {
    });
  }

  render() {
    const hasResult = this.state.hasResult;
    if (!hasResult) {
      return <h1>No Results Found</h1>;
    }
    return (
      <ul>
        <li>City: {this.state.currentCity}</li>
        <li>Temp: {this.state.currentTemp}</li>
        <li>Conditions: {this.state.currentCondition}</li>
        <li>Day: {this.state.currentDay}</li>
        <li>High: {this.state.currentHigh}</li>
        <li>Low: {this.state.currentLow}</li>
        <li>Summary: {this.state.currentSummary}</li>
      </ul>
    );
  }
}

export default SearchResults;
