import React, { Component } from "react";
import Home from "./home";
import Form from "./form";
import LoadingScreen from "../loadingScreen";
import getRoomId from "./api/getRoomId";
import { Redirect } from "react-router-dom";

class Loader extends Component {
  state = {
    loading: false,
    redirect: false,
    name: null,
    roomName: null,
    roomId: null,
    create: null,
  };

  handleSubmit = async (values, create) => {
    this.setState({ loading: true });

    const roomId = create ? await getRoomId() : values.roomId;

    setTimeout(() => {
      this.setState({
        loading: false,
        redirect: true,
        name: values.name,
        roomName: values.roomName,
        roomId: roomId,
        create,
      });
    }, 2000);
  };

  render() {
    const roomId = this.props.location.state
      ? this.props.location.state.roomId
      : null;

    return this.state.loading ? (
      <LoadingScreen />
    ) : this.state.redirect ? (
      <Redirect
        to={{
          pathname: `/${this.state.roomId}`,
          state: {
            ...this.state,
          },
        }}
      />
    ) : (
      <Home>
        <Form onSubmit={this.handleSubmit} roomId={roomId} />
      </Home>
    );
  }
}

export default Loader;
