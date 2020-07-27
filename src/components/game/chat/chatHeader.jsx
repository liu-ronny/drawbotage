import React, { Component } from "react";

class ChatHeader extends Component {
  render() {
    return (
      <div className="chat-header col-12 font-weight-bold d-flex align-items-center py-3 pl-3">
        <div className="chat-header-content">
          <i className="fas fa-comments pr-2"></i>
          <span>Chat</span>
        </div>
      </div>
    );
  }
}

export default ChatHeader;
