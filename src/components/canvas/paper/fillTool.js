import Tool from "./tool";

/**
 * A tool that allows the user to fill the view in the specified PaperScope.
 */
class FillTool extends Tool {
  /**
   * Fills the background with the current strokeColor.
   */
  fill() {
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
  }
}

export default FillTool;
