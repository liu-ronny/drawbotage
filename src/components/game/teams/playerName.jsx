import React, { Component } from "react";
import "./playerName.css";
import classNames from "classnames";

class PlayerName extends Component {
  render() {
    const className = classNames("game-player-name", "pt-2", {
      [this.props.currentPlayerClassName]: this.props.isCurrentPlayer,
    });

    return <div className={className}>{this.props.name}</div>;
  }
}

export default PlayerName;
