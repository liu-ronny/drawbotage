import React, { Component } from "react";
import "./header.css";

class Header extends Component {
  render() {
    return (
      <div className="game-header d-flex align-items-center">
        <div className="container-fluid pl-5 py-2">Drawbotage</div>{" "}
      </div>
    );
  }
}

export default Header;
