import React, { Component } from "react";
import "./navbar.css";

class Navbar extends Component {
  render() {
    return (
      <nav className="nav lobby-nav mb-5 mt-3">
        {Object.entries(this.props.iconInfo).map(([icon, data]) => (
          <i
            onClick={() => this.props.onClick(icon)}
            key={icon}
            className={data.classes + " icon mr-4"}
          ></i>
        ))}
      </nav>
    );
  }
}

export default Navbar;
