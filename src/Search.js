import React, { Component } from 'react';
import SearchForm from './SearchForm.js'
import SearchResults from './SearchResults.js'
import createHistory from 'history/createBrowserHistory'
const history = createHistory();


class Search extends Component {
  render() {
    return (
      <article className="search">
        <section className="search-form">
          <SearchForm history={history}/>
        </section>
        <section className="search-results">
          <SearchResults history={history}/>
        </section>
      </article>
    );
  }
}

export default Search;
