import React, { Component } from "react";
import { Redirect } from "react-router-dom";

class Reload extends Component {
  constructor(props) {
    super(props);

    const fromWindowUnload = window.sessionStorage.getItem("windowUnload")
      ? true
      : false;
    this.state = {
      fromWindowUnload,
    };
  }

  componentDidMount() {
    window.onbeforeunload = (event) => {
      window.sessionStorage.setItem("windowUnload", "true");
    };

    if (this.state.fromWindowUnload) {
      window.sessionStorage.removeItem("windowUnload");
    }
  }

  componentWillUnmount() {
    window.onbeforeunload = null;
  }

  render() {
    if (this.state.fromWindowUnload) {
      return (
        <Redirect
          to={{
            pathname: "/",
            state: {
              fromWindowUnload: true,
            },
          }}
        />
      );
    }

    return <>{this.props.children}</>;
  }
}

export default Reload;
