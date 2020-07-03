import React, { Component } from "react";
import Header from "./header";
import "./home.css";

class Home extends Component {
  componentDidMount() {
    const body = {
      backgroundColor: "aliceblue",
      height: "100%",
    };

    document.documentElement.style.height = "100%";

    for (let i in body) {
      document.body.style[i] = body[i];
    }
  }

  render() {
    return (
      <div className="d-flex flex-column" id="content">
        <div className="container">
          <Header />
          <div className="row justify-content-center">
            <div className="col-10 col-md-7 col-lg-5">
              {this.props.children}
            </div>
          </div>
          <p className="text-center mt-5 text-secondary font-weight-bold">
            How to play
          </p>
        </div>
        <div id="background-container"></div>
      </div>
    );
  }
}

export default Home;
