import React, { Component } from "react";
import Header from "./header";
import Teams from "./teams";
import Canvas from "../canvas/canvas";
import Chat from "./chat/chat";
import Loader from "../general/loader/loader";
import connection from "../../api/connection";
import "./game.css";
import WordDisplay from "./wordDisplay/wordDisplay";

class Game extends Component {
  componentDidMount() {
    document.body.style.backgroundColor = "";
  }

  handleWordSelection = (word) => {
    this.props.dispatch({ type: "WORD_SELECTED", word });
  };

  render() {
    return (
      <div className="container-fluid vh-100">
        <div className="d-flex flex-column h-100">
          <Header className="row align-items-center" />
          <div className="row flex-grow-1 align-items-center px-5">
            <div className="col h-75 px-5">
              <div className="row game-container justify-content-center h-100">
                <div className="col-2">
                  <Teams
                    redPlayerNames={this.props.game.redPlayerNames}
                    bluePlayerNames={this.props.game.bluePlayerNames}
                    unassignedPlayerNames={
                      this.props.game.unassignedPlayerNames
                    }
                    currentPlayerName={this.props.game.currentPlayerName}
                  />
                </div>
                <div className="col-6 col-lg-7">
                  <WordDisplay coveredWord={this.props.game.coveredWord} />
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
                  <Chat />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Game;
