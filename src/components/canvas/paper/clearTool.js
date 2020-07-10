class ClearTool {
  constructor(paper, canvasComponent, canvasManager) {
    this.paper = paper;
    this.canvasComponent = canvasComponent;
    this.canvasManager = canvasManager;
  }

  /**
   * Clears the active layer of the project.
   * @param {MouseEvent} event
   */
  clear() {
    this.canvasManager.drawLayer.removeChildren();
    this.canvasManager.eraseLayer.removeChildren();
    this.paper.view.update();
  }
}

export default ClearTool;
