import React, { Component } from "react";
import Header from "./headers/header";
import Teams from "./teams/teams";
import Canvas from "../canvas/canvas";
import Chat from "./chat/chat";
import TurnDisplay from "./turnDisplay/turnDisplay";
import ScoreUpdate from "./screens/scoreUpdate/scoreUpdate";
import connection from "../../api/connection";
import "./game.css";
import DrawbotageModal from "./screens/drawbotageChoices/drawbotageModal";
import GameOver from "./screens/gameOver/gameOver";
import { Redirect } from "react-router-dom";

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
        playerName: "hi",
        currentPlayerName: "bye",
        redPlayerNames: ["someone", "somewhere"],
        bluePlayerNames: ["somehow", "something"],
        drawbotageSelectionTimeRemaining: 23,
        redScore: 0,
        blueScore: 0,
        messages: [],
        messageCount: 0,
      },
    };

    return (
      <>
        {props.game.gameOver ? (
          <Redirect
            to={{
              pathname: "/",
              state: {},
            }}
          />
        ) : null}

        <GameOver
          endResult={{
            redScore: 750,
            blueScore: 850,
            redTotalDrawTime: 320,
            blueTotalDrawTime: 500,
            winner: "blue",
          }}
        />

        {props.game.endResult && <GameOver endResult={props.game.endResult} />}

        {props.game.turnResult && (
          <ScoreUpdate turnResult={props.game.turnResult} />
        )}

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
                        redScore={props.game.redScore}
                        blueScore={props.game.blueScore}
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
                      <Chat
                        game={props.game}
                        messages={props.game.messages}
                        disabled={
                          props.game.playerName === props.game.currentPlayerName
                        }
                      />
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
