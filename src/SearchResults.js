import React, { Component } from 'react';
import $ from "jquery";

class SearchResults extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showInitialMessage: true,
      hasResults: false
    };
  }

  componentDidMount() {
    const searchTerm = this.findSearchTerm(this.props.history.location);
    if (searchTerm) this.sendLocationSearch(searchTerm);
    this.listenForSearchQuery();
  }

  findSearchTerm(location) {
    const searchArray = location.search.split("=");
    return searchArray[searchArray.length - 1];
  }

  listenForSearchQuery() {
    this.props.history.listen((location, action) => {
      const searchTerm = this.findSearchTerm(location);
      if (searchTerm) this.sendLocationSearch(searchTerm);
    });
  }

  sendLocationSearch = async (searchTerm) => {
    try {
      if (this.state.showInitialMessage) this.setState({showInitialMessage: false});
      this.setState({isLoading: true});
      const json = await $.getJSON(`http://api.wunderground.com/api/2bac2cfbc182e18d/geolookup/q/${searchTerm}.json`)
      if (json.response.error) {
        this.setNoResults();
      } else {
        this.setState({hasResults: true});
        const result = (json.location) ? json.location : json.response.results[0];
        const resultShortCode = result.l;
        this.getConditionsAndForecast(result, resultShortCode);
      }
    } catch (e) {
      this.setNoResults();
      console.log(e);
    }
  }

  setNoResults() {
    this.setState({
      isLoading: false,
      hasResults: false}
    );
  }

  getConditionsAndForecast = async (locationQueryResult, shortCode) => {
    const weatherResponses = await Promise.all([
      $.getJSON(`http://api.wunderground.com/api/2bac2cfbc182e18d/conditions${shortCode}.json`),
      $.getJSON(`http://api.wunderground.com/api/2bac2cfbc182e18d/forecast${shortCode}.json`)
    ]);
    const conditionsResponse = weatherResponses[0];
    const forecastResponse = weatherResponses[1];
    this.setSearchResultsToBeDisplayed(locationQueryResult, conditionsResponse, forecastResponse);
    this.setState({isLoading: false});
  }

  setSearchResultsToBeDisplayed(locationQueryResult, conditionsResponse, forecastResponse) {
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
  }

  render() {
    if (this.state.isLoading) return <div className="loader">Loading...</div>;
    if (this.state.showInitialMessage) return <h1>Find Weather Near You</h1>;
    if (!this.state.hasResults) return <h1>No Results Found</h1>;
    return (
      <div>
        <h4>City: {this.state.currentCity}</h4>
        <h4>Temp: {this.state.currentTemp}</h4>
        <h4>Conditions: {this.state.currentCondition}</h4>
        <h4>Day: {this.state.currentDay}</h4>
        <h4>High: {this.state.currentHigh}</h4>
        <h4>Low: {this.state.currentLow}</h4>
        <h4>Summary: {this.state.currentSummary}</h4>
      </div>
    );
  }
}

export default SearchResults;
