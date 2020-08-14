import Tool from "../tool";
import connection from "../../../../api/connection";

/**
 * A tool that draws reversed paths in the specified PaperScope.
 * A reversed path is a path that is rotated 180 degrees.
 */
class ReverseTool extends Tool {
  /**
   * Creates a tool that draws reversed paths in the specified PaperScope.
   * @param {PaperScope} paper - The PaperScope that the tool belongs to
   * @param {CanvasManager} canvasManager - The CanvasManager that contains all the tools in the specified PaperScope
   * @property {Point} prevPoint - The last Paper JS Point added to the project.
   */
  constructor(paper, canvasManager) {
    super(paper, canvasManager);
    this.prevPoint = null;

    this._preserveFunctions(["_draw", "_addPoint", "_recordPath"]);
    this._enableBoundsCheckingFor(["_draw", "_addPoint"]);

    for (let name of ["_draw", "_recordPath"]) {
      this["_emit_" + name] = (handler) => {
        return (event) => {
          handler(event);

          connection.emit("reverseTool", {
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
    this.tool.onMouseUp = this._recordPath;
  }

  /**
   * Checks whether a point is out of bounds with respect to the current view.
   * @param {Point} - The Paper JS Point to check
   * @returns {boolean} - true if the Point is out of bounds, or false otherwise
   */
  _isOutOfBounds = (point) => {
    const x = point.x;
    const y = point.y;
    const bounds = this.paper.project.view.bounds;

    return (
      x < bounds.x ||
      x > bounds.x + bounds.width ||
      y < bounds.y ||
      y > bounds.y + bounds.height
    );
  };

  /**
   * Creates a new path using the current strokeColor and strokeWidth.
   * @param {ToolEvent} event - The ToolEvent provided by Paper JS
   */
  _draw = (event) => {
    this.path = new this.paper.Path();
    this._setPathProperties();
    this.path.add(event.point);
    this.prevPoint = event.point;
  };

  /**
   * Adds the point rotated by 180 degrees to the current path.
   * @param {ToolEvent} event - The ToolEvent provided by Paper JS
   */
  _addPoint = (event) => {
    const reversed = this._getReversedPoint(event);

    // disallow any points that are out of bounds to be added to the path
    if (this._isOutOfBounds(reversed)) {
      return;
    }

    this.prevPoint = reversed;
    this.path.add(reversed);
  };

  _emit__addPoint = (handler) => {
    return (event) => {
      const reversed = this._getReversedPoint(event);

      handler(event);

      connection.emit("reverseTool", {
        functionName: "addPoint",
        relativePoint: this.canvasManager.getRelativePoint(reversed),
      });
    };
  };

  _getReversedPoint = (event) => {
    const step = event.delta;
    const rotated = step.rotate(180);
    return this.prevPoint.add(rotated);
  };

  addPoint = (event) => {
    this.path.add(event.point);
  };

  /**
   * Activates the corresponding Tool in the current PaperScope. Ensures that
   * new paths are added to the draw layer.
   * @override
   */
  activate = () => {
    this.tool.activate();
    this.canvasManager.activeTool = "reverse";
    this.canvasManager.drawLayer.activate();
  };
}

export default ReverseTool;
