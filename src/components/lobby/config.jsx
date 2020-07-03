import React, { Component } from "react";
import { CSSTransition } from "react-transition-group";
import Navbar from "./navbar";
import Settings from "./settings";
import Info from "./info";
import "./config.css";

class Config extends Component {
  constructor() {
    super();
    this.activeClass = " lobby-active";
    this.state = {
      selected: "settings",
      iconInfo: {
        settings: {
          inProp: false,
          classes: "fas fa-cog" + this.activeClass,
        },
        info: {
          inProp: false,
          classes: "fas fa-info",
        },
        question: {
          inProp: false,
          classes: "fas fa-question",
        },
      },
    };
  }

  handleClick = (icon) => {
    if (icon === this.state.selected) {
      return;
    }

    const state = JSON.parse(JSON.stringify(this.state));
    const selected = state.selected;
    const iconInfo = state.iconInfo;

    iconInfo[selected].classes = iconInfo[selected].classes.replace(
      this.activeClass,
      ""
    );
    iconInfo[icon].classes += this.activeClass;
    iconInfo[selected].inProp = false;
    iconInfo[icon].inProp = true;
    state.selected = icon;
    state.iconInfo = iconInfo;

    this.setState(state);
  };

  render() {
    return (
      <React.Fragment>
        <Navbar iconInfo={this.state.iconInfo} onClick={this.handleClick} />
        <CSSTransition
          in={this.state.iconInfo.settings.inProp}
          timeout={700}
          classNames="settings"
        >
          <Settings
            selected={this.state.selected === "settings"}
            roomID={this.props.roomID}
            onLeave={this.props.onLeave}
          />
        </CSSTransition>

        <CSSTransition
          in={this.state.iconInfo.info.inProp}
          timeout={700}
          classNames="info"
        >
          <Info selected={this.state.selected === "info"} />
        </CSSTransition>
      </React.Fragment>
    );
  }
}

export default Config;
