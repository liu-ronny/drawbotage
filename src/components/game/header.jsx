import React, { Component } from "react";
import "./header.css";

class Header extends Component {
  render() {
    return (
      <div className={this.props.className + " game-header"}>
        <div className="pl-5 py-2">Drawbotage</div>{" "}
      </div>
    );
  }
}

export default Header;
