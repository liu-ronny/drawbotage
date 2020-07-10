import Tool from "../tool";

class DrawingTool extends Tool {
  constructor(paper, canvasComponent, canvasManager) {
    super(paper, canvasComponent, canvasManager);

    this._enableBoundsCheckingFor(["_draw", "_addPoint"]);
    this.tool.onMouseDown = this._draw;
    this.tool.onMouseDrag = this._addPoint;
    this.tool.onMouseUp = this._rasterize;
  }

  /**
   * Creates a new path with the currently selected path style properties.
   * @param {ToolEvent} event
   */
  _draw = (event) => {
    this.path = new this.paper.Path();
    this._setPathProperties();
    this.path.add(event.point);
  };

  /**
   * Adds the point to the current path.
   * @param {ToolEvent} event
   */
  _addPoint = (event) => {
    this.path.add(event.point);
  };

  _setPathProperties = () => {
    this.path.strokeColor = this.canvasManager.strokeColor;
    this.path.strokeWidth = this.canvasManager.strokeWidth;
  };
}

export default DrawingTool;
