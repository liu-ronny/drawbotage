import React, { Component } from "react";
import SectionHeader from "../headers/sectionHeader";
import PlayerName from "./playerName";

class Team extends Component {
  render() {
    const className = this.props.className ? this.props.className : "";

    return (
      <div className={className + " col-12"}>
        <SectionHeader
          text={this.props.teamName}
          iconClassName={this.props.iconClassName}
          className={className ? className + "-header" : ""}
        />
        {this.props.playerNames.map((playerName) => (
          <PlayerName
            key={playerName}
            name={playerName}
            isCurrentPlayer={playerName === this.props.currentPlayerName}
            currentPlayerClassName={this.props.currentPlayerClassName}
          />
        ))}
      </div>
    );
  }
}

export default Team;
