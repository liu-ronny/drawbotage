import DrawingTool from "./drawingTool";
import EraserTool from "./eraserTool";
import ClearTool from "./clearTool";
import FillTool from "./fillTool";
import ReverseTool from "./drawbotages/reverseTool";
import HideTool from "./drawbotages/hideTool";
import ColorTool from "./drawbotages/colorTool";
import BulldozeTool from "./drawbotages/bulldozeTool";

/**
 * Manages tools available in a PaperScope and serves as a central interface for
 * accessing them and for performing actions with them.
 */
class CanvasManager {
  /**
   * Creates a central object that manages the suite of tools available to the specified PaperScope.
   * @param {PaperScope} paper - The PaperScope object to manage
   * @param {object} defaults - Default options to set for the tools
   * @property {PaperScope} paper - The attached PaperScope
   * @property {string} strokeColor - The current strokeColor applied to new paths
   * @property {string} strokeColor - The current strokeWidth applied to new paths
   * @property {Layer} drawLayer - The Paper JS Layer that draw paths and rasterized erase layers are added to
   * @property {Layer} eraseLayer - The Paper JS Layer that erase paths are added to
   * @property {Tool} drawingTool - The tool that allows the user to draw in the specified PaperScope
   * @property {Tool} eraserTool - The tool that allows the user to erase in the specified PaperScope
   * @property {Tool} clearTool - The tool that allows the user to clear the view in the specified PaperScope
   * @property {Tool} fillTool - The tool that allows the user to fill the view in the specified PaperScope
   * @property {string} activeTool - The name of the tool that is currently activated
   */
  constructor(paper, defaults) {
    this.paper = paper;
    this.strokeColor = defaults.strokeColor;
    this.strokeWidth = defaults.strokeWidth;

    /*
    Configure an erase layer where all erase paths will go
    After every mouseup, the paths in the erase layer are rasterized and added
    as a single item to the draw layer 
     */
    this.drawLayer = paper.project.activeLayer;
    this.eraseLayer = new paper.Layer();

    this.disabledTool = new paper.Tool();
    this.drawingTool = new DrawingTool(paper, this);
    this.eraserTool = new EraserTool(paper, this, defaults.eraserSizes);
    this.clearTool = new ClearTool(paper, this);
    this.fillTool = new FillTool(paper, this);

    this.reverseTool = new ReverseTool(paper, this);
    this.hideTool = new HideTool(paper, this);
    this.colorTool = new ColorTool(paper, this);
    this.bulldozeTool = new BulldozeTool(paper, this);

    // this.drawingTool.activate();
    // this.activeTool = "drawing";
    this.disabledTool.activate();
    this.activeTool = "disabled";
  }

  /**
   * Sets the eraser size in the eraser tool.
   * @param {string} - The size to set for the eraser. One of "small", "medium", or "large".
   */
  set eraserSize(size) {
    this.eraserTool.setEraserSize(size);
  }

  /**
   * Resizes the PaperScope's view bounds according to the specified width.
   * This assumes that a constant aspect ratio is maintained in the underlying
   * canvas (i.e. width / length is always the same).
   * @param {number} currentWidth - The width to scale the view to.
   */
  resizeView = (currentWidth) => {
    if (this.prevWidth) {
      const factor = currentWidth / this.prevWidth;
      this.prevWidth = currentWidth;

      // scale the strokeWidth of each SVG path to maintain relative sizing
      const paths = this.drawingTool.paths;
      if (paths) {
        for (let path of paths) {
          path.strokeWidth *= factor;
        }
      }

      this.drawLayer.scale(factor, [0, 0]);
      this.eraseLayer.scale(factor, [0, 0]);
    } else {
      // set the initial width
      this.prevWidth = currentWidth;
    }
  };

  /**
   * Returns a relative point. The coordinates in the point specify the x and y
   * coordinates in relation to the width and height of the current view.
   * @param {Point} point
   * @returns {object}
   */
  getRelativePoint = (point) => {
    return {
      x: point.x / this.paper.project.view.size.width,
      y: point.y / this.paper.project.view.size.height,
    };
  };

  getRelativeEraserSize = (size) => {
    return {
      width: size.width / this.paper.project.view.size.width,
      height: size.height / this.paper.project.view.size.height,
    };
  };

  /**
   * Returns an absolute point given a relative point.
   * @param {Point} point
   * @returns {object}
   */
  getAbsolutePoint = (point) => {
    const viewWidth = this.paper.project.view.size.width;
    const viewHeight = this.paper.project.view.size.height;
    return new this.paper.Point(point.x * viewWidth, point.y * viewHeight);
  };

  getAbsoluteEraserSize = (size) => {
    const width = size.width * this.paper.project.view.size.width;
    const height = size.height * this.paper.project.view.size.height;
    return new this.paper.Size(width, height);
  };

  /**
   * Returns a relative stroke width. This is the size of the stroke width in
   * relation to the width of the current view.
   */
  getRelativeStrokeWidth = () => {
    return this.strokeWidth / this.paper.project.view.size.width;
  };

  /**
   * Returns an aboslute stroke width given a relative stroke width.
   * @param {number} relativeStrokeWidth - The ratio of stroke width to view size
   */
  getAbsoluteStrokeWidth = (relativeStrokeWidth) => {
    return relativeStrokeWidth * this.paper.project.view.size.width;
  };

  activate() {
    this.drawingTool.activate();

    this.drawingTool.enableEmitters();
    this.eraserTool.enableEmitters();
    this.clearTool.enableEmitters(false);
    this.fillTool.enableEmitters(false);

    this.reverseTool.enableEmitters();
    this.colorTool.enableEmitters();
    this.hideTool.enableEmitters();
  }

  deactivate() {
    this.disabledTool.activate();

    this.drawingTool.disableEmitters();
    this.eraserTool.disableEmitters();
    this.clearTool.disableEmitters(false);
    this.fillTool.disableEmitters(false);

    this.reverseTool.disableEmitters();
    this.colorTool.disableEmitters();
    this.hideTool.disableEmitters();
  }
}

export default CanvasManager;
