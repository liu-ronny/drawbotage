import React, { Component } from "react";
import Header from "./headers/header";
import Teams from "./teams/teams";
import Canvas from "../canvas/canvas";
import Chat from "./chat/chat";
import TurnDisplay from "./turnDisplay/turnDisplay";
import connection from "../../api/connection";
import "./game.css";
import DrawbotageModal from "./screens/drawbotageChoices/drawbotageModal";

class Game extends Component {
  componentDidMount() {
    document.body.style.backgroundColor = "";
  }

  handleWordSelection = (word) => {
    this.props.dispatch({ type: "WORD_SELECTED", word });
  };

  render() {
    const props = {
      game: {
        redPlayerNames: ["someone", "somewhere"],
        bluePlayerNames: ["somehow", "something"],
        drawbotageSelectionTimeRemaining: 23,
      },
    };

    return (
      <>
        {props.game.selectDrawbotage && (
          <DrawbotageModal
            timeRemaining={props.game.drawbotageSelectionTimeRemaining}
            dispatch={props.dispatch}
          />
        )}

        <div className="container-fluid d-flex flex-column vh-100">
          <Header className="row align-items-center" />
          <div className="row align-items-center flex-grow-1">
            <div className="game-size-container d-flex flex-column col">
              <TurnDisplay
                round={props.game.round}
                turn={props.game.turn}
                timeRemaining={props.game.turnTimeRemaining}
                coveredWord={props.game.coveredWord}
              />
              <div className="row flex-grow-1 px-5">
                <div className="col">
                  <div className="row game-container justify-content-center h-100">
                    <div className="col-2 game-teams-container py-3">
                      <Teams
                        redPlayerNames={props.game.redPlayerNames}
                        bluePlayerNames={props.game.bluePlayerNames}
                        unassignedPlayerNames={props.game.unassignedPlayerNames}
                        currentPlayerName={props.game.currentPlayerName}
                      />
                    </div>
                    <div className="col-6 col-lg-7">
                      <Canvas
                        disabled={
                          props.game.playerName !== props.game.currentPlayerName
                        }
                        game={props.game}
                        onWordSelection={this.handleWordSelection}
                      />
                    </div>
                    <div className="col-4 col-lg-3 mh-100">
                      <Chat />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default Game;
