const PlayerList = require("./playerList");

class Game {
  constructor(connection, room, roomID, rounds, drawTime) {
    this.connection = connection;
    this.room = room;
    this.roomID = roomID;
    this.rounds = rounds;
    this.drawTime = drawTime;

    this.redScore = 0;
    this.blueScore = 0;
    this.activePlayerName = null;
    this.activeTeamName = null;
    this.round = 1;
    this.turn = 1;

    const roomInfo = room.info();
    this.redPlayerNames = new PlayerList(room, roomInfo.redPlayerNames);
    this.bluePlayerNames = new PlayerList(room, roomInfo.bluePlayerNames);
    this.turnsPerRound = Math.max(
      roomInfo.redPlayerNames.length,
      roomInfo.bluePlayerNames.length
    );
  }

  start() {
    this.activeTeamName = Math.random() < 0.5 ? "blue" : "red";

    try {
      this.activePlayerName = this[this.activeTeamName + "playerNames"].next();
    } catch (EmptyPlayerListError) {
      // TODO - implement the game error logic
      //   this.connection.emitGameError("A team did not have enough players.");
    }
  }

  play() {}
}
