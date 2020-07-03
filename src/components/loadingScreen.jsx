import React, { Component } from "react";
import Header from "./home/header";
import "./loadingScreen.css";

class LoadingScreen extends Component {
  render() {
    return (
      <div
        className="d-flex justify-content-center align-items-center vh-100"
        data-testid="loading"
      >
        <div className="fixed-top">
          <Header />
        </div>
        <div className="spinner-grow text-light-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
        <div className="spinner-grow text-light-secondary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
        <div className="spinner-grow text-secondary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
        <div className="spinner-grow text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
        <div className="spinner-grow text-dark-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }
}

export default LoadingScreen;
