import React, { Component } from "react";
import Dragula from "react-dragula";
import TeamBox from "./teamBox";
import "./teams.css";

class Teams extends Component {
  constructor(props) {
    super(props);

    const dragula = Dragula();
    dragula.on("drop", (el, target, source, sibling) => {
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
      dragula.cancel(true);
      this.props.updateTeams(team, index, name, el);
    });

    this.state = {
      dragula,
    };
  }

  render() {
    return (
      <div className="whiteboard p-4 pl-5">
        <div className="row text-primary teams-header font-weight-bold">
          Teams
        </div>
        <div className="row team-boxes mt-5">
          <TeamBox
            teamName="Team 1"
            colorClass="team1"
            dragula={this.state.dragula}
            host={this.props.host}
            isHost={this.props.isHost}
            playerNames={this.props.bluePlayerNames}
            updateTeams={this.props.updateTeams}
          />
          <TeamBox
            teamName="Team 2"
            colorClass="team2"
            dragula={this.state.dragula}
            host={this.props.host}
            isHost={this.props.isHost}
            playerNames={this.props.redPlayerNames}
            updateTeams={this.props.updateTeams}
          />
          <TeamBox
            teamName="Unassigned"
            colorClass="unassigned"
            dragula={this.state.dragula}
            host={this.props.host}
            isHost={this.props.isHost}
            playerNames={this.props.unassignedPlayerNames}
            updateTeams={this.props.updateTeams}
          />
        </div>
        <div className="marker" id="marker1"></div>
        <div className="marker" id="marker2"></div>
        <div className="eraser" id="eraser2"></div>
        <div className="eraser" id="eraser1"></div>
        {/* {console.log(this.props)} */}
      </div>
    );
  }
}

export default Teams;
