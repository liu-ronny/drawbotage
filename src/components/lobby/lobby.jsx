import React, { useState, useEffect, useReducer } from "react";
import { Redirect } from "react-router-dom";
import Header from "../general/header/header";
import Settings from "./settings/settings";
import Teams from "./teams/teams";
import Game from "../game/game";
import gameStateReducer from "./gameStateReducer";
import connection from "../../api/connection";

import "./lobby.css";

const initialGameState = {
  host: "",
  playerName: "",
  currentPlayerName: "",
  bluePlayerNames: [],
  redPlayerNames: [],
  blueScore: 0,
  redScore: 0,
  unassignedPlayerNames: [],
  messages: [],
  messageCount: 0,
  start: false,
  rounds: 3,
  drawTime: 60,
};
const roundOptions = [3, 5, 7];
const drawTimeOptions = [60, 80, 100];

function Lobby(props) {
  const { playerName, roomId, joinRoom, createRoom } = props;
  initialGameState.host = createRoom ? playerName : "";
  initialGameState.playerName = playerName;
  const [game, dispatch] = useReducer(gameStateReducer, initialGameState);
  const [playerCountError, setPlayerCountError] = useState(false);
  const [unassignedPlayerError, setUnassignedPlayerError] = useState(false);

  const handleChange = (event, settingName) => {
    connection.emit("updateSettings", {
      roomId,
      settingName,
      settingValue: Number(event.target.value),
    });
  };
  const handleStart = () => {
    if (game.bluePlayerNames.length < 2 || game.redPlayerNames.length < 2) {
      setPlayerCountError(true);
      setUnassignedPlayerError(false);
      return;
    }

    if (game.unassignedPlayerNames.length > 0) {
      setUnassignedPlayerError(true);
      setPlayerCountError(false);
      return;
    }

    connection.emit("startGame", { roomId });
  };

  const handleLeave = () =>
    connection.emit("leaveGame", { roomId, playerName });

  const handlePlayerCountErrorClose = () => setPlayerCountError(false);
  const handleUnassignedPlayerErrorClose = () =>
    setUnassignedPlayerError(false);

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
      drawTime: game.drawTime,
      rounds: game.rounds,
    });
    return () => connection.close();
  }, []);

  if (game.start) {
    return <Game game={game} dispatch={dispatch} />;
  }

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
              roundOptions={roundOptions}
              drawTimeOptions={drawTimeOptions}
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
              playerCountError={playerCountError}
              unassignedPlayerError={unassignedPlayerError}
              onPlayerCountErrorClose={handlePlayerCountErrorClose}
              onUnassignedPlayerErrorClose={handleUnassignedPlayerErrorClose}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Lobby;
