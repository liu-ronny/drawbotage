import React, { Component } from "react";
import "./alert.css";

class Alert extends Component {
  render() {
    return (
      <div className="alert alert-primary text-center mt-2" role="alert">
        {this.props.message}
      </div>
    );
  }
}

export default Alert;
