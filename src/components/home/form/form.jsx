import React, { useState } from "react";
import { CSSTransition } from "react-transition-group";
import FormTab from "./elements/formTab";
import JoinForm from "./joinForm/joinForm";
import CreateForm from "./createForm/createForm";
import "./form.css";

function Form(props) {
  const [selected, setSelected] = useState("join");
  const [join, setJoin] = useState({ inProp: false });
  const [create, setCreate] = useState({ inProp: false });

  function handleClick(tab) {
    if (tab === selected) return;

    if (tab === "join") {
      setSelected("join");
      setCreate({ inProp: false });
      setJoin({ inProp: true });
    } else {
      setSelected("create");
      setJoin({ inProp: false });
      setCreate({ inProp: true });
    }
  }

  return (
    <div
      className="home-form w-50-md mt-5 p-4 ml-auto mr-auto"
      data-testid="form"
    >
      <div className="text-center">
        <FormTab
          colorClass="primary"
          name="join"
          isSelected={selected === "join"}
          text="Join Game"
          onClick={handleClick}
        />
        <FormTab
          colorClass="dark-primary"
          name="create"
          isSelected={selected === "create"}
          text="Create Game"
          onClick={handleClick}
        />
      </div>

      <CSSTransition
        in={join.inProp}
        timeout={1500}
        classNames="home-form-join-tab"
      >
        <JoinForm
          onSubmit={props.onJoin}
          roomId={props.roomId}
          isSelected={selected === "join"}
        />
      </CSSTransition>

      <CSSTransition
        in={create.inProp}
        timeout={1500}
        classNames="home-form-create-tab"
      >
        <CreateForm
          onSubmit={props.onCreate}
          isSelected={selected === "create"}
        />
      </CSSTransition>
    </div>
  );
}

export default Form;
