import React, { Component } from "react";

class ErrorPage extends Component {
  state = {};
  render() {
    return <div>{this.props.location.state.disconnectedMsg}</div>;
  }
}

export default ErrorPage;
