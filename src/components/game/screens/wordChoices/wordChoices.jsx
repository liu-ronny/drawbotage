import React from "react";
import LoadingScreen from "../loadingScreen/loadingScreen";
import "./wordChoices.css";

function WordChoices(props) {
  return (
    <LoadingScreen
      timeRemaining={props.timeRemaining}
      flexColumn={true}
      justify="center"
      marginTop="4"
    >
      <div className="text-center w-100" role="alert" aria-label="Select word">
        <span className="game-loading-screen-message--highlight">Select</span> a
        word for your team to guess
      </div>
      <div className="text-center w-100 mt-4">
        {props.words.map((word) => {
          return (
            <span
              key={word}
              className="game-word-choice rounded border p-3 mx-3"
              onClick={() => props.onWordSelection(word)}
            >
              {word}
            </span>
          );
        })}
      </div>
    </LoadingScreen>
  );
}

export default WordChoices;
