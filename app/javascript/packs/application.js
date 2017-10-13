import React from 'react';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom'
import { render } from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import Homepage from '../components/Homepage';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('main');
  render(
    <MuiThemeProvider >
     <Router>
        <div>
          <Header />
          <Route exact path="/" component={ Homepage }/>
          <Route path="/search" component={ SearchBar } />
        </div>
      </Router>
    </MuiThemeProvider>, container);
});
