import React, { Component } from "react";
import "./utilityOption.css";
import "../toolbar.css";

class UtilityOption extends Component {
  render() {
    const activeSizeSelectionClassName =
      this.props.activeSizeSelection &&
      this.props.activeSizeSelection === this.props.name
        ? "utility-option-active"
        : "";

    return (
      <div
        className={
          "toolbar-option utility-option " + activeSizeSelectionClassName
        }
        onClick={this.props.onClick}
      >
        {this.props.children}
      </div>
    );
  }
}

export default UtilityOption;
