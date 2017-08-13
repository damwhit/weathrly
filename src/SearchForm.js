import React, { Component } from 'react';
import createHistory from 'history/createBrowserHistory'
const history = createHistory();

class SearchForm extends Component {
  constructor(props) {
    super(props);
    this.state = {value: ''};
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    event.preventDefault();
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();

    history.listen((location, action) => {
      console.log(`The current URL is ${location.pathname}${location.search}${location.hash}`)
      console.log(`The last navigation action was ${action}`)
    })
    const location = {
      pathname: '/search',
      search: `?location=${this.state.value}`
    }

    history.push(location);
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit} className="search-form">
        <label>Location:</label>
        <section className="flex">
          <input type="text" value={this.state.value} onChange={this.handleChange} />
          <input type="submit" value="Submit" />
        </section>
      </form>
    );
  }
}

export default SearchForm;
