import React, { Component } from 'react';
import $ from "jquery";

class SearchResults extends Component {
  constructor(props) {
    super(props);
    this.state = {hasResults: false};
  }

  componentDidMount() {
    const searchArray = this.props.history.location.search.split("=");
    const searchTerm = searchArray[searchArray.length - 1];
    this.sendLocationSearch(searchTerm);
    this.listenForSearchQuery();
  }

  listenForSearchQuery() {
    this.props.history.listen((location, action) => {
      const searchArray = location.search.split("=");
      const searchTerm = searchArray[searchArray.length - 1];
      this.sendLocationSearch(searchTerm);
    });
  }

  sendLocationSearch = async (searchTerm) => {
    this.setState({isLoading: true});
    try {
      const json = await $.getJSON(`http://api.wunderground.com/api/2bac2cfbc182e18d/geolookup/q/${searchTerm}.json`)
      if (json.response.error) {
        return this.setState({hasResults: false});
      } else {
        this.setState({hasResults: true});
        const result = (json.location) ? json.location : json.response.results[0];
        const resultShortCode = result.l;
        this.getConditionsAndForecast(result, resultShortCode);
      }
    } catch (e) {
      this.setState({hasResults: false});
      console.log(e);
    }
  }

  getConditionsAndForecast = async (locationQueryResult, shortCode) => {
    try {
      const conditionsResponse = await $.getJSON(`http://api.wunderground.com/api/2bac2cfbc182e18d/conditions${shortCode}.json`);
      const forecastResponse = await $.getJSON(`http://api.wunderground.com/api/2bac2cfbc182e18d/forecast${shortCode}.json`);
      const simpleForecast = forecastResponse.forecast.simpleforecast.forecastday[0];
      const txtForecast = forecastResponse.forecast.txt_forecast.forecastday[0];
      const formattedDay = `${simpleForecast.date.weekday}, ${simpleForecast.date.monthname}, ${simpleForecast.date.day}`
      this.setState({
        currentCity: locationQueryResult.city,
        currentTemp: `${conditionsResponse.current_observation.temp_f} °F`,
        currentCondition: simpleForecast.conditions,
        currentDay: formattedDay,
        currentHigh: `${simpleForecast.high.fahrenheit} °F`,
        currentLow: `${simpleForecast.low.fahrenheit} °F`,
        currentSummary: txtForecast.fcttext,
      });
      this.setState({isLoading: false});
    } catch (e) {
      console.log(e);
    }
  }

  render() {
    if (this.state.isLoading) return <div className="loader">Loading...</div>;
    if (!this.state.hasResults) return <h1>No Results Found</h1>;
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
