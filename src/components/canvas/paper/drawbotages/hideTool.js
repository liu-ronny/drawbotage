import Tool from "../tool";

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

    this._enableBoundsCheckingFor(["_draw", "_addPoint"]);
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
