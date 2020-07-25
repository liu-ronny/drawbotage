import React, { Component } from "react";
import classNames from "classnames";
import "./draggableTeams.css";

class DraggableTeams extends Component {
  componentDidMount() {
    this.dragulaDecorator = (componentBackingInstance) => {
      if (componentBackingInstance && this.props.isHost) {
        this.props.dragula.containers.push(componentBackingInstance);
      }
      this.dragulaBoxRef = componentBackingInstance;
    };
  }

  componentDidUpdate(prevProps) {
    if (this.dragulaBoxRef) {
      for (let playerTag of this.dragulaBoxRef.childNodes) {
        playerTag.style.display = "block";
      }

      if (!prevProps.isHost && this.props.isHost) {
        this.props.dragula.containers.push(this.dragulaBoxRef);
      }
    }
  }

  render() {
    return (
      <div
        className="overflow-scroll h-100"
        id={this.props.teamName}
        ref={this.dragulaDecorator}
      >
        {this.props.playerNames.map((playerName) => {
          const playerTagClassName = classNames(
            "player-tag",
            "m-1",
            "px-3",
            "py-2",
            {
              "host-player-tag": playerName === this.props.host,
              "display-block": this.props.displayPlayerTags,
            }
          );

          return (
            <div
              id={playerName}
              key={playerName}
              className={playerTagClassName}
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
