import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import Header from "./headers/header";
import Teams from "./teams/teams";
import Canvas from "../canvas/canvas";
import Chat from "./chat/chat";
import TurnDisplay from "./turnDisplay/turnDisplay";
import ScoreUpdate from "./screens/scoreUpdate/scoreUpdate";
import DrawbotageModal from "./screens/drawbotageChoices/drawbotageModal";
import DrawbotageSelected from "./screens/drawbotageChoices/drawbotageSelected";
import GameOver from "./screens/gameOver/gameOver";
import LoadingScreen from "../general/loadingScreen/loadingScreen";
import "./game.css";

class Game extends Component {
  componentDidMount() {
    document.body.style.backgroundColor = "";
  }

  handleWordSelection = (word) => {
    this.props.dispatch({ type: "WORD_SELECTED", word });
  };

  render() {
    if (this.props.game.gameOver) {
      return (
        <Redirect
          to={{
            pathname: "/",
            state: {},
          }}
        />
      );
    }

    return (
      <>
        {this.props.game.gameStarting ? (
          <LoadingScreen text="Starting game..." animation="chase" />
        ) : null}

        {this.props.game.endResult ? (
          <GameOver
            endResult={this.props.game.endResult}
            dispatch={this.props.dispatch}
          />
        ) : null}

        {this.props.game.turnResult ? (
          <ScoreUpdate
            turnResult={this.props.game.turnResult}
            dispatch={this.props.dispatch}
          />
        ) : null}

        {this.props.game.selectDrawbotage ? (
          <DrawbotageModal
            timeRemaining={this.props.game.drawbotageSelectionTimeRemaining}
            dispatch={this.props.dispatch}
          />
        ) : null}

        {this.props.game.showDrawbotageSelection ? (
          <DrawbotageSelected
            currentDrawbotage={this.props.game.currentDrawbotage}
            dispatch={this.props.dispatch}
          />
        ) : null}

        <div className="container-fluid d-flex flex-column vh-100">
          <Header className="row align-items-center" />
          <div className="row align-items-center flex-grow-1">
            <div className="game-size-container d-flex flex-column col">
              <TurnDisplay
                round={this.props.game.round}
                turn={this.props.game.turn}
                timeRemaining={this.props.game.turnTimeRemaining}
                coveredWord={this.props.game.coveredWord}
              />
              <div className="row flex-grow-1 px-5">
                <div className="col">
                  <div className="row game-container justify-content-center h-100">
                    <div className="col-2 game-teams-container py-3">
                      <Teams
                        redPlayerNames={this.props.game.redPlayerNames}
                        bluePlayerNames={this.props.game.bluePlayerNames}
                        redScore={this.props.game.redScore}
                        blueScore={this.props.game.blueScore}
                        unassignedPlayerNames={
                          this.props.game.unassignedPlayerNames
                        }
                        currentPlayerName={this.props.game.currentPlayerName}
                      />
                    </div>
                    <div className="col-6 col-lg-7">
                      <Canvas
                        disabled={
                          this.props.game.playerName !==
                          this.props.game.currentPlayerName
                        }
                        game={this.props.game}
                        onWordSelection={this.handleWordSelection}
                      />
                    </div>
                    <div className="col-4 col-lg-3 mh-100">
                      <Chat
                        game={this.props.game}
                        dispatch={this.props.dispatch}
                        messages={this.props.game.messages}
                        disabled={
                          this.props.game.playerName ===
                          this.props.game.currentPlayerName
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
