import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import DrawbotageCard from "./drawbotageCard";
import { drawbotages } from "../../../../api/drawbotage";
import "./drawbotageModal.css";

function DrawbotageSelected(props) {
  const title = props.currentDrawbotage;
  const description = drawbotages[title].description;
  const iconClassName = drawbotages[title].iconClassName;

  const [show, setShow] = useState(true);

  return (
    <Modal
      show={show}
      keyboard={false}
      size="lg"
      centered
      scrollable
      dialogClassName="game-drawbotage-modal"
    >
      <Modal.Header>
        <Modal.Title>
          <span className="game-drawbotage-modal-title">
            A drawbotage has been selected!
          </span>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <DrawbotageCard
          title={title}
          description={description}
          iconClassName={iconClassName}
        />
      </Modal.Body>
    </Modal>
  );
}

export default DrawbotageSelected;
