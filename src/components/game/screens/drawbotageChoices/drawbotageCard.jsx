import React from "react";

function DrawbotageCard(props) {
  return (
    <div className="d-flex">
      <div
        className={`game-drawbotage-card game-drawbotage-card-${props.title}`}
      >
        <div className="game-drawbotage-card-title">{props.title}</div>
        <div className="text-center">
          <span className="fa-stack fa-lg">
            <i className="fa fa-circle fa-stack-2x"></i>
            <i className={`${props.iconClassName} fa-stack-1x fa-inverse`}></i>
          </span>
        </div>
        <div className="game-drawbotage-card-text">{props.description}</div>
      </div>
    </div>
  );
}

export default DrawbotageCard;
