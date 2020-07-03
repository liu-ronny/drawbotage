import React, { Component } from "react";
import { CSSTransition } from "react-transition-group";
import FormButton from "./formButton";
import JoinForm from "./joinForm";
import CreateForm from "./createForm";
import "./form.css";

class Form extends Component {
  state = {
    selected: "join",
    join: {
      inProp: false,
    },
    create: {
      inProp: false,
    },
  };

  handleClick = (button) => {
    if (this.state.selected === button) {
      return;
    }

    const state = { ...this.state };
    const selected = state.selected;
    state.join = { ...this.state.join };
    state.create = { ...this.state.create };

    state[selected].inProp = false;
    state.selected = button;
    state[button].inProp = true;

    this.setState(state);
  };

  render() {
    return (
      <div
        className="join-or-create-game w-50-md ml-auto mr-auto mt-5 p-4"
        data-testid="form"
      >
        <div className="text-center">
          <FormButton
            classNames="join-button"
            title="Join Game"
            name="join"
            color="primary"
            selected={this.state.selected}
            onClick={this.handleClick}
          />
          <FormButton
            classNames="create-button"
            title="Create Game"
            name="create"
            color="dark-primary"
            selected={this.state.selected}
            onClick={this.handleClick}
          />
        </div>

        <CSSTransition
          in={this.state.join.inProp}
          timeout={1500}
          classNames="joinForm"
          selected={this.state.selected === "join"}
        >
          <JoinForm onSubmit={this.props.onSubmit} roomId={this.props.roomId} />
        </CSSTransition>

        <CSSTransition
          in={this.state.create.inProp}
          timeout={1500}
          classNames="createForm"
          selected={this.state.selected === "create"}
        >
          <CreateForm onSubmit={this.props.onSubmit} />
        </CSSTransition>
      </div>
    );
  }
}

export default Form;
