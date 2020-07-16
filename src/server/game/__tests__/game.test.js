const Connection = require("../../connection/connection");
const MockSocket = require("socket.io-mock");

let connection;
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
  it("allows a player to choose a word correctly", () => {
    mockServer.onEmit("waitForWordSelection", (data) => {
      const selector = ["p10", "p9"];
      expect(selector).toContain(data.selector);
    });
    assertionCount++;

    let word;
    mockServer.socketClient.on("selectWord", (data) => {
      const { data: words, respond } = data;
      expect(words).toHaveLength(3);
      word = words[0];
      respond(word);
    });
    assertionCount++;

    mockServer.onEmit("wordSelection", (data) => {
      expect(data.selection).toBeTruthy();
      expect(data.selection).toBe(word);
    });
    assertionCount += 2;

    emitToServer("startGame", { playerName: "p1" });

    expect.assertions(assertionCount);
  });

  it("selects a random word choice if the player fails to respond in time", () => {
    mockServer.onEmit("wordSelection", (data) => {
      expect(data.selection).toBeTruthy();
    });
    assertionCount++;

    let timeRemaining = 10000;
    mockServer.onEmit("selectWordTimer", (data) => {
      expect(data.timeRemaining).toBe(timeRemaining);
      timeRemaining -= 1000;
    });
    assertionCount += 10;

    emitToServer("startGame", { playerName: "p1" });
    jest.runAllTimers();

    expect.assertions(assertionCount);
  });
});
