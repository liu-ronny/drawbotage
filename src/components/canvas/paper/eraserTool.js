import Tool from "./tool";

class EraserTool extends Tool {
  constructor(paper, canvasComponent, canvasManager) {
    super(paper, canvasComponent, canvasManager);

    this.symbolCount = 0;
    this.maxSymbolCount = 200;
    this.currentOutline = null;

    this.symbols = this._createEraserSymbols(canvasManager.eraserSizes);
    this.eraserOutlineSymbol = this.symbols.smallEraserSizeOutlineSymbol;
    this.eraserSymbol = this.symbols.smallEraserSizeSymbol;

    this._enableBoundsCheckingFor(["_placeOutline", "_erase"]);
    this.tool.onMouseMove = this._displayEraser;
    this.tool.onMouseDown = this._erase;
    this.tool.onMouseDrag = this._erase;
    this.tool.onMouseUp = this.rasterizeAfterErase;
  }

  _createEraserSymbols = (sizes) => {
    const symbols = {};

    for (const [sizeName, size] of Object.entries(sizes)) {
      const eraserOutlinePath = new this.paper.Path.Rectangle({
        point: [0, 0],
        size,
        strokeColor: "black",
        fillColor: "#FFFFFF",
      });
      const eraserPath = new this.paper.Path.Rectangle({
        point: [0, 0],
        size,
        strokeColor: "#FFFFFF",
        fillColor: "#FFFFFF",
      });
      symbols[sizeName + "OutlineSymbol"] = new this.paper.SymbolDefinition(
        eraserOutlinePath
      );
      symbols[sizeName + "Symbol"] = new this.paper.SymbolDefinition(
        eraserPath
      );
    }

    return symbols;
  };

  setEraserSize = (size) => {
    this.eraserOutlineSymbol = this.symbols[size + "EraserSizeOutlineSymbol"];
    this.eraserSymbol = this.symbols[size + "EraserSizeSymbol"];
  };

  /**
   * Places the current eraserSymbol at the event point. This has the effect of "erasing" the part of the canvas covered by the symbol.
   * Because erasing adds additional items to the active layer, we optimize for performance by rasterizing after each erase to maintain a consistent FPS.
   * @param {ToolEvent} event
   */
  _erase = (event) => {
    this._removeOutline();
    this.eraserSymbol.place(event.point);
    this._displayEraser(event);
    this.symbolCount++;

    if (this.symbolCount > this.maxSymbolCount) {
      this.rasterizeAfterErase(event);
      this.symbolCount = 0;
    }

    // console.log(this.canvasManager.drawLayer.children);
    // console.log(this.canvasManager.eraseLayer.children);
  };

  /**
   * Removes the current outline from the active layer.
   */
  _removeOutline = () => {
    if (this.currentOutline) {
      this.currentOutline.remove();
      this.currentOutline = null;
    }
  };

  /**
   * Places an instance of the current eraser outline symbol at the provided point in the view.
   * @param {Point} point - a Paper JS point
   */
  _placeOutline = (event) => {
    const instance = this.eraserOutlineSymbol.place(event.point);
    this.currentOutline = instance;
  };

  /**
   * Displays the eraser to the screen.
   * @param {ToolEvent} event
   */
  _displayEraser = (event) => {
    this._removeOutline();
    this._placeOutline(event);
  };

  /**
   * Converts the active layer's paths into an image. This is an extension of rasterize() used to rasterize a newly erased activeLayer.
   * It removes the existing outline symbol and clears all stored eraser paths in memory.
   * @param {ToolEvent} event
   */
  rasterizeAfterErase = (event, displayAfter = true) => {
    const drawLayer = this.canvasManager.drawLayer;
    const eraseLayer = this.canvasManager.eraseLayer;

    this._removeOutline();

    const raster = eraseLayer.rasterize();
    eraseLayer.removeChildren();
    drawLayer.addChild(raster);

    if (displayAfter) {
      this._displayEraser(event);
    }
  };

  activate = () => {
    this.tool.activate();
    this.canvasManager.eraseLayer.activate();
  };
}

export default EraserTool;
