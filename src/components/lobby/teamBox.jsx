import React, { Component } from "react";
import DraggableTeams from "./draggableTeams";
import "./teamBox.css";

class TeamBox extends Component {
  // handleDragStart = (event) => {
  //   event.dataTransfer.setData("text", event.target.id);
  // };

  // handleDragOver = (event) => {
  //   event.preventDefault();
  // };

  // handleDrop = (event) => {
  //   event.preventDefault();
  //   const teamName = event.target.id;
  //   const playerName = event.dataTransfer.getData("text");
  //   this.props.updateTeams(teamName.toLowerCase(), playerName);
  // };

  render() {
    const {
      teamName,
      colorClass,
      playerNames,
      isHost,
      dragula,
      updateTeams,
      host,
    } = this.props;

    return (
      <div className="col">
        {/* <div className={"rounded border h-100 border-" + colorClass}> */}
        <div className="h-100">
          <div className="row flex-column h-100">
            <div className="col flex-grow-0">
              <div
                // className={
                //   "font-weight-bold rounded border border-" +
                //   colorClass +
                //   " text-" +
                //   colorClass
                // }
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
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default TeamBox;
