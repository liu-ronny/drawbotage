import React from "react";
import DrawbotageCard from "./drawbotageCard";
import "./drawbotageCards.css";

function DrawbotageCards(props) {
  return (
    <div className="game-drawbotage-cards d-flex justify-content-around align-items-center">
      <i
        className="game-drawbotage-cards-arrow fas fa-arrow-circle-left fa-2x"
        onClick={props.onLeftArrowClick}
      ></i>
      <DrawbotageCard
        title={props.title}
        description={props.description}
        iconClassName={props.iconClassName}
      />
      <i
        className="game-drawbotage-cards-arrow fas fa-arrow-circle-right fa-2x"
        onClick={props.onRightArrowClick}
      ></i>
    </div>
  );
}

export default DrawbotageCards;
