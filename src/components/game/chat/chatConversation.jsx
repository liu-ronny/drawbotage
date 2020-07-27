import React, { Component } from "react";
import ChatMessage from "./chatMessage";

class ChatConversation extends Component {
  render() {
    return (
      <div className="chat-conversation col-12 bg-light border-top border-bottom">
        {this.props.messages.map((message) => {
          return (
            <ChatMessage
              key={message.id}
              sender={message.sender}
              text={message.text}
            />
          );
        })}
      </div>
    );
  }
}

export default ChatConversation;
