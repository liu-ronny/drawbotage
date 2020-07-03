class Game {
  constructor(io, roomID, rounds, drawTime) {
    this.io = io;
    this.roomID = roomID;
    this.rounds = rounds;
    this.drawTime = drawTime;

    this.redScore = 0;
    this.blueScore = 0;
    this.currentPlayer = null;
    this.currentTeam = null;
    this.round = 1;
    this.turn = 1;

    const {
      red: redPlayerCount,
      blue: bluePlayerCount,
    } = this.getPlayerCounts();
    this.turnsPerRound = Math.max(redPlayerCount, bluePlayerCount);
  }

  getPlayerCounts() {
    const io = this.io;
    const roomID = this.roomID;
    const playerCounts = { red: 0, blue: 0 };

    const clients = io.sockets.adapter.rooms[roomID].sockets;
    for (let clientID in clients) {
      const clientSocket = io.sockets.connected[clientID];
      playerCounts[clientSocket.drawbotageTeam] += 1;
    }

    return playerCounts;
  }

  getNextPlayer() {
    const red = this.red;
    const blue = this.blue;
    const currentTeam = this.currentTeam;
    const currentPlayer = currentTeam.getCurrentPlayer();
    const wordBank = this.wordBank;
    const TURNS_PER_ROUND = this.TURNS_PER_ROUND;
    const ROUNDS = this.ROUNDS;

    if (currentTeam === red) {
      this.currentTeam = blue;
    } else {
      this.currentTeam === red;
    }

    if (typeof currentPlayer === undefined) {
      this.tooManyDisconnections = true;
    }

    this.currentWord = wordBank.getWord();

    this.turn += 1;
    if (this.turn === TURNS_PER_ROUND) {
      this.round += 1;
      this.turn = 1;
    }

    if (this.round > ROUNDS) {
      this.isActive = false;
    }
  }
}
