import React, { Component } from "react";
import "./teamHeader.css";

class TeamHeader extends Component {
  render() {
    const { teamName, iconClassName, color } = this.props;
    const style = {
      color,
    };

    return (
      <div style={style} className="game-team-header">
        <i className={iconClassName + " mr-3"}></i>
        {teamName}
      </div>
    );
  }
}

export default TeamHeader;
