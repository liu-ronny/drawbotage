import React from "react";
import "./turnDisplay.css";

function TurnDisplay(props) {
  const displayTimer = !isNaN(props.timeRemaining);

  return (
    <div className="game-turn-display row px-5 pb-3">
      <div className="col-2">
        <div className="row align-items-center h-100">
          <hr className="col" />
        </div>
      </div>
      <div className="col-6 col-lg-7">
        <div className="d-flex justify-content-between px-3">
          <div>
            <svg
              width="1em"
              height="1em"
              viewBox="0 0 16 16"
              className="bi bi-alarm-fill"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M5.5.5A.5.5 0 0 1 6 0h4a.5.5 0 0 1 0 1H9v1.07a7.002 7.002 0 0 1 3.537 12.26l.817.816a.5.5 0 0 1-.708.708l-.924-.925A6.967 6.967 0 0 1 8 16a6.967 6.967 0 0 1-3.722-1.07l-.924.924a.5.5 0 0 1-.708-.708l.817-.816A7.002 7.002 0 0 1 7 2.07V1H5.999a.5.5 0 0 1-.5-.5zM.86 5.387A2.5 2.5 0 1 1 4.387 1.86 8.035 8.035 0 0 0 .86 5.387zM13.5 1c-.753 0-1.429.333-1.887.86a8.035 8.035 0 0 1 3.527 3.527A2.5 2.5 0 0 0 13.5 1zm-5 4a.5.5 0 0 0-1 0v3.882l-1.447 2.894a.5.5 0 1 0 .894.448l1.5-3A.5.5 0 0 0 8.5 9V5z"
              />
            </svg>
            {displayTimer && (
              <span
                role="status"
                aria-label={
                  props.timeRemaining + " seconds remaining in the turn"
                }
              >
                {props.timeRemaining}
              </span>
            )}
          </div>
          <div>
            {props.coveredWord ? (
              <span className="game-word-display">{props.coveredWord}</span>
            ) : (
              <span className="game-word-display">______</span>
            )}
          </div>
          <div>
            <span>Round {props.round}</span>
          </div>
        </div>
      </div>
      <div className="col-4 col-lg-3">
        <div className="row align-items-center h-100">
          <hr className="col" />
        </div>
      </div>
    </div>
  );
}

export default TurnDisplay;
