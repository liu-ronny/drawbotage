import React from "react";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import { Route } from "react-router-dom";
import { render, fireEvent, act } from "@testing-library/react";
import Lobby from "../../lobby/lobby";
import Home from "../../home/home";
import ErrorPage from "../../errorPage";
import MockSocket from "socket.io-mock";

jest.mock("socket.io-client", () => {
  return jest.fn(() => mockClient);
});

MockSocket.prototype.emit = function (eventKey, payload, callback) {
  if (!callback) {
    this.socketClient.fireEvent(eventKey, payload);
  } else {
    this.socketClient._emitFn(eventKey, payload, callback);
  }
};

function renderLobby(history, props) {
  history.replace("/" + roomId);

  return render(
    <Router history={history}>
      <Route path="/" exact component={Home} />
      <Route path="/:id">
        <Lobby {...props} />
      </Route>
      <Route path="/error" exact component={ErrorPage} />
    </Router>
  );
}

let history;
let mockServer;
let mockClient;
let assertionCount;
const playerName = "p1";
const roomId = "41de3945-703e-40b3-b2c3-a31c2071cbc8";
let joinRoom = false;
let createRoom = true;
const roundOptions = [3, 5, 7];
const drawTimeOptions = [60, 80, 100];
const bluePlayerNames = [playerName, "p2", "p3"];
const redPlayerNames = ["p4", "p5", "p6"];

beforeEach(() => {
  history = createMemoryHistory();
  mockServer = new MockSocket();
  mockClient = mockServer.socketClient;
  mockClient.close = jest.fn();
  assertionCount = 0;
});

function startGame() {
  const renderResult = renderLobby(history, {
    playerName,
    roomId,
    joinRoom,
    createRoom,
  });

  const gameInfo = {
    host: playerName,
    bluePlayerNames,
    redPlayerNames,
    unassignedPlayerNames: [],
    rounds: roundOptions[0],
    drawTime: drawTimeOptions[0],
  };

  act(() => {
    mockServer.emit("info", gameInfo);
  });

  act(() => {
    mockServer.emit("startGame", gameInfo);
  });

  return renderResult;
}

describe("game page", () => {
  it("displays the correct information at the start of the game", async () => {
    const { findByText, queryByText } = startGame();

    // check for existence of initial text
    expect(await findByText("Chat")).toBeInTheDocument();
    expect(queryByText("Team 1 - 0")).toBeInTheDocument();
    expect(queryByText("Team 2 - 0")).toBeInTheDocument();
    expect(queryByText("Round 1")).toBeInTheDocument();
    expect(queryByText("______")).toBeInTheDocument();

    for (let i = 0; i < 3; i++) {
      expect(queryByText(bluePlayerNames[i])).toBeInTheDocument();
      expect(queryByText(redPlayerNames[i])).toBeInTheDocument();
    }
  });

  it("highlights the current player", async () => {
    const { findByText, queryByText } = startGame();

    // check that the current player is highlighted
    act(() => {
      mockServer.emit("setCurrentPlayer", {
        currentPlayerName: playerName,
      });
    });
    expect(await findByText(playerName)).toHaveClass("game-current-player");

    // check that other players are not highlighted
    for (let i = 0; i < 3; i++) {
      if (i > 0) {
        expect(queryByText(bluePlayerNames[i])).not.toHaveClass(
          "game-current-player"
        );
      }
      expect(queryByText(redPlayerNames[i])).not.toHaveClass(
        "game-current-player"
      );
    }
  });

  it("displays a wait screen when another player is selecting a word", async () => {
    const { getByRole, getByText, queryByRole, queryByText } = startGame();

    function assertScreen(timeRemaining) {
      expect(
        getByRole("alert", { name: "Waiting for word selection" }).textContent
      ).toBe("Waiting for p2 to select a word...");
      expect(getByText(`${timeRemaining}s`)).toBeInTheDocument();
      expect(getByRole("alert", { name: "Waiting..." })).toBeInTheDocument();
    }

    // trigger the word selection screen
    act(() => {
      mockServer.emit("waitForWordSelection", {
        selector: "p2",
        timeRemaining: 20000,
      });
    });
    assertScreen(20);

    // update the timer
    act(() => {
      mockServer.emit("selectWordTimer", {
        timeRemaining: 19000,
      });
    });
    assertScreen(19);

    // fast-forward to no time left
    act(() => {
      mockServer.emit("selectWordTimer", {
        timeRemaining: 0,
      });
    });
    assertScreen(0);

    // trigger the word selection
    act(() => {
      mockServer.emit("wordSelection", {
        wordLength: 10,
        spacesAt: [5],
      });
    });
    expect(
      queryByRole("alert", { name: "Waiting for word selection" })
    ).not.toBeInTheDocument();
    expect(queryByText("0s")).not.toBeInTheDocument();
    expect(
      queryByRole("alert", { name: "Waiting..." })
    ).not.toBeInTheDocument();
    expect(getByText("_____ ____")).toBeInTheDocument();
  });

  it("displays a selection screen when the current player is selecting a word", async () => {
    const mockRespondFn = jest.fn();
    const { getByRole, getByText, queryByRole, queryByText } = startGame();

    function assertScreen(timeRemaining) {
      expect(getByRole("alert", { name: "Select word" }).textContent).toBe(
        "Select a word for your team to guess"
      );
      expect(getByText(`${timeRemaining}s`)).toBeInTheDocument();
      expect(
        queryByRole("alert", { name: "Waiting..." })
      ).not.toBeInTheDocument();
      expect(getByText("test")).toBeInTheDocument();
      expect(getByText("word")).toBeInTheDocument();
      expect(getByText("something")).toBeInTheDocument();
    }

    act(() => {
      mockServer.emit(
        "selectWord",
        {
          words: ["test", "word", "something"],
          timeRemaining: 20000,
        },
        mockRespondFn
      );
    });
    assertScreen(20);

    // update the timer
    act(() => {
      mockServer.emit("selectWordTimer", {
        timeRemaining: 19000,
      });
    });
    assertScreen(19);

    // fast-forward to no time left
    act(() => {
      mockServer.emit("selectWordTimer", {
        timeRemaining: 0,
      });
    });
    assertScreen(0);

    // select a word
    act(() => {
      fireEvent.click(getByText("something"));
    });
    expect(mockRespondFn).toBeCalledTimes(1);
    expect(mockRespondFn).toHaveBeenLastCalledWith("something");

    // have the server respond to the selection
    act(() => {
      mockServer.emit("wordSelection", {
        wordLength: 9,
        spacesAt: [],
      });
    });
    expect(
      queryByRole("alert", { name: "Select word" })
    ).not.toBeInTheDocument();
    expect(queryByText("0s")).not.toBeInTheDocument();
    expect(
      queryByRole("alert", { name: "Waiting..." })
    ).not.toBeInTheDocument();
    expect(queryByText("test")).not.toBeInTheDocument();
    expect(queryByText("word")).not.toBeInTheDocument();
    expect(queryByText("something")).not.toBeInTheDocument();
    expect(getByText("_________")).toBeInTheDocument();
  });
});
