import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import Loader from "./components/home/loader";
import Lobby from "./components/lobby/lobby";
import ProtectedRoute from "./components/protectedRoute";

class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path="/" exact component={Loader}></Route>
          <ProtectedRoute path="/:id" component={Lobby} />
        </Switch>
      </Router>
    );
  }
}

export default App;
