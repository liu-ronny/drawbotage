import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import "../drawbotageChoices/drawbotageModal.css";
import "./scoreUpdate.css";

function ScoreUpdate(props) {
  const [show, setShow] = useState(true);

  const resultMessage =
    props.turnResult.timeRemaining > 0
      ? `The word was correctly guessed by ${props.turnResult.playerName} with ${props.turnResult.timeRemaining} seconds remaining.`
      : "Nobody correctly guessed the word.";

  const teamName =
    props.turnResult.currentTeam === "blue" ? "Team 1" : "Team 2";

  return (
    <Modal
      show={show}
      backdrop="static"
      keyboard={false}
      size="lg"
      centered
      scrollable
      dialogClassName="game-drawbotage-modal"
    >
      <Modal.Header>
        <Modal.Title>
          <span className="game-drawbotage-modal-title">The turn ended</span>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="semi-bold" role="status" aria-label="Turn result">
          The word was{" "}
          <span className="game-score-update-message--highlight">
            "{props.turnResult.word}"
          </span>
          . {resultMessage}
        </p>
        <p className="semi-bold" role="status" aria-label="Score update">
          <span className="game-drawbotage-modal-team-name">{teamName}</span>'s{" "}
          new score is...{" "}
          <span className="ml-3">
            {props.turnResult.prevScore} +{" "}
            <span className="game-score-update-points">
              {props.turnResult.points}
            </span>{" "}
            = {props.turnResult.currentScore}.
          </span>
        </p>
      </Modal.Body>
    </Modal>
  );
}

export default ScoreUpdate;
