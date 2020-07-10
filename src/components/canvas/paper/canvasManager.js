import DrawingTool from "./drawingTool";
import EraserTool from "./eraserTool";
import ClearTool from "./clearTool";
import FillTool from "./fillTool";

/**
 * Represents a toolbox containing tools available in a paperScope.
 */
class CanvasManager {
  constructor(paper, canvasComponent, defaults) {
    this.paper = paper;
    this.canvasComponent = canvasComponent;
    this.strokeColor = defaults.strokeColor;
    this.strokeWidth = defaults.strokeWidth;
    this.eraserSizes = defaults.eraserSizes;

    this.drawLayer = paper.project.activeLayer;
    this.eraseLayer = new paper.Layer();
    this.drawingTool = new DrawingTool(paper, canvasComponent, this);
    this.eraserTool = new EraserTool(paper, canvasComponent, this);
    this.clearTool = new ClearTool(paper, canvasComponent, this);
    this.fillTool = new FillTool(paper, canvasComponent, this);

    this.drawingTool.activate();
  }

  set eraserSize(size) {
    this.eraserTool.setEraserSize(size);
  }

  resizeView = (currentWidth) => {
    if (this.prevWidth) {
      const factor = currentWidth / this.prevWidth;
      this.prevWidth = currentWidth;

      const paths = this.drawingTool.paths;
      if (paths) {
        for (let path of paths) {
          path.strokeWidth *= factor;
        }
      }

      this.drawLayer.scale(factor, [0, 0]);
      this.eraseLayer.scale(factor, [0, 0]);
    } else {
      this.prevWidth = currentWidth;
    }
  };
}

export default CanvasManager;
