import React, { Component } from 'react';
import lightning from './lightning.gif';
import Search from './Search.js'
import './App.css';

class App extends Component {
  render() {
    return (
      <article className="app">
        <header className="app-header">
          <img src={lightning} className="app-logo" alt="logo" />
          <h2>Welcome to Weathrly</h2>
        </header>
        <Search/>
      </article>
    );
  }
}
export default App;
