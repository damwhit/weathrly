import React, { Component } from 'react';
import SearchForm from './SearchForm.js'
import SearchResults from './SearchResults.js'

class Search extends Component {
  render() {
    return (
      <article className="search">
        <section className="search-form">
          <SearchForm/>
        </section>
        <section className="search-results">
          <SearchResults/>
        </section>
      </article>
    );
  }
}

export default Search;
