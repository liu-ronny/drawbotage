import React, { Component } from "react";
import classNames from "classnames";

class ChatMessage extends Component {
  render() {
    const className = classNames({
      "chat-correct-guess": this.props.isCorrect,
    });

    return (
      <div
        className="chat-message pt-2"
        ref={this.chatMessageRef}
        role="listitem"
      >
        <span className="font-weight-bold pr-2">{this.props.sender}:</span>
        <span className={className}>{this.props.text}</span>
      </div>
    );
  }
}

export default ChatMessage;
