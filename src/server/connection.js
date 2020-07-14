const io = require("socket.io");
const Room = require("./room");

class Connection {
  constructor(server) {
    this.io = io(server);
    this.io.set("origins", "http://localhost:3000/");
    this.rooms = new Map();
    this.attachListeners();
  }

  attachListeners() {
    this.io.sockets.on("connection", (socket) => {
      socket.on("createGame", (data) => {
        if (this.rooms.has(data.roomId)) {
          // this.emitError(
          //   socket,
          //   "The host disconnected while creating a game.",
          //   data.roomId
          // );
          return;
        }

        const room = new Room(this, data.roomId, data.rounds, data.drawTime);
        room.add(data.playerName, socket);
        room.setHost(data.playerName, socket);
        this.rooms.set(data.roomId, room);
        this.joinRoom(data, socket);

        this.emitInfo(data.roomId);
      });

      socket.on("joinGame", (data) => {
        if (!this.rooms.has(data.roomId)) {
          this.emitError(
            socket,
            "Something went wrong when attempting to join the game. Please try again."
          );
          return;
        }

        const room = this.rooms.get(data.roomId);
        room.add(data.playerName, socket);
        this.joinRoom(data, socket);

        this.emitInfo(data.roomId);
      });

      socket.on("updateTeams", (data) => {
        if (!this.rooms.has(data.roomId)) {
          this.emitError(
            socket,
            "Something went wrong while the host attempted to update the teams. Please try again.",
            data.roomId
          );
          return;
        }

        const room = this.rooms.get(data.roomId);
        room.updateTeams(
          data.playerName,
          data.newTeamName,
          data.insertPosition
        );

        this.emitInfo(data.roomId);
      });

      socket.on("updateSettings", (data) => {
        if (!this.rooms.has(data.roomId)) {
          this.emitError(
            socket,
            "Something went wrong while the host attempted to update the settings. Please try again.",
            data.roomId
          );
          return;
        }

        const room = this.rooms.get(data.roomId);
        room.updateSettings(data.settingName, data.settingValue);

        this.emitInfo(data.roomId);
      });

      socket.on("startGame", (data) => {
        if (!this.rooms.has(data.roomId)) {
          this.emitError(
            socket,
            "Unable to start the game. Please try again.",
            data.roomId
          );
          return;
        }

        const room = this.rooms.get(data.roomId);
        this.io.to(data.roomId).emit("startGame", room.info());
      });

      socket.on("leaveGame", (data) => {
        if (!this.rooms.has(data.roomId)) {
          return;
        }

        const room = this.rooms.get(data.roomId);
        room.remove(data.playerName);
        socket.leave(data.roomId);

        if (room.size() === 0) {
          this.rooms.delete(socket.roomId);
          return;
        }

        this.emitInfo(data.roomId);
      });

      socket.on("disconnect", () => {
        if (!this.rooms.has(socket.roomId)) {
          return;
        }

        const room = this.rooms.get(socket.roomId);
        room.remove(socket.playerName);
        socket.leave(socket.roomId);

        if (room.size() === 0) {
          this.rooms.delete(socket.roomId);
          return;
        }

        this.emitInfo(socket.roomId);
      });
    });
  }

  contains(roomId) {
    return this.rooms.has(roomId);
  }

  emitInfo(roomId) {
    const room = this.rooms.get(roomId);
    this.io.to(roomId).emit("info", room.info());
  }

  emitError(socket, message, roomId) {
    if (roomId) {
      this.io.to(roomId).emit("error", { message });
    } else {
      socket.emit("error", { message });
    }
  }

  joinRoom(data, socket) {
    socket.playerName = data.playerName;
    socket.roomId = data.roomId;
    socket.join(data.roomId);
  }
}

module.exports = Connection;
