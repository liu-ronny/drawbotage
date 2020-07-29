import React, { Component } from "react";
import ChatHeader from "./chatHeader";
import ChatConversation from "./chatConversation";
import ChatSender from "./chatSender";
import "./chat.css";

class Chat extends Component {
  handleSend = (text) => {
    this.props.dispatch({
      type: "SEND_MESSAGE",
      playerName: this.props.game.playerName,
      text,
    });
  };

  render() {
    return (
      <div className="chat row h-100">
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
