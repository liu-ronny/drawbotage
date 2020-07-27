import React, { Component } from "react";

class ChatMessage extends Component {
  render() {
    return (
      <div className="chat-message pt-2" ref={this.chatMessageRef}>
        <span className="font-weight-bold pr-2">{this.props.sender}:</span>
        <span>{this.props.text}</span>
      </div>
    );
  }
}

export default ChatMessage;
