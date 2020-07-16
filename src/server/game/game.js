const PlayerList = require("./playerList");
const WordBank = require("./wordBank");
const { timeoutPromise, intervalPromise } = require("../utils/promises");

/**
 * Represents a Drawbotage game.
 */
class Game {
  /**
   * Creates a Drawbotage game.
   * @param {Connection} connection - The connection that manages the server socket
   * @param {Room} room - The room that is associated with the game
   * @param {string} roomId - The UUID that identifies the room
   * @param {number} rounds - The number of rounds to play
   * @param {number} drawTime - The draw time per turn
   */
  constructor(connection, room, roomId, rounds, drawTime) {
    this.connection = connection;
    this.room = room;
    this.roomId = roomId;
    this.rounds = rounds;
    this.drawTime = drawTime;

    // set the initial parameters of the game
    // both teams start with 0 points, and play commences from turn 1 of round 1
    this.redScore = 0;
    this.blueScore = 0;
    this.round = 1;
    this.turn = 1;
    this.currentPlayer = null;
    this.currentWord = null;
    this.wordBank = new WordBank();

    // randomly pick a team
    this.prevTeam = Math.random() < 0.5 ? "blue" : "red";
    this.currentTeam = this.prevTeam === "blue" ? "red" : "blue";

    // list out the names of the available drawbotages
    this.drawbotages = ["reverse", "hide", "color", "bulldoze"];

    // create a managed list of players and calculate the number of turns per round
    const { redPlayerNames, bluePlayerNames } = room.info();
    this.red = new PlayerList(room, redPlayerNames);
    this.blue = new PlayerList(room, bluePlayerNames);
    this.turnsPerRound = Math.max(
      redPlayerNames.length,
      bluePlayerNames.length
    );
  }

  /**
   * Plays the game.
   */
  async play() {
    this.assignNextTeam();

    const [prevPlayers, currentPlayers] = this.getPlayers();
    const [prevTeamScore, currentTeamScore] = this.getScores();

    try {
      this.currentPlayer = currentPlayers.next();

      // if the other team is behind by a certain amount, let a player from that team choose a drawbotage
      if (prevTeamScore + 150 <= currentTeamScore) {
        await this.selectDrawbotage();
      }

      this.currentWord = await this.selectWord();
      const turnResult = await this.receiveGuesses(this.drawTime);
      this.updateScore(turnResult.timeRemaining);

      // ----- emit update -----
      // reveal the word
      // did someone guess correctly?
      // new team scores

      // this.updateTurn();
      // if (this.round > this.rounds) {
      // ----- end game -----
      // emit end game message
      // clean up room and release the associated memory
      // this.connection.remove(this.roomId);
      // return
      // }

      // recursively play until the game ends
      // this.play();
    } catch (err) {
      // note-to-self: this block might throw an EmptyPlayerListError
      // must emit message for client to end game
    }
  }

  /**
   * Assigns the next team to be the active team. Also assigns the current team
   * to be the previous team.
   */
  assignNextTeam() {
    this.prevTeam = this.currentTeam;
    this.currentTeam = this.currentTeam === "blue" ? "red" : "blue";
  }

  /**
   * Returns the players belonging to the previous and current teams
   * @returns {[PlayerList, PlayerList]} [<previous team players>, <current team players>]
   */
  getPlayers() {
    const prevPlayers = this[this.prevTeam];
    const currentPlayers = this[this.currentTeam];
    return [prevPlayers, currentPlayers];
  }

  /**
   * Returns the scores belonging to the previous and current teams
   * @returns {[number, number]} [<previous team score>, <current team score>]
   */
  getScores() {
    const prevTeamScore = this[this.prevTeam + "Score"];
    const currentTeamScore = this[this.currentTeam + "Score"];
    return [prevTeamScore, currentTeamScore];
  }

