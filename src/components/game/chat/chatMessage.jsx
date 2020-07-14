import React, { Component } from "react";
import DynamicText from "./dynamicText";

class ChatMessage extends Component {
  render() {
    return (
      <DynamicText className="chat-message pt-2 px-2" ref={this.chatMessageRef}>
        <span className="font-weight-bold mr-2">{this.props.sender}:</span>
        <span>{this.props.text}</span>
      </DynamicText>
    );
  }
}

export default ChatMessage;
