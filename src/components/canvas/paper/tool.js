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

  activate = () => {
    this.tool.activate();
  };
}

export default Tool;
