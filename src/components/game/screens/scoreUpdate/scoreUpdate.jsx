import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import "../drawbotageChoices/drawbotageModal.css";
import "./scoreUpdate.css";

function ScoreUpdate(props) {
  const [show, setShow] = useState(true);
  const handleClose = () => {
    setShow(false);
    props.dispatch({
      type: "SCORE_UPDATE_VIEWED",
    });
  };

  const resultMessage =
    props.turnResult.timeRemaining > 0
      ? `The word was correctly guessed by ${props.turnResult.playerName} with ${props.turnResult.timeRemaining} seconds remaining. `
      : "Nobody correctly guessed the word. ";

  const teamName = props.turnResult.currentTeam === "red" ? "Team 1" : "Team 2";

  return (
    <Modal
      show={show}
      onHide={handleClose}
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
        <p className="semi-bold">
          The word was{" "}
          <span className="game-score-update-message--highlight">
            "{props.turnResult.word}"
          </span>
          . {resultMessage}
        </p>
        <p className="semi-bold">
          <span className="game-drawbotage-modal-team-name">{teamName}'s</span>{" "}
          new score is...{" "}
          <span className="ml-3">
            {props.turnResult.prevScore} +{" "}
            <span className="game-score-update-points">
              {props.turnResult.points}
            </span>{" "}
            = {props.turnResult.currentScore}
          </span>
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="neutral" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ScoreUpdate;
