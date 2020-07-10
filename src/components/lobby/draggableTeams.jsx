import React, { Component } from "react";

class DraggableTeams extends Component {
  render() {
    const dragulaDecorator = (componentBackingInstance) => {
      if (componentBackingInstance && this.props.isHost) {
        this.props.dragula.containers.push(componentBackingInstance);
      }
    };

    return (
      <div
        className="overflow-scroll h-100"
        id={this.props.teamName}
        ref={dragulaDecorator}
      >
        {this.props.playerNames.map((playerName) => {
          const hostClass =
            playerName === this.props.host ? " host-player-tag" : "";

          return (
            <div
              id={playerName}
              key={playerName}
              className={"player-tag m-1 px-3 py-2" + hostClass}
            >
              {playerName}
            </div>
          );
        })}
      </div>
    );
  }
}

export default DraggableTeams;
