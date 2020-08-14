import Tool from "../tool";
import connection from "../../../../api/connection";

/**
 * A tool that draws paths using random colors in the specified PaperScope.
 */
class ColorTool extends Tool {
  /**
   * Creates a tool that draws paths using random colors in the specified PaperScope.
   * @param {PaperScope} paper - The PaperScope that the tool belongs to
   * @param {CanvasManager} canvasManager - The CanvasManager that contains all the tools in the specified PaperScope
   */
  constructor(paper, canvasManager) {
    super(paper, canvasManager);

    const fnNames = ["_draw", "_addPoint", "_recordPath"];
    this._preserveFunctions(fnNames);

    this._enableBoundsCheckingFor(fnNames.slice(0, 2));
    this._bindHandlers();

    for (let name of fnNames) {
      this["_emit_" + name] = (handler) => {
        return (event) => {
          handler(event);

          connection.emit("colorTool", {
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
   * Creates a new path using a random color.
   * @param {ToolEvent} event - The ToolEvent provided by Paper JS
   */
  _draw = (event) => {
    this.path = new this.paper.Path();
    this.path.strokeColor = {
      hue: Math.random() * 360,
      saturation: 0.4,
      brightness: 0.9,
    };
    this.path.strokeWidth = this.canvasManager.strokeWidth;
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
   * Activates the corresponding Tool in the current PaperScope. Ensures that
   * new paths are added to the draw layer.
   * @override
   */
  activate = () => {
    this.tool.activate();
    this.canvasManager.activeTool = "color";
    this.canvasManager.drawLayer.activate();
  };
}

export default ColorTool;
