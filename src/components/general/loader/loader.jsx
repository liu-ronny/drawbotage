import React from "react";
import "./loader.css";

function Loader(props) {
  return (
    <div className="loader d-flex flex-column justify-content-center align-items-center">
      <div>{props.message}</div>
      <div className="spinner-border text-primary mt-3" role="status">
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}

export default Loader;
