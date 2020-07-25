import React from "react";

function WordDisplay(props) {
  return (
    <div className="game-word-display font-weight-bold text-center">
      {props.coveredWord ? props.coveredWord : null}
    </div>
  );
}

export default WordDisplay;
