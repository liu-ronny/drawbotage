import React from "react";
import classNames from "classnames";
import "./loadingScreen.css";
import "./spinner.css";

function LoadingScreen(props) {
  const className = classNames(
    "loading-screen",
    "d-flex",
    "align-items-center",
    "h-100",
    "w-100",
    {
      "flex-column": props.flexColumn,
      ["justify-content-" + props.justify]: props.justify,
    }
  );

  const displayTimer = !isNaN(parseInt(props.timeRemaining));

  return (
    <div className="game-loading-screen-container">
      <div className={className}>
        {props.children}
        {props.displaySpinner && (
          <div
            className="spinner"
            role="alert"
            aria-busy="true"
            aria-label="Waiting..."
          >
            <div className="bounce1" />
            <div className="bounce2" />
            <div className="bounce3" />
          </div>
        )}
        {displayTimer && (
          <div
            className={"mt-" + props.marginTop}
            role="alert"
            aria-label="wait time remaining"
          >
            {props.timeRemaining}s
          </div>
        )}
      </div>
    </div>
  );
}

export default LoadingScreen;
