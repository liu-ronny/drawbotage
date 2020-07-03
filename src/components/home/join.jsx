import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import Home from "./home";
import JoinForm from "./joinForm";
import "./join.css";

class Join extends Component {
  // constructor(props) {
  //   super(props);

  //   console.log(props.location.pathname);
  // }

  render() {
    if (this.props.location.state) {
      return (
        <Home>
          <div className="join-or-create-game w-50-md ml-auto mr-auto mt-5 p-4">
            <div className="text-center">
              <span className="font-weight-bold join-game-desc">Join game</span>
            </div>
            <JoinForm
              selected={true}
              roomID={this.props.location.state.roomID}
            />
          </div>
        </Home>
      );
    }

    return <Redirect to="/" />;
  }
}

export default Join;
