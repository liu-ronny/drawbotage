/**
 * A wrapper around the Paper JS Tool object. It provides utilities for bounds
 * checking, manipulating paths, and emitting events.
 */
class Tool {
  /**
   * Creates a wrapper around the Paper JS Tool object in the specified PaperScope.
   * @param {PaperScope} paper - The PaperScope that the tool belongs to
   * @param {CanvasManager} canvasManager - The CanvasManager that contains all the tools in the specified PaperScope
   * @property {PaperScope} paper - The PaperScope that the tool belongs to
   * @property {CanvasManager} canvasManager - The CanvasManager that contains all the tools in the specified PaperScope
   * @property {Path} path - The current path
   * @property {Array} paths - An array that contains all SVG paths drawn using the tool
   * @property {Tool} tool - The underlying Paper JS Tool object
   */
  constructor(paper, canvasManager) {
    this.paper = paper;
    this.canvasManager = canvasManager;
    this.path = null;
    this.paths = [];
    this.tool = new paper.Tool();
  }

  /**
   * Returns a decorated event handler that only runs if the corresponding event
   * is fired from within the underlying canvas element. Requires the element to
   * have an HTML id of "canvas".
   * @param {function} handler
   */
  _boundsChecker = (handler) => {
    return (event) => {
      if (event.event.target.id === "canvas") {
        handler(event);
      }
    };
  };

  /**
   * Turns any valid handler in a list of handler names into a bounds checker.
   * @param {string[]} handlers - An array of handler names to apply bounds checking for
   */
  _enableBoundsCheckingFor = (handlers) => {
    for (let handler of handlers) {
      if (this[handler]) {
        this[handler] = this._boundsChecker(this[handler]);
      }
    }
  };

  /**
   * Specifies properties for the current path.
   */
  _setPathProperties = () => {
    if (this.path) {
      this.path.strokeColor = this.canvasManager.strokeColor;
      this.path.strokeWidth = this.canvasManager.strokeWidth;
    }
  };

  /**
   * Caches the current path.
   */
  _recordPath = () => {
    if (this.path) {
      this.paths.push(this.path);
    }
  };

  /**
   * Activates the tool. This is an empty implementation that is overrided as necessary by child classes.
   * @interface
   */
  activate = () => {};
}

export default Tool;
