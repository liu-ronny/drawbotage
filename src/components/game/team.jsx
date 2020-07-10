import React, { Component } from "react";
import TeamHeader from "./teamHeader";
import PlayerName from "./playerName";

class Team extends Component {
  render() {
    return (
      <div>
        <TeamHeader
          teamName={this.props.teamName}
          color={this.props.color}
          iconClassName={this.props.iconClassName}
        />
        {this.props.playerNames.map((playerName) => (
          <PlayerName
            key={playerName}
            name={playerName}
            isActive={playerName === this.props.activePlayerName}
            activePlayerClassName={this.props.activePlayerClassName}
            className="mb-2"
          />
        ))}
      </div>
    );
  }
}

export default Team;
