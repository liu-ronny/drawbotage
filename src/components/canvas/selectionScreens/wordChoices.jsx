import React from "react";
import "./wordChoices.css";

function WordChoices(props) {
  return (
    <div className="game-word-choices d-flex justify-content-around align-items-center">
      {props.timeRemaining || null}
      {props.words.map((word) => {
        return (
          <span
            key={word}
            className="game-word-choice rounded border"
            onClick={() => props.onWordSelection(word)}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
}

export default WordChoices;
