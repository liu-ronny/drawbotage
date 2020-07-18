import React, { Component } from "react";
import { CSSTransition } from "react-transition-group";
import FormTab from "./elements/formTab";
import JoinForm from "./joinForm/joinForm";
import CreateForm from "./createForm/createForm";
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

  handleClick = (tab) => {
    if (this.state.selected === tab) {
      return;
    }

    const state = {};
    Object.assign(state, this.state);
    state[this.state.selected].inProp = false;
    state.selected = tab;
    state[tab].inProp = true;

    this.setState(state);
  };

  render() {
    return (
      <div
        className="home-form w-50-md mt-5 p-4 ml-auto mr-auto"
        data-testid="form"
      >
        <div className="text-center">
          <FormTab
            colorClass="primary"
            name="join"
            isSelected={this.state.selected === "join"}
            text="Join Game"
            onClick={this.handleClick}
          />
          <FormTab
            colorClass="dark-primary"
            name="create"
            isSelected={this.state.selected === "create"}
            text="Create Game"
            onClick={this.handleClick}
          />
        </div>

        <CSSTransition
          in={this.state.join.inProp}
          timeout={1500}
          classNames="home-form-join-tab"
        >
          <JoinForm
            onSubmit={this.props.onSubmit}
            roomId={this.props.roomId}
            isSelected={this.state.selected === "join"}
          />
        </CSSTransition>

        <CSSTransition
          in={this.state.create.inProp}
          timeout={1500}
          classNames="home-form-create-tab"
        >
          <CreateForm
            onSubmit={this.props.onSubmit}
            isSelected={this.state.selected === "create"}
          />
        </CSSTransition>
      </div>
    );
  }
}

export default Form;
