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
    this.unassignedPlayers.push(playerName);
    this.players.set(playerName, playerSocket);
  }

  remove(playerName, teamName) {
    this[teamName + "playerNames"] = this[teamName + "playerNames"].filter(
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
      playerNames: {
        redPlayerNames: this.redPlayerNames,
        bluePlayerNames: this.bluePlayerNames,
        unassignedPlayerNames: this.unassignedPlayerNames,
      },
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
      const players = this.players.entries();
      const [newHostName, newHostSocket] = players.next();
      this.setHost(newHostName, newHostSocket);
    }
  }

  updateTeams(playerName, oldTeamName, newTeamName, insertPosition) {
    this[oldTeamName + "playerNames"] = this[
      oldTeamName + "playerNames"
    ].filter((name) => name !== playerName);
    this[newTeamName + "playerNames"].splice(insertPosition, 0, playerName);
  }

  updateSettings(settingName, settingValue) {
    this[settingName] = settingValue;
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
        this.rooms.set(data.roomID, room);
        this.joinRoom(data, socket);

        this.emitInfo(data.roomId);
      });

      socket.on("joinGame", (data) => {
        const room = this.rooms.get(data.roomId);
        room.add(data.playerName, socket);
        this.joinRoom(data, socket);

        this.emitInfo(data.roomId);
      });

      socket.on("leaveGame", (data) => {
        const room = this.rooms.get(data.roomId);
        room.remove(data.playerName, data.teamName);

        if (room.hostName === data.playerName) {
          room.findNewHost();
        }

        socket.leave(data.roomId);

        this.emitInfo(data.roomId);
      });

      socket.on("updateTeams", (data) => {
        const room = this.rooms.get(data.roomId);
        room.updateTeams(data.playerName, data.teamName, data.insertPosition);
        socket.teamName = data.toTeamName;

        this.emitInfo(data.roomId);
      });

      socket.on("disconnect", () => {
        const room = this.rooms.get(socket.roomId);
        room.remove(socket.playerName, socket.teamName);

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
    socket.join(data.roomID);
  }
}

module.exports = Connection;
