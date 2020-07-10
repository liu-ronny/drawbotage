import React, { Component } from "react";
import ColorOption from "./colorOption";

class ColorPalette extends Component {
  render() {
    return (
      <div className="col">
        <div
          className={
            "row no-gutters justify-content-between " + this.props.className
          }
        >
          {this.props.strokeColors.map((color) => {
            return (
              <div className="col">
                <ColorOption
                  key={color}
                  color={color}
                  onClick={this.props.onClick}
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default ColorPalette;
