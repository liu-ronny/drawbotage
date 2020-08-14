import Tool from "../tool";
import connection from "../../../../api/connection";

/**
 * A tool that draws hidden paths in the specified PaperScope.
 * After each path is drawn, the previous path will become invisible.
 */
class HideTool extends Tool {
  /**
   * Creates a tool that draws hidden paths in the specified PaperScope.
   * @param {PaperScope} paper - The PaperScope that the tool belongs to
   * @param {CanvasManager} canvasManager - The CanvasManager that contains all the tools in the specified PaperScope
   * @property {Path} prevPath - The last Paper JS Path added to the project.
   */
  constructor(paper, canvasManager) {
    super(paper, canvasManager);
    this.prevPath = null;

    const fnNames = ["_draw", "_addPoint", "_hidePrevPath"];
    this._preserveFunctions(fnNames);
    this._enableBoundsCheckingFor(fnNames.slice(0, 2));
    this._bindHandlers();

    for (let name of fnNames) {
      this["_emit_" + name] = (handler) => {
        return (event) => {
          handler(event);

          if (name === "_hidePrevPath") {
            name = "_recordPath";
          }

          connection.emit("hideTool", {
            functionName: name,
            relativePoint: this.canvasManager.getRelativePoint(event.point),
            relativeStrokeWidth: this.canvasManager.getRelativeStrokeWidth(),
          });
        };
      };
    }
  }

  _bindHandlers() {
    this.tool.onMouseDown = this._draw;
    this.tool.onMouseDrag = this._addPoint;
    this.tool.onMouseUp = this._hidePrevPath;
  }

  /**
   * Creates a new path using the current strokeColor and strokeWidth.
   * @param {ToolEvent} event - The ToolEvent provided by Paper JS
   */
  _draw = (event) => {
    this.path = new this.paper.Path();
    this._setPathProperties();
    this.path.add(event.point);
  };

  /**
   * Adds the point to the current path.
   * @param {ToolEvent} event - The ToolEvent provided by Paper JS
   */
  _addPoint = (event) => {
    this.path.add(event.point);
  };

  /**
   * Hides the previous path in the view and sets the current path to be the previous path.
   */
  _hidePrevPath = () => {
    this._recordPath();

    if (this.prevPath) {
      this.prevPath.visible = false;
    }

    this.prevPath = this.path;
  };

  /**
   * Activates the corresponding Tool in the current PaperScope. Ensures that
   * new paths are added to the draw layer.
   * @override
   */
  activate = () => {
    this.tool.activate();
    this.canvasManager.activeTool = "hide";
    this.canvasManager.drawLayer.activate();
  };
}

export default HideTool;
