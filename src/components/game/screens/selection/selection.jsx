import React from "react";
import LoadingScreen from "../loadingScreen/loadingScreen";

function Selection(props) {
  return (
    <LoadingScreen
      timeRemaining={props.timeRemaining || null}
      justify="center"
      displaySpinner={true}
      flexColumn={true}
      marginTop="2"
    >
      <p>
        Waiting for{" "}
        <span className="game-loading-screen-message--highlight">
          {props.selector}
        </span>{" "}
        to select a {props.type}...
      </p>
    </LoadingScreen>
  );
}

export default Selection;
