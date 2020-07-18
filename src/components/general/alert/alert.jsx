import React from "react";
import "./alert.css";

function Alert(props) {
  return (
    <div className="alert alert-primary text-center mt-2" role="alert">
      {props.message}
    </div>
  );
}

export default Alert;
