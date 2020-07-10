import React, { Component } from "react";
import Teams from "./teams";
import Header from "./header";
import connection from "../api/connection";
import "./game.css";
import Chat from "./chat";
import Canvas from "../canvas/canvas";

class Game extends Component {
  state = {
    activePlayerName: null,
  };

  componentDidMount() {
    // temporary
    // document.body.style.backgroundColor = "aliceblue";
    document.body.style.height = "100%";
    document.documentElement.style.height = "100%";

    connection.unsubscribeFromLobby();
  }

  render() {
    const redPlayerNames = [
      "Sandra Mann",
      "Terrell Thatcher",
      "Annabelle Jarvis",
      "Ikrah Hubbard",
      "Mehmet Vaughn",
    ];

    const bluePlayerNames = [
      "Gurleen Giles",
      "Aditya Crawford",
      "Celine Hobbs",
      "Jamaal Suarez",
      "Eva-Rose Wagner",
    ];

    const activePlayerName = "Annabelle Jarvis";
    const style = {
      height: "100%",
    };

    return (
      // <div className="d-flex flex-column" style={style}>
      <>
        <Header />
        <div className="container-fluid">
          <div
            className="row game-container justify-content-center"
            style={style}
          >
            <div className="col-auto">
              <Teams
                redPlayerNames={redPlayerNames}
                bluePlayerNames={bluePlayerNames}
                activePlayerName={activePlayerName}
              />
            </div>
            <div className="col-6">
              <Canvas />
            </div>
            <div className="col-auto">{/* TODO chat */}</div>
          </div>
        </div>
      </>
    );
  }
}

export default Game;
