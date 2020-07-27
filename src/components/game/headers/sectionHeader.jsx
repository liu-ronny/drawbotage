import React, { Component } from "react";
import "./sectionHeader.css";

class SectionHeader extends Component {
  render() {
    let { text, iconClassName, className } = this.props;
    className = className ? className : "";

    return (
      <div className={"game-section-header " + className}>
        <i className={iconClassName + " pr-2"}></i>
        {text}
      </div>
    );
  }
}

export default SectionHeader;
