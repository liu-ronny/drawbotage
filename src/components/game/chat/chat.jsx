import React, { Component } from "react";
import ChatHeader from "./chatHeader";
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
      <div className="chat row h-100">
        <div className="col-12 d-flex flex-column">
          <div className="row">
            <ChatHeader />
          </div>
          <div className="row flex-grow-1">
            <ChatConversation messages={this.state.messages} />
          </div>
          <div className="row">
            <ChatSender
              onSend={this.handleSend}
              disabled={this.state.disabled}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Chat;
