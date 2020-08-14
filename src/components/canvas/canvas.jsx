import React, { Component } from "react";
import paper from "paper/dist/paper-core";
import connection from "../../api/connection";
import CanvasManager from "./paper/canvasManager";
import Toolbar from "./toolbar";
import Selection from "../game/screens/selection/selection";
import WordChoices from "../game/screens/wordChoices/wordChoices";
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
    paper.setup(this.paperRef.current);
    this.canvasManager = new CanvasManager(paper, {
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
    this.setState({ activeTool: this.canvasManager.activeTool });
    connection.attachCanvas(this);
  }

  componentDidUpdate(prevProps) {
    const wasCurrentPlayer =
      prevProps.game.playerName === prevProps.game.currentPlayerName;
    const isCurrentPlayer =
      this.props.game.playerName === this.props.game.currentPlayerName;

    if (!wasCurrentPlayer && isCurrentPlayer) {
      this.canvasManager.activate();
      return;
    }

    if (wasCurrentPlayer && !isCurrentPlayer) {
      this.canvasManager.deactivate();
    }
  }

  componentWillUnmount() {
    // window.removeEventListener("load", this.handleLoad);
    window.removeEventListener("resize", this.resizeCanvas);
  }

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
    this.canvasManager.resizeView(canvasContainerElement.clientWidth);
    paper.view.viewSize = new paper.Size(
      canvasElement.clientWidth,
      canvasElement.clientHeight
    );
    paper.view.update();
  };

  render() {
    return (
      <div>
        <div className="canvas" ref={this.paperContainerRef}>
          <canvas id="canvas" ref={this.paperRef}></canvas>

          {this.props.game.wordSelector && (
            <Selection
              selector={this.props.game.wordSelector}
              timeRemaining={this.props.game.wordSelectionTimeRemaining}
              type="word"
            />
          )}

          {this.props.game.drawbotageSelector && (
            <Selection
              selector={this.props.game.drawbotageSelector}
              timeRemaining={this.props.game.drawbotageSelectionTimeRemaining}
              type="drawbotage"
            />
          )}

          {this.props.game.wordChoices && (
            <WordChoices
              words={this.props.game.wordChoices}
              timeRemaining={this.props.game.wordSelectionTimeRemaining}
              onWordSelection={this.props.onWordSelection}
            />
          )}
        </div>
        <div className="row no-gutters mt-3">
          {this.props.disabled ? (
            <Toolbar
              strokeColors={this.strokeColors}
              onColorOptionClick={() => {}}
              onSmallSizeClick={() => {}}
              onMediumSizeClick={() => {}}
              onLargeSizeClick={() => {}}
              onDrawClick={() => {}}
              onEraserClick={() => {}}
              onClearClick={() => {}}
              onFillClick={() => {}}
            />
          ) : (
            <Toolbar
              strokeColors={this.strokeColors}
              activeStrokeColor={this.state.strokeColor}
              activeSizeSelection={this.state.sizeSelection}
              activeTool={this.state.activeTool}
              onColorOptionClick={(strokeColor) => {
                this.canvasManager.strokeColor = strokeColor;
                this.setState({ strokeColor });
                connection.emit("setColor", { strokeColor });
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
              onDrawClick={() => {
                this.canvasManager.drawingTool.activate();
                this.setState({ activeTool: this.canvasManager.activeTool });
              }}
              onEraserClick={() => {
                this.canvasManager.eraserTool.activate();
                this.setState({ activeTool: this.canvasManager.activeTool });
              }}
              onClearClick={() => {
                this.canvasManager.clearTool.clear();
              }}
              onFillClick={() => {
                this.canvasManager.fillTool.fill();
              }}
              onReverseClick={() => {
                this.canvasManager.hideTool.activate();
              }}
            />
          )}
        </div>
      </div>
    );
  }
}

export default Canvas;
