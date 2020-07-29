import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import "./drawbotageModal.css";
import DrawbotageCards from "./drawbotageCards";

function DrawbotageChoices(props) {
  const titles = ["reverse", "hide", "color", "bulldoze"];
  const drawbotages = {
    reverse: {
      description:
        "Every stroke made by the player appears in the opposite direction.",
      iconClassName: "fa fa-map-signs",
    },
    hide: {
      description:
        "The player only sees the previous stroke on his/her canvas.",
      iconClassName: "far fa-eye-slash",
    },
    color: {
      description: "Each new stroke is set to a random color.",
      iconClassName: "fa fas fa-palette",
    },
    bulldoze: {
      description:
        "Every 10 seconds, 1/5th of the canvas gets bulldozed by a moving eraser.",
      iconClassName: "fa fas fa-eraser",
    },
  };

  const [pos, setPos] = useState(0);
  const handleLeftArrowClick = () => {
    const prev = pos - 1 < 0 ? titles.length - 1 : pos - 1;
    setPos(prev);
  };
  const handleRightArrowClick = () => {
    const next = pos + 1 >= titles.length ? 0 : pos + 1;
    setPos(next);
  };

  const title = titles[pos];
  const description = drawbotages[title].description;
  const iconClassName = drawbotages[title].iconClassName;

  const [show, setShow] = useState(true);
  const handleClose = () => {
    setShow(false);
    props.dispatch({
      type: "DRAWBOTAGE_SELECTED",
      drawbotage: titles[pos],
    });
  };

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
          <span className="game-drawbotage-modal-title w-100">
            It's drawbotage time!
          </span>
        </Modal.Title>
        <div className="d-flex align-items-center ml-auto font-weight-bold h-100">
          <svg
            width="1em"
            height="1em"
            viewBox="0 0 16 16"
            className="bi bi-alarm"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M8 15A6 6 0 1 0 8 3a6 6 0 0 0 0 12zm0 1A7 7 0 1 0 8 2a7 7 0 0 0 0 14z"
            />
            <path
              fillRule="evenodd"
              d="M8 4.5a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.053.224l-1.5 3a.5.5 0 1 1-.894-.448L7.5 8.882V5a.5.5 0 0 1 .5-.5z"
            />
            <path d="M.86 5.387A2.5 2.5 0 1 1 4.387 1.86 8.035 8.035 0 0 0 .86 5.387zM11.613 1.86a2.5 2.5 0 1 1 3.527 3.527 8.035 8.035 0 0 0-3.527-3.527z" />
            <path
              fillRule="evenodd"
              d="M11.646 14.146a.5.5 0 0 1 .708 0l1 1a.5.5 0 0 1-.708.708l-1-1a.5.5 0 0 1 0-.708zm-7.292 0a.5.5 0 0 0-.708 0l-1 1a.5.5 0 0 0 .708.708l1-1a.5.5 0 0 0 0-.708zM5.5.5A.5.5 0 0 1 6 0h4a.5.5 0 0 1 0 1H6a.5.5 0 0 1-.5-.5z"
            />
            <path d="M7 1h2v2H7V1z" />
          </svg>
          <span className="pl-2">{props.timeRemaining}s</span>
        </div>
      </Modal.Header>
      <Modal.Body>
        <p>
          Your team has fallen behind in points. Help them by sabotaging the
          player drawing for the other team. Select any of the available
          options.
        </p>
        <DrawbotageCards
          onLeftArrowClick={handleLeftArrowClick}
          onRightArrowClick={handleRightArrowClick}
          title={title}
          description={description}
          iconClassName={iconClassName}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="neutral" onClick={handleClose}>
          Select
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default DrawbotageChoices;
