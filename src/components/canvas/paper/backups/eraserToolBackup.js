import Tool from "../tool";
import { Size, project } from "paper";

class EraserTool extends Tool {
  constructor(paper, canvasComponent, canvasManager) {
    super(paper, canvasComponent, canvasManager);

    const eraserOutlinePath = new paper.Path.Rectangle({
      point: [0, 0],
      size: [200, 100],
      strokeColor: "black",
      fillColor: "#FFFFFF",
    });
    const eraserPath = new paper.Path.Rectangle({
      point: [0, 0],
      size: [200, 100],
      strokeColor: "#FFFFFF",
      fillColor: "#FFFFFF",
    });

    this.eraserPaths = [];
    this.maxEraserPaths = 200;
    this.eraserOutlineSymbol = new paper.SymbolDefinition(eraserOutlinePath);
    this.eraserSymbol = new paper.SymbolDefinition(eraserPath);
    this.currentOutline = null;

    this._enableBoundsCheckingFor(["_placeOutline", "_erase"]);

    this.tool.onMouseMove = this._displayEraser;
    this.tool.onMouseDown = this._erase;
    this.tool.onMouseDrag = this._erase;
    this.tool.onMouseUp = this._rasterizeAfterErase;
  }

  /**
   * Places the current eraserSymbol at the event point. This has the effect of "erasing" the part of the canvas covered by the symbol.
   * Because erasing adds additional items to the active layer, we optimize for performance by rasterizing after each erase to maintain a consistent FPS.
   * @param {ToolEvent} event
   */
  _erase = (event) => {
    this._removeOutline();

    const instance = this.eraserSymbol.place(event.point);
    this.eraserPaths.push(instance);

    // rasterize if the number of eraser paths exceeds a certain limit
    // such a situation is caused by a user dragging the eraser too long without triggering a mouseup event
    if (this.eraserPaths.length >= this.maxEraserPaths) {
      this._rasterizeAfterErase(event);
    }

    this._displayEraser(event);
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
  _rasterizeAfterErase = (event, displayAfter = true) => {
    this._removeOutline();
    this._rasterize();

    for (let eraserPath of this.eraserPaths) {
      eraserPath.remove();
    }

    this.eraserPaths = [];

    if (displayAfter) {
      this._displayEraser(event);
    }
  };
}

export default EraserTool;
