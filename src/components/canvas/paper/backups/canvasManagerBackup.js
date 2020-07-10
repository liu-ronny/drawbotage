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

    const { strokeColor, strokeWidth } = defaults;

    this.strokeColor = strokeColor;
    this.strokeWidth = strokeWidth;
    this.raster = null;
    this.maxRaster = null;
    this.maxWidth = 2000;
    this.drawingTool = new DrawingTool(paper, canvasComponent, this);
    this.eraserTool = new EraserTool(paper, canvasComponent, this);
    this.clearTool = new ClearTool(paper, canvasComponent, this);
    this.fillTool = new FillTool(paper, canvasComponent, this);

    this.drawingTool.activate();
  }

  resizeRaster = () => {
    if (this.raster) {
      const width = this.paper.project.view.size.width;
      const factor = this.maxWidth / width;

      this.raster.remove();
      this.raster = this.maxRaster.clone();
      this.paper.project.activeLayer.addChild(this.raster);
      this.raster.scale(1 / factor, [0, 0]);
    }
  };
}

export default CanvasManager;
