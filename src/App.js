import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import Home from "./components/home/home";
import ErrorPage from "./components/errorPage";
import ProtectedRoute from "./components/protectedRoute";
import Reload from "./components/general/reload/reload";
import Game from "./components/game/game";

class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path="/" exact>
            <Home />
          </Route>
          <Route path="/error" exact component={ErrorPage} />
          <ProtectedRoute path="/:id" />
        </Switch>
      </Router>
      // <Game />
    );
  }
}

export default App;
