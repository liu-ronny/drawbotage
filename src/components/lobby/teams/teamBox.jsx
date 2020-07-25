import React, { Component } from "react";
import DraggableTeams from "./draggableTeams";
import "./teamBox.css";

class TeamBox extends Component {
  render() {
    const {
      teamName,
      colorClass,
      playerNames,
      isHost,
      dragula,
      updateTeams,
      host,
      displayPlayerTags,
    } = this.props;

    return (
      <div className="col">
        <div className="h-100">
          <div className="row flex-column h-100">
            <div className="col flex-grow-0">
              <div
                className={
                  "font-weight-bold p-3 lead text-light rounded" +
                  " bg-" +
                  colorClass
                }
              >
                {teamName}
              </div>
            </div>
            <div className="col flex-grow-1">
              <DraggableTeams
                dragula={dragula}
                host={host}
                isHost={isHost}
                teamName={teamName}
                playerNames={playerNames}
                updateTeams={updateTeams}
                displayPlayerTags={displayPlayerTags}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default TeamBox;
