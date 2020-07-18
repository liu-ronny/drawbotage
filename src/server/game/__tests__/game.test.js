const Connection = require("../../connection/connection");
const MockSocket = require("socket.io-mock");

const drawbotages = ["reverse", "hide", "color", "bulldoze"];
// in ms
const drawTime = 60000;

let connection;
let room;
let game;
let mockServer;
let assertionCount;

// MockSocket.prototype.to = function (roomKey) {
//   return {
//     emit: (eventKey, payload) => {
//       this.broadcast.to(roomKey).emit(eventKey, payload);
//     },
//     broadcast: this.broadcast.to(roomKey),
//   };
// };
MockSocket.prototype.to = function (roomKey) {
  return {
    emit: (eventKey, payload, callback) => {
      if (!callback) {
        this.broadcast.to(roomKey).emit(eventKey, payload);
      } else {
        this.broadcast.to(roomKey).emit(eventKey, {
          data: payload,
          respond: callback,
        });
      }
    },
    broadcast: this.broadcast.to(roomKey),
  };
};
MockSocket.prototype.emit = function (eventKey, payload, callback) {
  if (!callback) {
    this.socketClient.fireEvent(eventKey, payload);
  } else {
    this.socketClient.fireEvent(eventKey, {
      data: payload,
      respond: callback,
    });
  }
};
MockSocket.prototype.emitEvent = function (eventKey, payload) {
  this._emitFn(eventKey, payload);
};

jest.mock("socket.io", () => {
  return jest.fn(() => mockServer);
});

beforeEach(() => {
  jest.useFakeTimers();
  mockServer = new MockSocket();
  mockServer.sockets = mockServer;
  mockServer.set = () => {};
  connection = new Connection(mockServer);
  assertionCount = 0;

  mockServer.socketClient.emit("connection", mockServer);

  emitToServer("createGame", { playerName: "p1" });
  emitToServer("updateTeams", {
    playerName: "p1",
    newTeamName: "red",
    insertPosition: 0,
  });

  for (let i = 2; i <= 10; i++) {
    const playerName = "p" + i;

    emitToServer("joinGame", { playerName });

    if (i % 2 === 0) {
      emitToServer("updateTeams", {
        playerName,
        newTeamName: "blue",
        insertPosition: 0,
      });
    } else {
      emitToServer("updateTeams", {
        playerName,
        newTeamName: "red",
        insertPosition: 0,
      });
    }
  }

  room = connection.get("41de3945-703e-40b3-b2c3-a31c2071cbc8");
  room.createGame();
  game = room.game;
});

afterEach(() => {
  game.gameOver = true;
  game.endGame(false);
});

function emitToServer(event, data) {
  const { playerName, pushTo } = data;
  const defaults = {
    roomId: "41de3945-703e-40b3-b2c3-a31c2071cbc8",
    rounds: 3,
    drawTime: 60,
  };

  for (const prop of Object.keys(defaults)) {
    if (!data[prop]) {
      data[prop] = defaults[prop];
    }
  }

  if (pushTo) {
    pushTo.push(playerName);
  }

  mockServer.socketClient.emit(event, data);
}

