const io = require("socket.io");

class Room {
  constructor(roomId, rounds, drawTime) {
    this.roomId = roomId;
    this.redPlayerNames = [];
    this.bluePlayerNames = [];
    this.unassignedPlayerNames = [];
    this.players = new Map();
    this.hostSocket = null;
    this.hostName = null;
    this.rounds = rounds;
    this.drawTime = drawTime;
  }

  add(playerName, playerSocket) {
    this.unassignedPlayerNames.push(playerName);
    this.players.set(playerName, playerSocket);
  }

  remove(playerName) {
    const teamName = this.players.get(playerName).teamName;
    this[teamName + "PlayerNames"] = this[teamName + "PlayerNames"].filter(
      (name) => name !== playerName
    );
    this.players.delete(playerName);
  }

  contains(playerName) {
    return this.playerNames.has(playerName);
  }

  playerSocket(playerName) {
    return this.players.get(playerName);
  }

  info() {
    return {
      host: this.hostName,
      redPlayerNames: this.redPlayerNames,
      bluePlayerNames: this.bluePlayerNames,
      unassignedPlayerNames: this.unassignedPlayerNames,
      rounds: this.rounds,
      drawTime: this.drawTime,
    };
  }

  setHost(playerName, playerSocket) {
    this.hostName = playerName;
    this.hostSocket = playerSocket;
  }

  findNewHost() {
    if (this.players.size > 0) {
      const playerIterator = this.players.entries();
      const newHost = playerIterator.next().value;
      const [newHostName, newHostSocket] = newHost;
      this.setHost(newHostName, newHostSocket);
    }
  }

  updateTeams(playerName, newTeamName, insertPosition) {
    const playerSocket = this.playerSocket(playerName);

    this.redPlayerNames = this.redPlayerNames.filter(
      (name) => name !== playerName
    );
    this.bluePlayerNames = this.bluePlayerNames.filter(
      (name) => name !== playerName
    );
    this.unassignedPlayerNames = this.unassignedPlayerNames.filter(
      (name) => name !== playerName
    );
    this[newTeamName + "PlayerNames"].splice(insertPosition, 0, playerName);

    playerSocket.teamName = newTeamName;
  }

  updateSettings(settingName, settingValue) {
    this[settingName] = settingValue;
  }

  size() {
    return this.players.size;
  }
}

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
        const room = new Room(data.roomId, data.rounds, data.drawTime);
        room.add(data.playerName, socket);
        room.setHost(data.playerName, socket);
        this.rooms.set(data.roomId, room);
        this.joinRoom(data, socket);

        this.emitInfo(data.roomId);
      });

      socket.on("joinGame", (data) => {
        const room = this.rooms.get(data.roomId);
        room.add(data.playerName, socket);
        this.joinRoom(data, socket);

        this.emitInfo(data.roomId);
      });

      socket.on("updateTeams", (data) => {
        const room = this.rooms.get(data.roomId);
        room.updateTeams(
          data.playerName,
          data.newTeamName,
          data.insertPosition
        );
        socket.teamName = data.newTeamName;

        this.emitInfo(data.roomId);
      });

      socket.on("updateSettings", (data) => {
        const room = this.rooms.get(data.roomId);
        room.updateSettings(data.settingName, data.settingValue);

        this.emitInfo(data.roomId);
      });

      socket.on("leaveGame", (data) => {
        const room = this.rooms.get(data.roomId);
        room.remove(data.playerName);

        if (room.size === 0) {
          this.rooms.delete(socket.roomId);
          return;
        }

        if (room.hostName === data.playerName) {
          room.findNewHost();
        }

        socket.leave(data.roomId);

        this.emitInfo(data.roomId);
      });

      socket.on("disconnect", () => {
        // TODO check issue teamName in line 22 is undefined on disconnect
        const room = this.rooms.get(socket.roomId);
        room.remove(socket.playerName);

        if (room.size === 0) {
          this.rooms.delete(socket.roomId);
          return;
        }

        if (room.hostName === socket.playerName) {
          room.findNewHost();
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

  joinRoom(data, socket) {
    socket.playerName = data.playerName;
    socket.roomId = data.roomId;
    socket.teamName = "unassigned";
    socket.join(data.roomId);
  }
}

module.exports = Connection;
