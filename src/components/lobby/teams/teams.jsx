import React, { Component } from "react";
import Dragula from "react-dragula";
import TeamBox from "./teamBox";
import "./teams.css";

class Teams extends Component {
  componentDidMount() {
    this.dragula = Dragula();
    this.dragula.on("drop", (el, target, source, sibling) => {
      const team =
        target.id === "Team 1"
          ? "blue"
          : target.id === "Team 2"
          ? "red"
          : "unassigned";
      const name = el.innerText;
      const index = [].slice
        .call(el.parentNode.childNodes)
        .findIndex((item) => el === item);

      el.setAttribute("style", "display: none;");
      this.dragula.cancel(true);
      this.props.updateTeams(team, index, name);
    });
  }

  render() {
    return (
      <div className="whiteboard p-4 pl-5">
        <div className="d-flex text-primary teams-header font-weight-bold align-items-center">
          <div>Teams</div>
          {this.props.error ? (
            <div
              className="error-alert alert alert-primary text-center flex-grow-1 ml-3 mb-0"
              role="alert"
              onClick={this.props.onErrorClose}
            >
              <i class="fas fa-exclamation-circle mr-2"></i>
              There must be at least 2 players on each team before the game can
              start.
            </div>
          ) : null}
        </div>
        <div className="row team-boxes mt-5">
          <TeamBox
            teamName="Team 1"
            colorClass="team1"
            dragula={this.dragula}
            host={this.props.host}
            isHost={this.props.isHost}
            playerNames={this.props.bluePlayerNames}
            updateTeams={this.props.updateTeams}
            displayPlayerTags={this.props.displayPlayerTags}
          />
          <TeamBox
            teamName="Team 2"
            colorClass="team2"
            dragula={this.dragula}
            host={this.props.host}
            isHost={this.props.isHost}
            playerNames={this.props.redPlayerNames}
            updateTeams={this.props.updateTeams}
            displayPlayerTags={this.props.displayPlayerTags}
          />
          <TeamBox
            teamName="Unassigned"
            colorClass="unassigned"
            dragula={this.dragula}
            host={this.props.host}
            isHost={this.props.isHost}
            playerNames={this.props.unassignedPlayerNames}
            updateTeams={this.props.updateTeams}
            displayPlayerTags={this.props.displayPlayerTags}
          />
        </div>
        <div className="marker" id="marker1"></div>
        <div className="marker" id="marker2"></div>
        <div className="eraser" id="eraser2"></div>
        <div className="eraser" id="eraser1"></div>
      </div>
    );
  }
}

export default Teams;
