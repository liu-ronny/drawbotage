import React from "react";
import classNames from "classnames";
import "./option.css";

function Options(props) {
  const iconClassName = classNames(props.iconClassName, "mr-2");

  return (
    <div className="input-group mb-3">
      <div className="input-group-prepend input-group-text">
        <i className={iconClassName}></i>
        {props.label}
      </div>
      <select
        className="option-dropdown custom-select"
        disabled={props.disabled}
        onChange={(event) => props.onChange(event, props.name)}
      >
        {props.values.map((element, index) => {
          return (
            <option key={index} value={element}>
              {element}
            </option>
          );
        })}
      </select>
    </div>
  );
}

export default Options;
