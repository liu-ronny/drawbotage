import io from "socket.io-client";

class Connection {
  constructor() {
    this.socket = null;
    this.lobby = null;
    this.game = null;
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

  subscribeFromLobby(lobbyComponent) {
    this.lobby = lobbyComponent;
    this.setupLobby();
  }

  unsubscribeFromLobby() {
    if (this.socket) {
      this.socket.removeAllListeners();
    }

    this.lobby = null;
  }

  setupLobby() {
    this.socket.on("info", (data) => {
      this.lobby.setState(data);
    });

    this.socket.on("disconnect", () => {
      this.lobby.setState({
        disconnected: true,
        disconnectedMsg:
          "The connection to the server was disconnected. Please try again later.",
      });
    });

    this.socket.on("error", (data) => {
      this.lobby.setState({
        disconnected: true,
        disconnectedMsg: data.message,
      });
    });

    this.socket.on("startGame", (data) => {
      data.startGame = true;
      this.lobby.setState(data);
    });

    const event = this.lobby.props.location.state.create
      ? "createGame"
      : "joinGame";
    this.socket.emit(event, {
      playerName: this.lobby.props.location.state.name,
      roomId: this.lobby.props.location.state.roomId,
      rounds: this.lobby.state.rounds,
      drawTime: this.lobby.state.drawTime,
    });
  }

  updateTeams(obj) {
    this.socket.emit("updateTeams", obj);
  }

  updateSettings(obj) {
    this.socket.emit("updateSettings", obj);
  }

  startGame(obj) {
    this.socket.emit("startGame", obj);
  }

  leaveGame(obj) {
    this.socket.emit("leaveGame", obj);
  }
}

const connection = new Connection();

export default connection;
