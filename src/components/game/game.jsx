import React, { Component } from "react";
import connection from "../connection";

class Game extends Component {
  state = {};
  render() {
    return (
      <div>
        Hello{console.log(connection)}
        {console.log(this.props.location)}
      </div>
    );
  }
}

export default Game;
