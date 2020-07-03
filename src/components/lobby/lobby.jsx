import React, { Component } from "react";
import Header from "../home/header";
import Settings from "./settings";
import Teams from "./teams";
import connection from "../connection";
import "./lobby.css";

class Lobby extends Component {
  constructor(props) {
    super(props);

    this.state = {
      host: this.props.location.state.create
        ? this.props.location.state.name
        : null,
      bluePlayerNames: [],
      redPlayerNames: [],
      unassignedPlayerNames: [],
      roomID: this.props.location.state.roomID,
      name: this.props.location.state.name,
      rounds: 3,
      drawTime: 60,
    };

    connection.attach(this);
  }

  componentDidMount() {
    const body = {
      backgroundColor: "aliceblue",
    };

    for (let i in body) {
      document.body.style[i] = body[i];
    }
  }

  handleChange = (event, setting) => {
    const settings = { [setting]: Number(event.target.value) };
    this.setState(settings);
    connection.updateSettings({
      settings,
      roomID: this.state.roomID,
    });
  };

  handleLeave = () => {
    connection.leave({
      roomID: this.state.roomID,
      isHost: this.state.host === this.state.name,
    });
  };

  updateTeams = (team, index, name, elToDisplay) => {
    const state = this.removePlayer(name);
    state[team + "PlayerNames"].splice(index, 0, name);

    if (elToDisplay) {
      this.setState(state, () => {
        elToDisplay.setAttribute("style", "display: block;");
      });
    }

    connection.updateTeams({
      playerNames: {
        blue: state.bluePlayerNames,
        red: state.redPlayerNames,
        unassigned: state.unassignedPlayerNames,
      },
      roomID: this.state.roomID,
      name: name,
      team: team,
    });
  };

  removePlayerAndUpdate = (name) => {
    const state = this.removePlayer(name);
    connection.removePlayer({
      roomID: state.roomID,
      playerNames: {
        blue: state.bluePlayerNames,
        red: state.redPlayerNames,
        unassigned: state.unassignedPlayerNames,
      },
    });
  };

  removePlayer = (name) => {
    const state = { ...this.state };
    state.bluePlayerNames = [...this.state.bluePlayerNames].filter(
      (playerName) => playerName !== name
    );
    state.redPlayerNames = [...this.state.redPlayerNames].filter(
      (playerName) => playerName !== name
    );
    state.unassignedPlayerNames = [...this.state.unassignedPlayerNames].filter(
      (playerName) => playerName !== name
    );

    return state;
  };

  render() {
    return (
      <div>
        <div className="container-fluid" id="lobby-container">
          <Header />
          <div className="row" id="lobby">
            <div className="d-flex flex-column col-3 p-4" id="config">
              <Settings
                isHost={this.state.host === this.state.name}
                teamInfo={this.state}
                roomID={this.props.location.state.roomID}
                onLeave={this.handleLeave}
                onChange={this.handleChange}
                selected={true}
              />
            </div>
            <div className="col-9" id="teams">
              <Teams
                host={this.state.host}
                isHost={this.state.host === this.state.name}
                redPlayerNames={this.state.redPlayerNames}
                bluePlayerNames={this.state.bluePlayerNames}
                unassignedPlayerNames={this.state.unassignedPlayerNames}
                updateTeams={this.updateTeams}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Lobby;
