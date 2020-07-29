import React from "react";
import classNames from "classnames";
import "./formError.css";

function Error(props) {
  const className = classNames("form-error", {
    "text-left": props.alignText === "left",
    "text-right": props.alignText === "right",
    "text-center": props.alignText === "center",
  });

  return (
    <div className={className}>
      <small>{props.text}</small>
    </div>
  );
}

export default Error;
