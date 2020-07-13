import React, { Component } from "react";
import SectionHeader from "./sectionHeader";
import PlayerName from "./playerName";

class Team extends Component {
  render() {
    const className = this.props.className ? this.props.className : "";

    return (
      <div className={className}>
        <SectionHeader
          text={this.props.teamName}
          iconClassName={this.props.iconClassName}
          className={className ? className + "-header" : ""}
        />
        {this.props.playerNames.map((playerName) => (
          <PlayerName
            key={playerName}
            name={playerName}
            isActive={playerName === this.props.activePlayerName}
            activePlayerClassName={this.props.activePlayerClassName}
          />
        ))}
      </div>
    );
  }
}

export default Team;
