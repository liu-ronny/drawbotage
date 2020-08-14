import React, { Component } from "react";
import ChatHeader from "./chatHeader";
import ChatConversation from "./chatConversation";
import ChatSender from "./chatSender";
import connection from "../../../api/connection";
import "./chat.css";

class Chat extends Component {
  handleSend = (text) => {
    const game = this.props.game;

    // this.props.dispatch({
    //   type: "SEND_MESSAGE",
    //   playerName: game.playerName,
    //   text,
    // });

    const fromTeam = game.bluePlayerNames.includes(game.playerName)
      ? "blue"
      : "red";
    const timeRemaining = game.turnTimeRemaining * 1000;

    connection.emit("guess", {
      roomId: game.roomId,
      guess: text,
      playerName: game.playerName,
      fromTeam,
      timeRemaining,
    });
  };

  render() {
    return (
      <div className="chat row h-100" role="log" aria-label="Chat">
        <div className="col-12 d-flex flex-column">
          <div className="row">
            <ChatHeader />
          </div>
          <div className="row flex-grow-1">
            <ChatConversation messages={this.props.messages} />
          </div>
          <div className="row">
            <ChatSender
              onSend={this.handleSend}
              disabled={this.props.disabled}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Chat;
