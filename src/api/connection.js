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
    if (!this.socket) {
      this.socket = io("http://localhost:8080");
    }
  }

  close() {
    if (this.socket) {
      this.socket.close();
    }

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
      data.type = "UPDATE_GAME_INFO";
      dispatch(data);
      dispatch({ type: "START_GAME" });
    });

    this.socket.on("setCurrentPlayer", (data) => {
      data.type = "SET_CURRENT_PLAYER";
      dispatch(data);
    });

    this.socket.on("waitForWordSelection", (data) => {
      data.type = "WAIT_FOR_WORD_SELECTION";
      dispatch(data);
    });

    this.socket.on("selectWord", (data, respondWithWord) => {
      dispatch({
        type: "SELECT_WORD",
        respondWithWord,
        wordChoices: data,
      });
    });

    this.socket.on("selectWordTimer", (data) => {
      data.type = "SELECT_WORD_TIMER";
      dispatch(data);
    });

    this.socket.on("wordSelection", (data) => {
      data.type = "WORD_SELECTION";
      dispatch(data);
    });

    const { joinRoom, playerName, roomId, rounds, drawTime } = info;
    const event = joinRoom ? "joinGame" : "createGame";
    this.socket.emit(event, { playerName, roomId, rounds, drawTime });
  }

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
