import React, { Component } from "react";
import Home from "./home";
import Form from "./form/form";
import Alert from "../general/alert/alert";
import LoadingScreen from "../loadingScreen";
import getRoomId from "../../api/getRoomId";
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

  componentDidMount() {
    const { location, history } = this.props;

    if (location.state && location.state.reload) {
      history.replace("/");
      window.location.reload();
    }
  }

  handleSubmit = async (values, create) => {
    this.setState({ loading: true });

    let roomId;

    if (create) {
      roomId = values.roomId;
    } else {
      try {
        roomId = await getRoomId();
      } catch (err) {
        console.log(err);
      }
    }

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
    const { location } = this.props;
    const roomId = location.state ? location.state.roomId : null;

    if (this.state.loading) {
      return <LoadingScreen />;
    }

    if (this.state.redirect) {
      return (
        <Redirect
          to={{
            pathname: `/${this.state.roomId}`,
            state: {
              ...this.state,
            },
          }}
        />
      );
    }

    const alert =
      location.state && location.state.fromWindowUnload ? (
        <Alert message="You left the game! Join to re-enter or create a new game." />
      ) : null;

    return (
      <Home>
        {alert}
        <Form onSubmit={this.handleSubmit} roomId={roomId} />
      </Home>
    );
  }
}

export default Loader;
