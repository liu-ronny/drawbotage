import React, { Component } from "react";

class Info extends Component {
  render() {
    return (
      <React.Fragment>{this.props.selected ? <h1>Q</h1> : null}</React.Fragment>
    );
  }
}

export default Info;
