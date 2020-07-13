import React, { Component } from "react";
import "./teams.css";
import Team from "./team";

class Teams extends Component {
  render() {
    return (
      <>
        <div className="d-flex flex-column game-teams-container p-3 h-100">
          <Team
            className="game-team-1"
            teamName="Team1"
            iconClassName="fas fa-pencil-ruler"
            playerNames={this.props.redPlayerNames}
            activePlayerName={this.props.activePlayerName}
            activePlayerClassName="alert-primary"
          />
          <Team
            className="game-team-2"
            teamName="Team2"
            iconClassName="fas fa-drafting-compass"
            playerNames={this.props.bluePlayerNames}
            activePlayerName={this.props.activePlayerName}
            activePlayerClassName="alert-light-primary"
          />
          <Team
            className="game-spectators"
            teamName="Spectators"
            color="#52BE80"
            iconClassName="fas fa-drafting-compass"
            playerNames={this.props.unassignedPlayerNames}
          />
        </div>
      </>
    );
  }
}

export default Teams;
