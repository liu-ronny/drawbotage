import io from "socket.io-client";

/**
 * Manages a SocketIO client socket and its interactions with the server socket.
 * The Connection syncs the client state with the server state by dispatching events to a reducer.
 */
class Connection {
  constructor() {
    this.socket = null;
  }

  open() {
    this.socket = io("http://localhost:8080");
  }

  close() {
    this.socket.close();
    this.socket = null;
  }

  subscribe(dispatch, info) {
    this.socket.on("info", (data) => {
      data.type = "UPDATE_GAME_INFO";
      dispatch(data);
    });

    this.socket.on("disconnect", (reason) => {
      dispatch({
        type: "DISCONNECT",
        message: "The connection to the server has been disconnected",
      });
    });

    this.socket.on("error", (data) => {
      dispatch({
        type: "DISCONNECT",
        message: data.message,
      });
    });

    this.socket.on("startGame", (data) => {
      data.type = "START_GAME";
      dispatch(data);
    });

    this.socket.on("gameStarting", (data) => {
      data.type = "GAME_STARTING";
      dispatch(data);
    });

    this.socket.on("startGameplay", (data) => {
      data.type = "START_GAMEPLAY";
      dispatch(data);
    });

    this.socket.on("setCurrentPlayer", (data) => {
      data.type = "SET_CURRENT_PLAYER";
      dispatch(data);
    });

    this.socket.on("waitForWordSelection", (data) => {
      data.type = "WAIT_FOR_WORD_SELECTION";
      dispatch(data);
    });

    this.socket.on("waitForDrawbotageSelection", (data) => {
      data.type = "WAIT_FOR_DRAWBOTAGE_SELECTION";
      dispatch(data);
    });

    this.socket.on("selectWord", (data, respondWithWord) => {
      dispatch({
        type: "SELECT_WORD",
        respondWithWord,
        wordChoices: data.words,
        timeRemaining: data.timeRemaining,
      });
    });

    this.socket.on("selectDrawbotage", (data, respondWithDrawbotage) => {
      dispatch({
        type: "SELECT_DRAWBOTAGE",
        respondWithDrawbotage,
        timeRemaining: data.timeRemaining,
      });
    });

    this.socket.on("selectWordTimer", (data) => {
      data.type = "SELECT_WORD_TIMER";
      dispatch(data);
    });

    this.socket.on("selectDrawbotageTimer", (data) => {
      data.type = "SELECT_DRAWBOTAGE_TIMER";
      dispatch(data);
    });

    this.socket.on("wordSelection", (data) => {
      data.type = "WORD_SELECTION";
      dispatch(data);
    });

    this.socket.on("drawbotageSelection", (data) => {
      data.type = "DRAWBOTAGE_SELECTION";
      dispatch(data);
    });

    this.socket.on("hideDrawbotageSelection", (data) => {
      dispatch({
        type: "HIDE_DRAWBOTAGE_SELECTION",
      });
    });

    this.socket.on("guessTimer", (data) => {
      data.type = "GUESS_TIMER";
      dispatch(data);
    });

    this.socket.on("endTurn", (data) => {
      this.canvas.canvasManager.clearTool.clear();

      data.type = "END_TURN";
      dispatch(data);
    });

    this.socket.on("hideTurnResult", (data) => {
      dispatch({
        type: "SCORE_UPDATE_VIEWED",
      });
    });

    this.socket.on("message", (data) => {
      data.type = "RECEIVE_MESSAGE";
      dispatch(data);
    });

    this.socket.on("endGame", (data) => {
      data.type = "END_GAME";
      dispatch(data);
    });

    const { joinRoom, playerName, roomId, rounds, drawTime } = info;
    const event = joinRoom ? "joinGame" : "createGame";
    this.socket.emit(event, { playerName, roomId, rounds, drawTime });
  }

  attachCanvas(canvasComponent) {
    this.canvas = canvasComponent;

    this.socket.on("setColor", (data) => {
      const canvasManager = this.canvas.canvasManager;
      canvasManager.strokeColor = data.strokeColor;
    });

    // this.socket.on("setSize", (data) => {
    //   this.canvas.setState({ sizeSelection: data.size });
    // });

    this.socket.on("drawingTool", this._applyDrawEvent("drawingTool"));

    this.socket.on("eraserTool", (data) => {
      const { functionName, relativePoint, relativeEraserSize } = data;
      const canvasManager = this.canvas.canvasManager;
      const event = { point: canvasManager.getAbsolutePoint(relativePoint) };
      const eraserSize = canvasManager.getAbsoluteEraserSize(
        relativeEraserSize
      );

      canvasManager.eraseLayer.activate();
      if (functionName === "_erase") {
        canvasManager.eraserTool.erase(event, eraserSize);
      } else if (functionName === "rasterizeAfterErase") {
        canvasManager.eraserTool[functionName](event, false);
      }
    });

    this.socket.on("clearTool", () => {
      this.canvas.canvasManager.clearTool.clear();
    });

    this.socket.on("fillTool", () => {
      this.canvas.canvasManager.fillTool.fill();
    });

    this.socket.on("reverseTool", this._applyDrawEvent("reverseTool"));
    this.socket.on("colorTool", this._applyDrawEvent("colorTool"));
    this.socket.on("hideTool", this._applyDrawEvent("hideTool"));
  }

  _applyDrawEvent = (toolName) => {
    return (data) => {
      const { functionName, relativePoint, relativeStrokeWidth } = data;
      const canvasManager = this.canvas.canvasManager;

      canvasManager.drawLayer.activate();
      canvasManager.strokeWidth = canvasManager.getAbsoluteStrokeWidth(
        relativeStrokeWidth
      );

      canvasManager[toolName][functionName]({
        point: canvasManager.getAbsolutePoint(relativePoint),
      });
    };
  };

  /**
   * Emits an event to the server socket.
   * If a callback is provided, the event will be emitted with acknowledgements.
   * @param {string} event - The name of the event to emit
   * @param {object} data - The data to emit with the event
   */
  emit(event, data) {
    this.socket.emit(event, data);
  }
}

const connection = new Connection();

export default connection;
