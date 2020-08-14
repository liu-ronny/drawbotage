import React, { Component } from "react";
import "./teams.css";
import Team from "./team";

class Teams extends Component {
  render() {
    return (
      <>
        <div className="row h-50">
          <Team
            className="game-team-1"
            teamName="Team 1"
            iconClassName="fas fa-pencil-ruler"
            score={this.props.blueScore}
            playerNames={this.props.bluePlayerNames}
            currentPlayerName={this.props.currentPlayerName}
            currentPlayerClassName="alert-primary"
          />
        </div>
        <div className="row h-50">
          <Team
            className="game-team-2"
            teamName="Team 2"
            iconClassName="fas fa-drafting-compass"
            score={this.props.redScore}
            playerNames={this.props.redPlayerNames}
            currentPlayerName={this.props.currentPlayerName}
            currentPlayerClassName="alert-light-primary"
          />
        </div>
      </>
    );
  }
}

export default Teams;
