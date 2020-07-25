import React, { Component } from "react";
import "./playerName.css";
import classNames from "classnames";
import DynamicText from "./chat/dynamicText";

class PlayerName extends Component {
  render() {
    const className = classNames(
      "game-player-name",
      "d-flex",
      "align-items-center",
      "pl-2",
      {
        [this.props.currentPlayerClassName]: this.props.isCurrentPlayer,
      }
    );

    return <DynamicText className={className}>{this.props.name}</DynamicText>;
  }
}

export default PlayerName;
