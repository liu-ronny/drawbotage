import Tool from "./tool";

/**
 * A tool that allows the user to erase in the specified PaperScope.
 */
class EraserTool extends Tool {
  /**
   * Creates a tool that allows the user to erase in the specified PaperScope.
   * @param {*} paper - The PaperScope that the tool belongs to
   * @param {*} canvasManager - The CanvasManager that contains all the tools in the specified PaperScope
   * @property {number} symbolCount - The current number of eraser symbols in the erase layer
   * @property {number} maxSymbolCount - The max number of eraser symbols that can be placed in erase layer before it is rasterized
   * @property {SymbolItem} currentOutline - The last placed instance of the relevant eraser outline SymbolDefinition
   * @property {object} symbols - An object that contains an outline and eraser SymbolDefinition for each eraser size
   * @property {SymbolDefinition} eraserOutlineSymbol - The outline definition for the currently selected eraser size
   * @property {SymbolDefinition} eraserSymbol - The definition for the currently selected eraser size
   */
  constructor(paper, canvasManager, eraserSizes) {
    super(paper, canvasManager);

    this.symbolCount = 0;
    this.maxSymbolCount = 200;
    this.currentOutline = null;

    this.symbols = this._createEraserSymbols(eraserSizes);
    this.eraserOutlineSymbol = this.symbols.smallEraserSizeOutlineSymbol;
    this.eraserSymbol = this.symbols.smallEraserSizeSymbol;

    this._enableBoundsCheckingFor(["_placeOutline", "_erase"]);
    this.tool.onMouseMove = this._displayEraser;
    this.tool.onMouseDown = this._erase;
    this.tool.onMouseDrag = this._erase;
    this.tool.onMouseUp = this.rasterizeAfterErase;
  }

  /**
   * Creates an outline and eraser SymbolDefinition for each provided size.
   * @param {{smallEraserSize: [width, length], mediumEraserSize: [width, length], largeEraserSize: [width, length]}} sizes - The sizes of the erasers to create
   * @returns An object containing the created symbols
   */
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

  /**
   * Sets the selected eraser size
   * @param {string} size - The size to set for the eraser. One of "small", "medium", or "large".
   */
  setEraserSize = (size) => {
    this.eraserOutlineSymbol = this.symbols[size + "EraserSizeOutlineSymbol"];
    this.eraserSymbol = this.symbols[size + "EraserSizeSymbol"];
  };

  /**
   * Places an instance of the current eraser symbol at the event point. This has the effect of "erasing" the part of the canvas covered by the symbol.
   * @param {ToolEvent} event - The ToolEvent provided by Paper JS
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
  };

  /**
   * Removes the current outline.
   */
  _removeOutline = () => {
    if (this.currentOutline) {
      this.currentOutline.remove();
      this.currentOutline = null;
    }
  };

  /**
   * Places an instance of the current eraser outline symbol at the point in the provided event.
   * @param {ToolEvent} event - The ToolEvent provided by Paper JS
   */
  _placeOutline = (event) => {
    const instance = this.eraserOutlineSymbol.place(event.point);
    this.currentOutline = instance;
  };

  /**
   * Displays the eraser on the underlying canvas.
   * @param {ToolEvent} event - The ToolEvent provided by Paper JS
   */
  _displayEraser = (event) => {
    this._removeOutline();
    this._placeOutline(event);
  };

  /**
   * Converts the erase layer's paths into an image, which is then inserted into the draw layer.
   * The existing paths in the erase layer are cleared afterward.
   * @param {ToolEvent} event - The ToolEvent provided by Paper JS
   * @param {boolean} displayAfter - Whether to display the eraser outline after rasterization
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

  /**
   * Activates the corresponding Tool in the current PaperScope. Ensures that
   * new paths are added to the erase layer.
   * @override
   */
  activate = () => {
    this.tool.activate();
    this.canvasManager.activeTool = "eraser";
    this.canvasManager.eraseLayer.activate();
  };
}

export default EraserTool;
