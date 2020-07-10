import React, { Component } from "react";
import "./teams.css";
import Team from "./team";

class Teams extends Component {
  render() {
    return (
      <>
        <div className="d-flex flex-column game-teams-container p-3">
          <Team
            teamName="Team1"
            // color="#44a1f2"
            color="#5499C7"
            iconClassName="fas fa-pencil-ruler"
            playerNames={this.props.redPlayerNames}
            activePlayerName={this.props.activePlayerName}
            activePlayerClassName="alert-primary"
          />
          <br />
          <Team
            teamName="Team2"
            // color="#3acf9a"
            color="#52BE80"
            iconClassName="fas fa-drafting-compass"
            playerNames={this.props.bluePlayerNames}
            activePlayerName={this.props.activePlayerName}
            activePlayerClassName="alert-light-primary"
          />
        </div>
      </>
    );
  }
}

export default Teams;
