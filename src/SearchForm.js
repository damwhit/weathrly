import React, { Component } from 'react';

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

    const location = {
      pathname: '/search',
      search: `?location=${this.state.value}`
    }

    this.props.history.push(location);
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
