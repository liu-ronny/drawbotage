import React, { Component } from "react";

class DynamicLabel extends Component {
  constructor(props) {
    super(props);
    this.dynamicLabelRef = React.createRef();
  }

  componentDidMount() {
    const ref = this.dynamicLabelRef.current;
    ref.style.color = this.props.color;
    this.resize();
    window.addEventListener("resize", this.resize);
  }

  resize = () => {
    const ref = this.dynamicLabelRef.current;
    const height = ref.clientHeight;
    const fontSize = height / 2;

    if (fontSize >= 10) {
      ref.style.lineHeight = height + "px";
      ref.style.fontSize = fontSize + "px";
    }
  };

  render() {
    const className = this.props.className ? this.props.className : "";

    return (
      <div className={className} ref={this.dynamicLabelRef}>
        {this.props.children}
      </div>
    );
  }
}

export default DynamicLabel;
