class Room {
  constructor(connection, roomId, rounds, drawTime) {
    this.connection = connection;
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
    this.players.set(playerName, { playerSocket, teamName: "unassigned" });
  }

  remove(playerName) {
    if (this.size() === 0 || !this.contains(playerName)) {
      return;
    }

    const team = this.players.get(playerName).teamName + "PlayerNames";
    this[team] = this[team].filter((name) => name !== playerName);
    this.players.delete(playerName);

    if (playerName === this.hostName) {
      this._findNewHost();
    }
  }

  contains(playerName) {
    return this.players.has(playerName);
  }

  playerSocket(playerName) {
    const player = this.players.get(playerName);
    return player ? player.playerSocket : player;
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
    if (this.players.has(playerName)) {
      this.hostName = playerName;
      this.hostSocket = playerSocket;
    }
  }

  getHost() {
    return [this.hostName, this.hostSocket];
  }

  _findNewHost() {
    if (this.size() === 0) {
      this.hostName = null;
      this.hostSocket = null;
      return;
    }

    const playerIterator = this.players.entries();
    const newHost = playerIterator.next().value;
    const [newHostName, { playerSocket: newHostSocket }] = newHost;
    this.setHost(newHostName, newHostSocket);
  }

  updateTeams(playerName, newTeamName, insertPosition) {
    const validTeamNames = ["red", "blue", "unassigned"];
    if (
      !this.contains(playerName) ||
      !validTeamNames.includes(newTeamName) ||
      insertPosition < 0
    ) {
      return;
    }

    const player = this.players.get(playerName);
    const oldTeam = player.teamName + "PlayerNames";
    const newTeam = newTeamName + "PlayerNames";

    this[oldTeam] = this[oldTeam].filter((name) => name !== playerName);
    this[newTeam].splice(insertPosition, 0, playerName);
    player.teamName = newTeamName;
  }

  updateSettings(settingName, settingValue) {
    if (settingName === "rounds" || settingName === "drawTime") {
      this[settingName] = settingValue;
    }
  }

  size() {
    return this.players.size;
  }
}

module.exports = Room;
