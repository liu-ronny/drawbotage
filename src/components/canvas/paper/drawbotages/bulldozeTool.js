import Tool from "../tool";

/**
 * A tool that when activated, "bulldozes" through the project's view bounds and
 * erases a horizontal portion of it over some duration. The eraser and clear tools
 * should be disabled while bulldozing occurs.
 */
class BulldozeTool extends Tool {
  /**
   * Creates a tool that when activated, "bulldozes" through the project's view bounds and
   * erases a horizontal portion of it over some duration.
   * @param {PaperScope} paper - The PaperScope that the tool belongs to
   * @param {CanvasManager} canvasManager - The CanvasManager that contains all the tools in the specified PaperScope
   * @property {SymbolDefinition} rectOutlineSymbol - The outline definition for the bulldozing rectangle
   * @property {SymbolDefinition} rectSymbol - The definition for the bulldozing rectangle
   * @property {SymbolItem} rectOutlineInstance - The current instance of the rectOutlineSymbol
   * @property {number} width - The width of the bulldozing rectangle
   * @property {number} speed - The distance to move on each frame
   * @property {number} fractionOfBoundsHeight - The fraction of the view's height that the bulldozing rectangle should take up
   */
  constructor(paper, canvasManager) {
    super(paper, canvasManager);
    this.rectOutlineSymbol = null;
    this.rectSymbol = null;
    this.rectOutlineInstance = null;
    this.width = 100;
    this.speed = 7;
    this.fractionOfBoundsHeight = 1 / 5;
  }

  /**
   * Creates outline and rectangle symbols of the appropriate size and uses them
   * to erase a portion of the view.
   */
  _bulldoze = () => {
    const bounds = this.paper.project.view.bounds;
    const height = bounds.height * this.fractionOfBoundsHeight;
    const pos = this._getRandomInt(0, 4);
    this.height = height;

    const rectOutlinePath = new this.paper.Path.Rectangle({
      point: [0, 0],
      size: [this.width, height],
      strokeColor: "black",
      fillColor: "#FFFFFF",
    });
    const rectPath = new this.paper.Path.Rectangle({
      point: [0, 0],
      size: [this.width, height],
      strokeColor: "#FFFFFF",
      fillColor: "#FFFFFF",
    });

    this.rectOutlineSymbol = new this.paper.SymbolDefinition(rectOutlinePath);
    this.rectSymbol = new this.paper.SymbolDefinition(rectPath);

    this.rectOutlineInstance = this.rectOutlineSymbol
      .place(new this.paper.Point(0, height * pos + height / 2))
      .addTo(this.canvasManager.eraseLayer);
    this.paper.view.onFrame = this._moveRect;
  };

  /**
   * Moves the rectangle outline forward while placing rectangle instances along the way.
   */
  _moveRect = () => {
    const bounds = this.paper.project.view.bounds;

    // clean up after the bulldozing is complete
    if (this.rectOutlineInstance.position.x >= bounds.topRight.x) {
      this.rectOutlineInstance.remove();
      this.rectOutlineSymbol = null;
      this.rectSymbol = null;
      this.rectOutlineInstance = null;
      this.paper.view.onFrame = null;
      this._rasterize();
      return;
    }

    this.rectSymbol
      .place(this.rectOutlineInstance.position)
      .addTo(this.canvasManager.eraseLayer);
    this.rectOutlineInstance.position = this.rectOutlineInstance.position.add(
      new this.paper.Point(this.speed, 0)
    );
    this.rectOutlineInstance.bringToFront();
  };

  /**
   * Returns a random integer in the range [min, max]
   * @param {number} min - The smallest integer that can be returned
   * @param {number} max - The largest integer that can be returned
   * @returns {number} - A random integer in the specified range
   */
  _getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  /**
   * Converts the erase layer's paths into an image, which is then inserted into the draw layer.
   * The existing paths in the erase layer are cleared afterward.
   */
  _rasterize = () => {
    const drawLayer = this.canvasManager.drawLayer;
    const eraseLayer = this.canvasManager.eraseLayer;

    const raster = eraseLayer.rasterize();
    eraseLayer.removeChildren();
    drawLayer.addChild(raster);
  };

  /**
   * Calls the bulldoze method without activating the underlying tool.
   * @override
   */
  activate = () => {
    this.canvasManager.activeTool = "bulldoze";
    this._bulldoze();
  };
}

export default BulldozeTool;
