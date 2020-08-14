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
   * @param {Function} handler
   * @returns {Function} The decorated handler
   */
  _boundsChecker(handler) {
    return (event) => {
      if (!event.event || event.event.target.id === "canvas") {
        handler(event);
      }
    };
  }

  /**
   * Turns any valid handler in an array of handler names into a bounds checker.
   * @param {string[]} handlers - An array of handler names to apply bounds checking for
   */
  _enableBoundsCheckingFor(handlers) {
    for (let handler of handlers) {
      if (this[handler]) {
        this[handler] = this._boundsChecker(this[handler]);
      }
    }
  }

  /**
   * Turns any valid handler in an array of handler names into an emitter. Emitters
   * are defined in child classes and must have the name '_emit_<handler name>'.
   * @param {string[]} handlers - An array of handler names to add emitter functionality to
   */
  _enableEmittersFor(handlers) {
    for (let handler of handlers) {
      if (this[handler]) {
        this[handler] = this["_emit_" + handler](this[handler]);
      }
    }
  }

  /**
   * Caches the current bindings of the specified functions in a property called
   * _originalFunctions.
   * @param {string[]} fns - The names of the functions to cache
   */
  _preserveFunctions(fns) {
    this._originalFunctions = {};

    for (let fn of fns) {
      if (this[fn]) {
        this._originalFunctions[fn] = this[fn];
      }
    }
  }

  /**
   * Restores any cached functions to point to their preserved references.
   */
  _restoreFunctions() {
    if (this._originalFunctions) {
      for (let [name, fn] of Object.entries(this._originalFunctions)) {
        this[name] = fn;
      }
    }
  }

  /**
   * Activates the tool. This is an empty implementation that is overrided as necessary by child classes.
   * @interface
   */
  activate() {}

  /**
   * Binds the relevant functions to the corresponding Paper JS event handlers.
   * This is an empty implementation that is overrided as necessary by child classes.
   * This function must be implemented for enableEmitters and disableEmitters to work.
   * @interface
   */
  _bindHandlers() {}

  /**
   * Turns all cached functions in the tool into emitters and re-binds
   * the decorated functions to their corresponding tool event handlers.
   * @param {boolean} [checkBounds] - Whether to enable bounds checking for the functions - true by default
   */
  enableEmitters(checkBounds = true) {
    const funcs = Object.keys(this._originalFunctions);

    this._restoreFunctions();
    this._enableEmittersFor(funcs);

    if (checkBounds) {
      this._enableBoundsCheckingFor(funcs);
    }

    this._bindHandlers();
  }

  /**
   * Reverts any emitter decorations made to all cached functions in the tool
   * and re-binds the decorated functions to their corresponding tool event handlers.
   * @param {boolean} [checkBounds] - Whether to enable bounds checking for the functions - true by default
   */
  disableEmitters(checkBounds = true) {
    const funcs = Object.keys(this._originalFunctions);

    this._restoreFunctions();

    if (checkBounds) {
      this._enableBoundsCheckingFor(funcs);
    }

    this._bindHandlers();
  }

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
}

export default Tool;
