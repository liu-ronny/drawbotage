import React, { Component } from "react";

class DynamicText extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.dynamicTextRef = React.createRef();
  }

  componentDidMount() {
    this.setState({
      maxWindowHeight: window.screen.availHeight,
      fontSize: parseInt(
        window
          .getComputedStyle(this.dynamicTextRef.current)
          .fontSize.replace("px", "")
      ),
    });
    window.addEventListener("resize", this.resize);
  }

  resize = () => {
    const factor = window.outerHeight / this.state.maxWindowHeight;
    const resizedFont = factor * this.state.fontSize;

    if (resizedFont >= 10) {
      this.dynamicTextRef.current.style.fontSize = resizedFont + "px";
    }
  };

  render() {
    const className = this.props.className ? this.props.className : "";

    return (
      <div className={className} ref={this.dynamicTextRef}>
        {this.props.children}
      </div>
    );
  }
}

export default DynamicText;
