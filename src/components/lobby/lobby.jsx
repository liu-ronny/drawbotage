import React, { useState, useEffect, useLayoutEffect, useReducer } from "react";
import { Redirect, useHistory } from "react-router-dom";
import Header from "../general/header/header";
import Settings from "./settings/settings";
import Teams from "./teams/teams";
// import Game from "../game/game";
import gameStateReducer from "./gameStateReducer";
import connection from "../../api/testConnection";
// import redirectOnUnload from "../../utils/hooks/useRedirectOnUnload";
import "./lobby.css";

const initialGameState = {
  host: "",
  bluePlayerNames: [],
  redPlayerNames: [],
  unassignedPlayerNames: [],
  startGame: false,
  rounds: 3,
  drawTime: 60,
  displayPlayerTags: true,
};

function Lobby(props) {
  const { playerName, roomId, joinRoom, createRoom } = props;
  initialGameState.host = createRoom ? playerName : "";
  const [game, dispatch] = useReducer(gameStateReducer, initialGameState);

  const handleChange = (event, settingName) => {
    connection.emit("updateSettings", {
      roomId,
      settingName,
      settingValue: Number(event.target.value),
    });
  };
  const handleStart = () => connection.emit("startGame", { roomId });
  const handleLeave = () =>
    connection.emit("leaveGame", { roomId, playerName });

  const updateTeams = (team, index, name) => {
    connection.emit("updateTeams", {
      roomId,
      playerName: name,
      newTeamName: team,
      insertPosition: index,
    });
  };

  useEffect(() => {
    connection.open();
    connection.subscribe(dispatch, {
      playerName,
      roomId,
      joinRoom,
    });
    return () => connection.close();
  }, []);

  if (game.disconnected) {
    return (
      <Redirect
        to={{
          pathname: "/error",
          state: {
            fromLobby: true,
            disconnectedMsg: game.disconnectedMsg,
          },
        }}
      />
    );
  }

  return (
    <div>
      <div className="container-fluid" id="lobby-container">
        <Header />
        <div className="lobby row">
          <div className="d-flex flex-column col-3 p-4" id="config">
            <Settings
              isHost={game.host === playerName}
              rounds={game.rounds}
              drawTime={game.drawTime}
              roomId={roomId}
              dispatch={dispatch}
              onChange={handleChange}
              onStart={handleStart}
              onLeave={handleLeave}
            />
          </div>
          <div className="col-9" id="teams">
            <Teams
              host={game.host}
              isHost={game.host === playerName}
              redPlayerNames={game.redPlayerNames}
              bluePlayerNames={game.bluePlayerNames}
              unassignedPlayerNames={game.unassignedPlayerNames}
              updateTeams={updateTeams}
              displayPlayerTags={game.displayPlayerTags}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Lobby;
