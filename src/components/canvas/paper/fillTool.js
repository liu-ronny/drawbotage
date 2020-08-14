import Tool from "./tool";
import connection from "../../../api/connection";

/**
 * A tool that allows the user to fill the view in the specified PaperScope.
 */
class FillTool extends Tool {
  /**
   * Creates a tool that allows the user to fill the view in the specified PaperScope.
   * @param {PaperScope} paper - The PaperScope that the tool belongs to
   * @param {CanvasManager} canvasManager - The CanvasManager that contains all the tools in the specified PaperScope
   */
  constructor(paper, canvasManager) {
    super(paper, canvasManager);
    this._preserveFunctions(["fill"]);
  }

  /**
   * Fills the background with the current strokeColor.
   */
  fill = () => {
    this.canvasManager.clearTool.clear();

    const rect = new this.paper.Path.Rectangle({
      insert: false,
      point: [0, 0],
      size: this.paper.view.viewSize,
    });
    rect.fillColor = this.canvasManager.strokeColor;
    rect.addTo(this.canvasManager.eraseLayer);

    this.canvasManager.eraserTool.rasterizeAfterErase(undefined, false);
    rect.remove();
    this.paper.view.update();
  };

  /**
   * Returns a decorated event handler that emits instructions to run the fill
   * function on a different client.
   * @param {Function} fn - The fill function, which will be provided as an argument
   * by _enableEmittersFor
   * @returns {Function} The decorated handler
   */
  _emit_fill = (fn) => {
    return () => {
      fn();
      connection.emit("fillTool", {});
    };
  };
}

export default FillTool;
