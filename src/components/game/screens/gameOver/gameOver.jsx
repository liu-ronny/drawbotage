import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import "../drawbotageChoices/drawbotageModal.css";

function GameOver(props) {
  const [show, setShow] = useState(true);
  const handleClose = () => {
    setShow(false);
    props.dispatch({
      type: "GAME_OVER",
    });
  };

  const winner = props.endResult.winner === "blue" ? "Team 1" : "Team 2";

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
          <span className="game-drawbotage-modal-title">Game over</span>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="semi-bold mb-4" role="status" aria-label="Game result">
          <span className="game-drawbotage-modal-team-name">{winner}</span> won!
        </p>
        <p
          className="game-drawbotage-modal-team1-color"
          role="status"
          aria-label="Team 1 result"
        >
          Team 1 earned {props.endResult.blueScore} points while spending{" "}
          {props.endResult.blueTotalDrawTime} seconds drawing.
        </p>
        <p
          className="game-drawbotage-modal-team2-color"
          role="status"
          aria-label="Team 2 result"
        >
          Team 2 earned {props.endResult.redScore} points while spending{" "}
          {props.endResult.redTotalDrawTime} seconds drawing.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="neutral" onClick={handleClose}>
          Home
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default GameOver;
