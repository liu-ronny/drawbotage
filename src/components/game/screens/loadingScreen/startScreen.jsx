import React from "react";
import "./startScreen.css";
import "./spinner.css";

const StartScreen = () => {
  return (
    <div className="game-start-screen">
      <div>Game starting...</div>
      <div
        className="spinner mt-3"
        role="alert"
        aria-busy="true"
        aria-label="Waiting..."
      >
        <div className="bounce1" />
        <div className="bounce2" />
        <div className="bounce3" />
      </div>
    </div>
  );
};

export default StartScreen;
