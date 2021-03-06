import React, { Component } from "react";
import ChatMessage from "./chatMessage";

class ChatConversation extends Component {
  render() {
    return (
      <div
        className="chat-conversation col-12 bg-light border-top border-bottom"
        role="list"
      >
        <div className="chat-conversation-box">
          {this.props.messages.map((message) => {
            return (
              <ChatMessage
                key={message.id}
                sender={message.sender}
                text={message.text}
                isCorrect={message.isCorrect}
              />
            );
          })}
        </div>
      </div>
    );
  }
}

export default ChatConversation;
