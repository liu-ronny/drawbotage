import React, { Component } from "react";
import { Route, Redirect } from "react-router-dom";
import Game from "./game/game";

class ProtectedRoute extends Component {
  isUUID(str) {
    const pattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return pattern.test(str);
  }

  render() {
    const { component: Component, ...props } = this.props;
    const { pathname = "", state } = props.location;
    const roomID = pathname.substring(1);
    const isValidRoomID = this.isUUID(roomID);

    if (!isValidRoomID) {
      return (
        <Route {...props}>
          <Redirect to="/" />
        </Route>
      );
    }

    if (state) {
      if (state.fromLobby) {
        return <Route {...props} render={(state) => <Game {...state} />} />;
      }

      return <Route {...props} render={(props) => <Component {...props} />} />;
    }

    return (
      <Route {...props}>
        <Redirect
          to={{
            pathname: "/",
            state: { roomID },
          }}
        />
      </Route>
    );
  }
}

export default ProtectedRoute;