describe("Game", () => {
  it("sets the next team correctly", () => {
    let currentTeam = game.currentTeam === "blue" ? "blue" : "red";
    let nextTeam = game.currentTeam === "blue" ? "red" : "blue";

    for (let i = 0; i < 50; i++) {
      game.setNextTeam();

      // verify that the teams have swapped roles
      expect(game.currentTeam).toBe(nextTeam);

      // swap the team variables for the next check
      [currentTeam, nextTeam] = [nextTeam, currentTeam];
    }
  });

  it("allows a player to select a drawbotage correctly", async () => {
    // check that the selector is the next player from either the blue team or the red team
    mockServer.onEmit("waitForDrawbotageSelection", (data) => {
      const selector = ["p10", "p9"];
      expect(selector).toContain(data.selector);
    });
    assertionCount++;

    // check that the emitted choices match the drawbotages array
    let drawbotage;
    mockServer.socketClient.on("selectDrawbotage", (data) => {
      const { data: drawbotageChoices, respond } = data;

      expect(drawbotageChoices).toEqual(drawbotages);
      drawbotage = drawbotageChoices[0];
      respond(drawbotage);
    });
    assertionCount++;

    // check that the emitted selection matches the choice made
    mockServer.onEmit("drawbotageSelection", (data) => {
      expect(data.selection).toBe(drawbotage);
    });
    assertionCount++;

    // check that the return value is the selected drawbotage
    assertionCount++;
    try {
      const selection = await game.selectDrawbotage();
      expect(selection).toBe(drawbotage);
    } catch (err) {}

    expect.assertions(assertionCount);
  });

  it("selects a random drawbotage if the player fails to respond in time", async () => {
    // check that a 10 second timer gets emitted
    let timeRemaining = 10000;
    mockServer.onEmit("selectDrawbotageTimer", (data) => {
      expect(data.timeRemaining).toBe(timeRemaining);
      timeRemaining -= 1000;
    });
    assertionCount += 10;

    // check that some drawbotage is selected
    let drawbotage;
    mockServer.onEmit("drawbotageSelection", (data) => {
      expect(data.selection).toBeTruthy();
      drawbotage = data.selection;
    });
    assertionCount++;

    // check that the return value is the selected drawbotage
    assertionCount++;
    try {
      let selection = game.selectDrawbotage();
      jest.runAllTimers();
      selection = await selection;
      expect(selection).toBe(drawbotage);
    } catch (err) {}

    expect.assertions(assertionCount);
  });

  it("allows a player to choose a word correctly", async () => {
    game.setNextPlayer();

    // check that the selector is the next player from either the blue team or the red team
    mockServer.onEmit("waitForWordSelection", (data) => {
      const selector = ["p10", "p9"];
      expect(selector).toContain(data.selector);
    });
    assertionCount++;

    // check that three choices are emitted to the selector
    let word;
    mockServer.socketClient.on("selectWord", (data) => {
      const { data: words, respond } = data;
      expect(words).toHaveLength(3);
      word = words[0];
      respond(word);
    });
    assertionCount++;

    // check that the emitted selection matches the choice made
    mockServer.onEmit("wordSelection", (data) => {
      expect(data.selection).toBe(word);
    });
    assertionCount++;

    // check that the return value is the selected word
    assertionCount++;
    try {
      const selection = await game.selectWord();
      expect(selection).toBe(word);
    } catch (err) {}

    expect.assertions(assertionCount);
  });

  it("selects a random word if the player fails to respond in time", async () => {
    game.setNextPlayer();

    // check that a 10 second timer gets emitted
    let timeRemaining = 10000;
    mockServer.onEmit("selectWordTimer", (data) => {
      expect(data.timeRemaining).toBe(timeRemaining);
      timeRemaining -= 1000;
    });
    assertionCount += 10;

    let word;
    // check that some word is selected
    mockServer.onEmit("wordSelection", (data) => {
      expect(data.selection).toBeTruthy();
      word = data.selection;
    });
    assertionCount++;

    // check that the return value is the selected drawbotage
    assertionCount++;
    try {
      let selection = game.selectWord();
      jest.runAllTimers();
      selection = await selection;
      expect(selection).toBe(word);
    } catch (err) {}

    expect.assertions(assertionCount);
  });

  it("receives guesses from players during a turn correctly", async () => {
    room.createGame();
    game.setCurrentWord("test");
    const currentTeam = game.currentTeam;

    const result = game.receiveGuesses();
    mockServer.socketClient.emit("guess", {
      playerName: "p1",
      fromTeam: currentTeam,
      timeRemaining: 50000,
      guess: "best",
    });
    mockServer.socketClient.emit("guess", {
      playerName: "p2",
      fromTeam: currentTeam,
      timeRemaining: 45000,
      guess: "test",
    });

    assertionCount += 2;
    try {
      const res = await result;
      expect(res.playerName).toBe("p2");
      expect(res.timeRemaining).toBe(45000);
    } catch (err) {}

    expect.assertions(assertionCount);
  });

  it("handles no correct guesses from players during a turn correctly", async () => {
    room.createGame();
    game.setCurrentWord("test");
    const currentTeam = game.currentTeam;

    const result = game.receiveGuesses(60000);
    mockServer.socketClient.emit("guess", {
      playerName: "p1",
      fromTeam: currentTeam,
      timeRemaining: 50000,
      guess: "best",
    });
    mockServer.socketClient.emit("guess", {
      playerName: "p2",
      fromTeam: currentTeam,
      timeRemaining: 45000,
      guess: "rest",
    });

    assertionCount++;
    jest.runAllTimers();
    try {
      const res = await result;
      expect(res.timeRemaining).toBe(0);
    } catch (err) {}

    expect.assertions(assertionCount);
  });

  it("calculates the score correctly", () => {
    // > 75% of draw time
    expect(game.calculatePoints(drawTime * 0.8)).toBe(100);

    // 75% of draw time
    expect(game.calculatePoints(drawTime * 0.75)).toBe(100);

    // 50% < timeRemaining < 75%
    expect(game.calculatePoints(drawTime * 0.6)).toBe(75);

    // 50% of draw time
    expect(game.calculatePoints(drawTime * 0.5)).toBe(75);

    // 25% < timeRemaining < 50%
    expect(game.calculatePoints(drawTime * 0.4)).toBe(60);

    // 25% of draw time
    expect(game.calculatePoints(drawTime * 0.25)).toBe(60);

    // 0% < timeRemaining < 25%
    expect(game.calculatePoints(drawTime * 0.1)).toBe(50);

    // 0% of draw time
    expect(game.calculatePoints(drawTime * 0)).toBe(0);
  });

  it("cleans up properly after the game is over", async () => {
    mockServer.onEmit("endGame", () => {
      expect(true).toBe(true);
    });
    assertionCount++;

    game.endGame();
    expect(connection.contains(game.roomId)).toBe(false);
    assertionCount++;

    expect.assertions(assertionCount);
  });
});
