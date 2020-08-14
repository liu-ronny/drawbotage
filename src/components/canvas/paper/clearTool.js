import Tool from "./tool";
import connection from "../../../api/connection";

/**
 * A tool that allows the user to clear the view in the specified PaperScope.
 */
class ClearTool extends Tool {
  /**
   * Creates a tool that allows the user to clear the view in the specified PaperScope.
   * @param {PaperScope} paper - The PaperScope that the tool belongs to
   * @param {CanvasManager} canvasManager - The CanvasManager that contains all the tools in the specified PaperScope
   */
  constructor(paper, canvasManager) {
    super(paper, canvasManager);
    this._preserveFunctions(["clear"]);
  }

  /**
   * Clears both the draw layer and the erase layer.
   * @param {ToolEvent} event - The ToolEvent provided by Paper JS
   */
  clear = () => {
    this.canvasManager.drawLayer.removeChildren();
    this.canvasManager.eraseLayer.removeChildren();
    this.paper.view.update();
  };

  /**
   * Returns a decorated event handler that emits instructions to run the clear
   * function on a different client.
   * @param {Function} fn - The clear function, which will be provided as an argument
   * by _enableEmittersFor
   * @returns {Function} The decorated handler
   */
  _emit_clear = (fn) => {
    return () => {
      fn();
      connection.emit("clearTool", {});
    };
  };
}

export default ClearTool;
