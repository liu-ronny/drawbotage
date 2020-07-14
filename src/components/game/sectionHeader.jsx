import React, { Component } from "react";
import "./sectionHeader.css";
import DynamicLabel from "./chat/dynamicLabel";

class SectionHeader extends Component {
  render() {
    let { text, iconClassName, className } = this.props;
    className = className ? className : "";

    return (
      <DynamicLabel className={"game-section-header " + className}>
        <i className={iconClassName + " pr-2"}></i>
        {text}
      </DynamicLabel>
    );
  }
}

export default SectionHeader;
