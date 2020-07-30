import React from "react";
import "./error.css";

function Error(props) {
  return (
    <div
      className="error-alert alert alert-primary text-center flex-grow-1 ml-3 mb-0"
      role="alert"
      aria-label={props.text}
      onClick={props.onClick}
    >
      <i className="fas fa-exclamation-circle mr-2"></i>
      {props.text}
    </div>
  );
}

export default Error;
