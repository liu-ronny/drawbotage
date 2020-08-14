import React from "react";
import LoadingScreen from "../loadingScreen/loadingScreen";

function Selection(props) {
  return (
    <LoadingScreen
      timeRemaining={props.timeRemaining}
      justify="center"
      displaySpinner={true}
      flexColumn={true}
      marginTop="2"
    >
      <p role="alert" aria-label="Waiting for selection">
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
