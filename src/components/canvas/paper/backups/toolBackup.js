class Tool {
  constructor(paper, canvasComponent, canvasManager) {
    this.paper = paper;
    this.canvasComponent = canvasComponent;
    this.canvasManager = canvasManager;
    this.path = null;
    this.tool = new paper.Tool();
  }

  _boundsChecker = (fn) => {
    return (event) => {
      if (event.event.target.id === "canvas") {
        fn(event);
      }
    };
  };

  _enableBoundsCheckingFor = (fns) => {
    for (let fn of fns) {
      if (this[fn]) {
        this[fn] = this._boundsChecker(this[fn]);
      }
    }
  };

  /**
   * Converts the active layer's paths into an image. If there is an existing path, it will be removed from the view.
   * @param {ToolEvent} event
   */
  _rasterize = () => {
    const canvasManager = this.canvasManager;
    const width = this.paper.project.view.size.width;
    const factor = canvasManager.maxWidth / width;

    if (this.path) {
      this.path.strokeWidth *= factor;
    }

    this.paper.project.activeLayer.scale(factor, [0, 0]);

    const newRaster = this.paper.project.activeLayer.rasterize();
    canvasManager.maxRaster = newRaster.clone({ insert: false });

    const raster = canvasManager.raster;
    if (raster) {
      raster.remove();
    }

    canvasManager.raster = newRaster;

    if (this.path) {
      this.path.remove();
    }

    newRaster.scale(1 / factor, [0, 0]);
  };

  activate = () => {
    this.tool.activate();
  };
}

export default Tool;
