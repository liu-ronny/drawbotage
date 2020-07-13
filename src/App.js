import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import Loader from "./components/home/loader";
import Lobby from "./components/lobby/lobby";
import ErrorPage from "./components/errorPage";
import ProtectedRoute from "./components/protectedRoute";
import Game from "./components/game/game";

class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path="/" exact component={Loader} />
          <Route path="/error" exact component={ErrorPage} />
          <ProtectedRoute path="/:id" component={Lobby} />
        </Switch>
      </Router>
      // <Game />
    );
  }
}

export default App;
