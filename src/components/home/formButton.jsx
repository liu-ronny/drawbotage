import React, { Component } from "react";
import "./formButton.css";

class FormButton extends Component {
  render() {
    const classes =
      "mr-3 font-weight-bold form-button border-" +
      this.props.color +
      (this.props.selected === this.props.name ? " active-form-button" : "");

    return (
      <React.Fragment>
        <span
          className={classes}
          id={this.props.id}
          onClick={() => this.props.onClick(this.props.name)}
        >
          {this.props.title}

          <span className={"slider bg-" + this.props.color}></span>
        </span>
      </React.Fragment>
    );
  }
}

export default FormButton;
