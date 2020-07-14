import React, { Component } from "react";
import DynamicLabel from "./dynamicLabel";

class ChatHeader extends Component {
  render() {
    return (
      <DynamicLabel className="chat-header font-weight-bold d-flex align-items-center p-3">
        <i className="fas fa-comments pr-2"></i>
        <span>Chat</span>
      </DynamicLabel>
    );
  }
}

export default ChatHeader;
