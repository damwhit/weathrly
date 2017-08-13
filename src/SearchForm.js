import React, { Component } from 'react';

class SearchForm extends Component {
  constructor(props) {
    super(props);
    this.state = {searchInput: ''};
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    event.preventDefault();
    this.setState({searchInput: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    const location = {
      pathname: '/search',
      search: `?location=${this.state.searchInput}`
    }
    this.props.history.push(location);
    this.setState({searchInput: ''});
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit} className="search-form">
        <label>Location:</label>
        <section className="flex">
          <input placeholder="Search" type="text" value={this.state.searchInput} onChange={this.handleChange} />
          <input type="submit" value="Submit" />
        </section>
      </form>
    );
  }
}

export default SearchForm;
