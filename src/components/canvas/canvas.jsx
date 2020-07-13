import React, { Component } from "react";
import paper from "paper/dist/paper-core";
import CanvasManager from "./paper/canvasManager";
import Toolbar from "./toolbar";
import "./canvas.css";

class Canvas extends Component {
  constructor(props) {
    super(props);

    this.smallStrokeWidth = 5;
    this.mediumStrokeWidth = 10;
    this.largeStrokeWidth = 15;
    this.smallEraserSize = [80, 40];
    this.mediumEraserSize = [120, 60];
    this.largeEraserSize = [180, 90];
    this.defaultStrokeColor = "#000000";

    this.state = {
      sizeSelection: "small",
      strokeColor: this.defaultStrokeColor,
    };

    this.paperContainerRef = React.createRef();
    this.paperRef = React.createRef();
    this.heightToWidthRatio = 0.5625;
    this.strokeColors = [
      "#000000",
      "#5D6D7E",
      "#AAB7B8",
      "#EB984E",
      "#F5B041",
      "#F4D03F",
      "#52BE80",
      "#48C9B0",
      "#5DADE2",
      "#5499C7",
      "#A569BD",
      "#AF7AC5",
      "#EC7063",
      "#CD6155",
    ];
  }

  componentDidMount() {
    // window.addEventListener("load", this.handleLoad);
    this.handleLoad();
  }

  componentWillUnmount() {
    // window.removeEventListener("load", this.handleLoad);
    window.removeEventListener("resize", this.resize);
  }

  handleLoad = () => {
    paper.setup(this.paperRef.current);
    this.canvasManager = new CanvasManager(paper, this, {
      strokeColor: this.defaultStrokeColor,
      strokeWidth: this.smallStrokeWidth,
      eraserSizes: {
        smallEraserSize: this.smallEraserSize,
        mediumEraserSize: this.mediumEraserSize,
        largeEraserSize: this.largeEraserSize,
      },
    });
    this.resizeCanvas();
    window.addEventListener("resize", this.resizeCanvas);
  };

  /**
   * Resizes the canvas to fit its container and resizes the project view to fit the canvas.
   * See {@link https://stackoverflow.com/questions/55004882/how-to-zoom-to-fit-a-paperjs-canvas}
   */
  resizeCanvas = () => {
    const canvasContainerElement = this.paperContainerRef.current;
    const canvasElement = this.paperRef.current;

    canvasContainerElement.style.height =
      canvasContainerElement.clientWidth * this.heightToWidthRatio + "px";
    canvasElement.style.width = "100%";
    canvasElement.style.height = "100%";
    paper.view.viewSize = new paper.Size(
      canvasElement.clientWidth,
      canvasElement.clientHeight
    );
    // this.canvasManager.resizeRaster();
    this.canvasManager.resizeView(canvasContainerElement.clientWidth);
    paper.view.update();
  };

  render() {
    return (
      <div>
        <div className="canvas" ref={this.paperContainerRef}>
          <canvas id="canvas" ref={this.paperRef}></canvas>
        </div>
        <div className="row no-gutters mt-3">
          <Toolbar
            strokeColors={this.strokeColors}
            activeStrokeColor={this.state.strokeColor}
            activeSizeSelection={this.state.sizeSelection}
            onColorOptionClick={(strokeColor) => {
              this.canvasManager.drawingTool.activate();
              this.canvasManager.strokeColor = strokeColor;
              this.setState({ strokeColor });
            }}
            onSmallSizeClick={() => {
              this.canvasManager.strokeWidth = this.smallStrokeWidth;
              this.canvasManager.eraserSize = "small";
              this.setState({ sizeSelection: "small" });
            }}
            onMediumSizeClick={() => {
              this.canvasManager.strokeWidth = this.mediumStrokeWidth;
              this.canvasManager.eraserSize = "medium";
              this.setState({ sizeSelection: "medium" });
            }}
            onLargeSizeClick={() => {
              this.canvasManager.strokeWidth = this.largeStrokeWidth;
              this.canvasManager.eraserSize = "large";
              this.setState({ sizeSelection: "large" });
            }}
            onEraserClick={() => this.canvasManager.eraserTool.activate()}
            onClearClick={() => this.canvasManager.clearTool.clear()}
            onFillClick={() => this.canvasManager.fillTool.fill()}
          />
        </div>
      </div>
    );
  }
}

export default Canvas;
