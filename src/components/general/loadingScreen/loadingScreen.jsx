import React, { Component } from "react";
import Header from "../header/header";
import "./loadingScreen.css";

class LoadingScreen extends Component {
  render() {
    return (
      <div className="loading-screen d-flex justify-content-center align-items-center vh-100">
        <div className="fixed-top">
          <Header />
        </div>
        <div>
          {this.props.text ? (
            <div className="loading-screen-text pb-5">{this.props.text}</div>
          ) : null}
          {this.props.animation === "spinner" ? (
            <div
              className="spinner"
              role="alert"
              aria-busy="true"
              aria-label="Waiting..."
            >
              <div className="bounce1" />
              <div className="bounce2" />
              <div className="bounce3" />
            </div>
          ) : (
            <div className="sk-chase mx-auto">
              <div className="sk-chase-dot"></div>
              <div className="sk-chase-dot"></div>
              <div className="sk-chase-dot"></div>
              <div className="sk-chase-dot"></div>
              <div className="sk-chase-dot"></div>
              <div className="sk-chase-dot"></div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default LoadingScreen;
