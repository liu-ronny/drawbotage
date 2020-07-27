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

  console.log(props);

  return (
    <div className="game-loading-screen-container">
      <div className={className}>
        {props.children}
        {props.displaySpinner && (
          <div class="spinner">
            <div class="bounce1" />
            <div class="bounce2" />
            <div class="bounce3" />
          </div>
        )}
        {props.timeRemaining && (
          <div className={"mt-" + props.marginTop}>{props.timeRemaining}s</div>
        )}
      </div>
    </div>
  );
}

export default LoadingScreen;
