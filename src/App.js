import React, { Component } from "react";
import { Switch, BrowserRouter as Router, Route } from "react-router-dom";
import RetailerList from "./components/HomePage";

export default class App extends Component {
  render() {
    return (
      <div>
        <Router>
          <Switch>
            <Route path="/" exact component={RetailerList} />
          </Switch>
        </Router>
      </div>
    );
  }
}
