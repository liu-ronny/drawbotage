import React, { Component } from "react";
import { Widget, toggleWidget, renderCustomComponent } from "react-chat-widget";
import ChatMessage from "./chatMessage";
import "react-chat-widget/lib/styles.css";
import "./chat.css";

class Chat extends Component {
  componentDidMount() {
    toggleWidget();
  }

  handleNewUserMessage = (newMessage) => {};

  render() {
    return (
      <>
        <Widget
          handleNewUserMessage={this.handleNewUserMessage}
          title="Chat"
          subtitle=""
          showTimeStamp={false}
        />
      </>
    );
  }
}

export default Chat;
