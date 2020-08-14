import React, { Component } from "react";

class ChatSender extends Component {
  render() {
    return (
      <>
        <input
          className="col p-2 chat-sender-input border-right"
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
          className="col-auto d-flex align-items-center chat-sender-button text-center"
          onClick={(event) => {
            const input = event.currentTarget.previousSibling;
            if (!this.props.disabled && input.value) {
              this.props.onSend(input.value);
              input.value = "";
            }
          }}
          role="button"
          aria-label="Send message"
        >
          <i className="far fa-paper-plane"></i>
        </div>
      </>
    );
  }
}

export default ChatSender;
