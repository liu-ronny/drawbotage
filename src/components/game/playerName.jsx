import React, { Component } from "react";
import "./playerName.css";
import DynamicText from "./chat/dynamicText";

class PlayerName extends Component {
  render() {
    const activePlayerClassName = this.props.isActive
      ? this.props.activePlayerClassName
      : "";

    return (
      <DynamicText
        className={
          "game-player-name d-flex align-items-center pl-2 " +
          activePlayerClassName
        }
      >
        {this.props.name}
      </DynamicText>
    );
  }
}

export default PlayerName;
