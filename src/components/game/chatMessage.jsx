import React, { Component } from "react";
import "./chatMessage.css";

class ChatMessage extends Component {
  render() {
    return <div className="game-chat-message">{this.props.message}</div>;
  }
}

export default ChatMessage;
