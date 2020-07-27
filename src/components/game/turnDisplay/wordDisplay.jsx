import React from "react";
import "./wordDisplay.css";

function WordDisplay(props) {
  return (
    <div className="game-word-display text-center">
      {props.coveredWord ? props.coveredWord : null}
    </div>
  );
}

export default WordDisplay;
