import React, { Component } from "react";
import "./option.css";

class Option extends Component {
  render() {
    return (
      <div className="mb-3 input-group option">
        <div className="input-group-prepend input-group-text">
          <i className={this.props.iconClasses + " option-icon mr-2"}></i>
          {this.props.label}
        </div>

        <select
          className="option-dropdown custom-select"
          disabled={this.props.disabled}
          onChange={(event) =>
            this.props.onChange(event, this.props.optionName)
          }
        >
          {this.props.values.map((e, i) => {
            return (
              <option key={i} value={e}>
                {e}
              </option>
            );
          })}
        </select>
      </div>
    );
  }
}

export default Option;
