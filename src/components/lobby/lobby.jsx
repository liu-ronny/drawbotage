import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import Header from "../home/header";
import Settings from "./settings";
import Teams from "./teams";
import Game from "../game/game";
import connection from "../api/connection";
import redirectOnReload from "../utils/redirectOnUnload";
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
      roomId: this.props.location.state.roomId,
      name: this.props.location.state.name,
      rounds: 3,
      drawTime: 60,
      disconnected: false,
      disconnectedMsg: "",
      startGame: false,
    };
  }

  componentDidMount() {
    const body = {
      backgroundColor: "aliceblue",
    };

    for (let i in body) {
      document.body.style[i] = body[i];
    }

    const redirect = redirectOnReload(window, this.props.history);
    if (redirect) {
      return;
    }

    connection.open();
    connection.subscribeFromLobby(this);
  }

  componentWillUnmount() {
    window.onbeforeunload = null;
    connection.close();
  }

  handleChange = (event, settingName) => {
    connection.updateSettings({
      roomId: this.state.roomId,
      settingName,
      settingValue: Number(event.target.value),
    });
  };

  handleStart = () => {
    connection.startGame({
      roomId: this.state.roomId,
    });
  };

  handleLeave = () => {
    connection.leaveGame({
      roomId: this.state.roomId,
      playerName: this.state.name,
    });
  };

  updateTeams = (team, index, name, elToDisplay) => {
    const state = this.removePlayer(name);

    if (elToDisplay) {
      this.setState(state, () => {
        elToDisplay.setAttribute("style", "display: block;");
      });
    }

    connection.updateTeams({
      roomId: this.state.roomId,
      playerName: name,
      newTeamName: team,
      insertPosition: index,
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
    if (this.state.disconnected) {
      return (
        <Redirect
          to={{
            pathname: "/error",
            state: {
              fromLobby: true,
              disconnectedMsg: this.state.disconnectedMsg,
            },
          }}
        />
      );
    }

    if (this.state.startGame) {
      return <Game gameInfo={this.state} />;

      // <Redirect
      //   to={{
      //     pathname: `/${this.state.roomId}`,
      //     state: {
      //       fromLobby: true,
      //     },
      //   }}
      // />
    }

    return (
      <div>
        <div className="container-fluid" id="lobby-container">
          <Header />
          <div className="row" id="lobby">
            <div className="d-flex flex-column col-3 p-4" id="config">
              <Settings
                isHost={this.state.host === this.state.name}
                teamInfo={this.state}
                roomId={this.props.location.state.roomId}
                onChange={this.handleChange}
                onStart={this.handleStart}
                onLeave={this.handleLeave}
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
