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
    this.socket.on("playerNames", (data) => {
      this.component.setState({
        host: data.host,
        bluePlayerNames: data.playerNames.blue,
        redPlayerNames: data.playerNames.red,
        unassignedPlayerNames: data.playerNames.unassigned,
      });
    });

    this.socket.on("settings", (data) => {
      this.component.setState({
        rounds: data.rounds,
        drawTime: data.drawTime,
      });
    });

    this.socket.on("addPlayer", (data) => {
      this.component.updateTeams(data.team, Infinity, data.name, false);
    });

    this.socket.on("removePlayer", (data) => {
      this.component.removePlayerAndUpdate(data.name);
    });

    const event = this.component.props.location.state.create
      ? "create"
      : "join";
    this.socket.emit(event, {
      team: "unassigned",
      name: this.component.props.location.state.name,
      roomID: this.component.props.location.state.roomID,
      rounds: this.component.state.rounds,
      drawTime: this.component.state.drawTime,
    });
  }

  removePlayer(obj) {
    this.socket.emit("removePlayer", obj);
  }

  updateTeams(obj) {
    this.socket.emit("updateTeams", obj);
  }

  updateSettings(obj) {
    this.socket.emit("updateSettings", obj);
  }

  leave(obj) {
    this.socket.emit("leave", obj);
  }
}

const connection = new Connection();

export default connection;
