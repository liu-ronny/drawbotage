import React, { Component } from "react";
import Header from "./header";
import Teams from "./teams";
import Canvas from "../canvas/canvas";
import Chat from "./chat/chat";
import connection from "../../api/connection";
import "./game.css";

class Game extends Component {
  state = {
    activePlayerName: null,
  };

  componentDidMount() {
    // temporary
    // document.body.style.backgroundColor = "aliceblue";
    // document.body.style.height = "100%";
    // document.documentElement.style.height = "100%";

    document.body.style.backgroundColor = "";
    connection.unsubscribeFromLobby();
  }

  render() {
    // const redPlayerNames = [
    //   "Sandra Mann",
    //   "Terrell Thatcher",
    //   "Annabelle Jarvis",
    //   "Ikrah Hubbard",
    //   "Mehmet Vaughn",
    // ];

    // const bluePlayerNames = [
    //   "Gurleen Giles",
    //   "Aditya Crawford",
    //   "Celine Hobbs",
    //   "Jamaal Suarez",
    //   "Eva-Rose Wagner",
    // ];

    // const unassignedPlayerNames = ["Hello"];

    // const activePlayerName = "Annabelle Jarvis";

    return (
      <div className="container-fluid vh-100">
        <div className="d-flex flex-column h-100">
          <Header className="row align-items-center" />
          <div className="row flex-grow-1 align-items-center px-5">
            <div className="col h-75 px-5">
              <div className="row game-container justify-content-center h-100">
                <div className="col-2">
                  <Teams
                    redPlayerNames={this.props.gameInfo.redPlayerNames}
                    bluePlayerNames={this.props.gameInfo.bluePlayerNames}
                    unassignedPlayerNames={
                      this.props.gameInfo.unassignedPlayerNames
                    }
                    // redPlayerNames={redPlayerNames}
                    // bluePlayerNames={bluePlayerNames}
                    // unassignedPlayerNames={unassignedPlayerNames}
                    activePlayerName={this.props.gameInfo.activePlayerName}
                  />
                </div>
                <div className="col-6 col-lg-7">
                  <Canvas />
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
