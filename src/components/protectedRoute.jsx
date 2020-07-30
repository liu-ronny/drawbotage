import React from "react";
import { Route, Redirect, useLocation } from "react-router-dom";
import Lobby from "./lobby/lobby";
// import Game from "../components/game/game";
import checkUuid from "../utils/checkUuid";
import Home from "./home/home";
import Reload from "./general/reload/reload";

function ProtectedRoute(props) {
  const location = useLocation();
  const state = location.state;
  const roomId = location.pathname.substring(1);
  const isValidRoomId = checkUuid(roomId);

  if (!state) {
    return isValidRoomId ? (
      <Route>
        <Home roomId={roomId} />
      </Route>
    ) : (
      <Redirect to="/" />
    );
  }

  const { joinRoom, createRoom } = state;

  if (joinRoom || createRoom) {
    return (
      <Route path="/:id">
        <Reload>
          <Lobby {...state} />
        </Reload>
      </Route>
    );
  }

  // if (startGame) {
  //   return (
  //     <Route path="/:id">
  //       <Game state={state} />
  //     </Route>
  //   );
  // }

  return <Redirect to="/" />;
}

export default ProtectedRoute;
