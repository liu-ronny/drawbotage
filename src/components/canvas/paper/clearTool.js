/**
 * A tool that allows the user to clear the view in the specified PaperScope.
 */
class ClearTool {
  /**
   * Creates a tool that allows the user to clear the view in the specified PaperScope.
   * @param {PaperScope} paper - The PaperScope that the tool belongs to
   * @param {CanvasManager} canvasManager - The CanvasManager that contains all the tools in the specified PaperScope
   */
  constructor(paper, canvasManager) {
    this.paper = paper;
    this.canvasManager = canvasManager;
  }

  /**
   * Clears both the draw layer and the erase layer.
   * @param {ToolEvent} event - The ToolEvent provided by Paper JS
   */
  clear() {
    this.canvasManager.drawLayer.removeChildren();
    this.canvasManager.eraseLayer.removeChildren();
    this.paper.view.update();
  }
}

export default ClearTool;
