import React, { Component } from "react";
import DynamicLabel from "./dynamicLabel";

class ChatSender extends Component {
  render() {
    return (
      <DynamicLabel className="chat-sender">
        <input
          className="d-inline p-2 chat-sender-input border-right"
          type="text"
          placeholder="Type guess here..."
          disabled={this.props.disabled}
          onKeyUp={(event) => {
            if (event.key === "Enter" && event.target.value) {
              this.props.onSend(event.target.value);
              event.target.value = "";
            }
          }}
        />
        <div
          className="d-inline chat-sender-button text-center"
          onClick={(event) => {
            const input = event.currentTarget.previousSibling;
            if (!this.props.disabled && input.value) {
              this.props.onSend(input.value);
              input.value = "";
            }
          }}
        >
          <i className="far fa-paper-plane"></i>
        </div>
      </DynamicLabel>
    );
  }
}

export default ChatSender;
