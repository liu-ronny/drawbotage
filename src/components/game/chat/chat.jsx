import React, { Component } from "react";
import SectionHeader from "../sectionHeader";
import ChatConversation from "./chatConversation";
import ChatSender from "./chatSender";
import "./chat.css";

class Chat extends Component {
  state = {
    messageCount: 0,
    messages: [],
    disabled: false,
  };

  handleSend = (text) => {
    const sender = "Username";

    this.setState((prevState) => {
      const state = { messages: [], messageCount: prevState.messageCount + 1 };
      const prevMessages = [...prevState.messages];

      for (let message of prevMessages) {
        const messageCopy = {};
        state.messages.push(Object.assign(messageCopy, message));
      }

      state.messages.push({
        sender,
        text,
        id: state.messageCount,
      });
      return state;
    });
  };

  render() {
    return (
      <>
        <div className="chat h-100">
          <SectionHeader
            text="Chat"
            iconClassName="fas fa-comments"
            className="chat-header pl-3"
          />
          <ChatConversation messages={this.state.messages} />
          <ChatSender onSend={this.handleSend} disabled={this.state.disabled} />
        </div>
      </>
    );
  }
}

export default Chat;
