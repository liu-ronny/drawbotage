import io from "socket.io-client";

class Connection {
  constructor() {
    this.socket = io("http://localhost:8080");
  }

  attach(component) {
    this.component = component;
    this.setup();
  }

  setup() {
    this.socket.on("info", (data) => {
      this.component.setState(data);
    });

    const event = this.component.props.location.state.create
      ? "createGame"
      : "joinGame";
    this.socket.emit(event, {
      playerName: this.component.props.location.state.name,
      roomId: this.component.props.location.state.roomId,
      rounds: this.component.state.rounds,
      drawTime: this.component.state.drawTime,
    });
  }

  updateTeams(obj) {
    this.socket.emit("updateTeams", obj);
  }

  updateSettings(obj) {
    this.socket.emit("updateSettings", obj);
  }

  leaveGame(obj) {
    this.socket.emit("leaveGame", obj);
  }
}

const connection = new Connection();

export default connection;
