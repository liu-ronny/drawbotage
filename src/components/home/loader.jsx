import React, { Component } from "react";
import Home from "./home";
import Form from "./form";
import LoadingScreen from "../loadingScreen";
import getRoomID from "./api/getRoomID";
import { Redirect } from "react-router-dom";

class Loader extends Component {
  state = {
    loading: false,
    redirect: false,
    name: null,
    roomName: null,
    roomID: null,
    create: null,
  };

  handleSubmit = async (values, create) => {
    this.setState({ loading: true });

    const roomID = create ? await getRoomID() : values.roomID;

    setTimeout(() => {
      this.setState({
        loading: false,
        redirect: true,
        name: values.name,
        roomName: values.roomName,
        roomID: roomID,
        create,
      });
    }, 2000);
  };

  render() {
    const roomID = this.props.location.state
      ? this.props.location.state.roomID
      : null;

    return this.state.loading ? (
      <LoadingScreen />
    ) : this.state.redirect ? (
      <Redirect
        to={{
          pathname: `/${this.state.roomID}`,
          state: {
            ...this.state,
          },
        }}
      />
    ) : (
      <Home>
        <Form onSubmit={this.handleSubmit} roomID={roomID} />
      </Home>
    );
  }
}

export default Loader;
