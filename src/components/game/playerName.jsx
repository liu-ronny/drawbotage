import React, { Component } from "react";
import "./playerName.css";

class PlayerName extends Component {
  render() {
    const activePlayerClassName = this.props.isActive
      ? this.props.activePlayerClassName
      : "";

    return (
      <div
        className={
          "game-player-name pl-2 " +
          this.props.className +
          " " +
          activePlayerClassName
        }
      >
        {this.props.name}
      </div>
    );
  }
}

export default PlayerName;