  /**
   * Returns an array of the form [promise, intervalId]. The promise resolves when the client socket responds to the emitted event.
   * If the client fails to respond within the specified number of milliseconds, the promise will reject. The intervalId can be
   * cleared when the client responds before the promise rejects.
   * @param {string} event - The name of event to emit
   * @param {object|string} recipient - Either a client socket object or a room id
   * @param {object} data - The data to emit with the event
   * @param {string} ms - The number of milliseconds to wait before rejecting the promise. Must be >= 1000.
   * @returns {[Promise, string]} An array of the form [promise, intervalId]
   */
  getResponse(event, recipient, data, ms) {
    let response = new Promise((resolve) => {
      this.connection.emit(event, recipient, data, (responseData) => {
        resolve(responseData);
      });
    });

    return intervalPromise(ms, response, (timeRemaining) => {
      this.connection.emit(event + "Timer", this.roomId, { timeRemaining });
    });
  }

  /**
   * Lets a player from the non-current team select a drawbotage.
   */
  async selectDrawbotage() {
    const [prevPlayers] = this.getPlayers();
    const selector = prevPlayers.peek();
    const socket = this.room.playerSocket(selector);

    socket
      .to(this.roomId)
      .broadcast.emit("waitForDrawbotageSelection", { selector });

    // give the player 10 seconds to select a drawbotage before selecting one at random
    let drawbotage;
    const [response, timerId] = this.getResponse(
      "selectDrawbotage",
      socket,
      this.drawbotages,
      10000
    );

    try {
      drawbotage = await response;
      clearInterval(timerId);
    } catch (err) {
      const randPos = Math.floor(Math.random() * this.drawbotages.length);
      drawbotage = this.drawbotages[randPos];
    }

    // emit the drawbotage choice to all clients
    this.connection.emit("drawbotageSelection", this.roomId, {
      selection: drawbotage,
    });
  }

  /**
   * Lets the current player select a word.
   */
  async selectWord() {
    // get three words from the word bank and let the active player choose one
    const words = this.wordBank.get(3);
    const socket = this.room.playerSocket(this.currentPlayer);

    socket.to(this.roomId).broadcast.emit("waitForWordSelection", {
      selector: this.currentPlayer,
    });

    // give the player 10 seconds to select a word before selecting one at random
    let word;
    const [response, timerId] = this.getResponse(
      "selectWord",
      socket,
      words,
      10000
    );

    try {
      word = await response;
      clearInterval(timerId);
    } catch (err) {
      const randPos = Math.floor(Math.random() * words.length);
      word = words[randPos];
    }

    // emit the word selection to all clients
    this.connection.emit("wordSelection", this.roomId, { selection: word });
    return word;
  }

  async receiveGuesses(ms) {
    const checker = this.createGuessChecker(this.currentTeam);

    const correctGuess = new Promise((resolve, reject) => {
      this.connection.receiveGuesses(checker, (playerName, timeRemaining) => {
        resolve({ playerName, timeRemaining });
      });
    });

    const [result, intervalId] = intervalPromise(
      ms,
      correctGuess,
      (timeRemaining) => {
        this.connection.emit("guessTimer", this.roomId, { timeRemaining });
      }
    );

    let turnResult = {};
    try {
      turnResult = await result;
      clearInterval(intervalId);
    } catch (err) {
      turnResult.timeRemaining = 0;
    }

    return turnResult;
  }

  createGuessChecker = (currentTeam) => {
    return (guess, fromTeam) => {
      if (fromTeam === currentTeam) {
        return guess.trim().toLowerCase() === this.currentWord;
      }
      return false;
    };
  };

  updateScore(drawTimeRemaining) {
    const percentTimeRemaining = Math.ceil(drawTimeRemaining / this.drawTime);

    if (percentTimeRemaining >= 0.75) {
      this[this.currentTeam + "Score"] += 100;
    } else if (percentTimeRemaining >= 0.5) {
      this[this.currentTeam + "Score"] += 75;
    } else if (percentTimeRemaining >= 0.25) {
      this[this.currentTeam + "Score"] += 60;
    } else {
      this[this.currentTeam + "Score"] += 50;
    }
  }

  updateTurn() {
    this.turn++;

    if (this.turn > this.turnsPerRound) {
      // reset player lists for the next round
      this.round++;
      this.turn = 1;
    }
  }
}

module.exports = Game;
