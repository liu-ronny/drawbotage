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
        getByRole("alert", { name: "Waiting for selection" }).textContent
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
      queryByRole("alert", { name: "Waiting for selection" })
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

  it("displays a wait screen when another player is selecting a drawbotage", async () => {
    const { getByRole, getByText, queryByRole, queryByText } = startGame();

    function assertScreen(timeRemaining) {
      expect(
        getByRole("alert", { name: "Waiting for selection" }).textContent
      ).toBe("Waiting for p2 to select a drawbotage...");
      expect(getByText(`${timeRemaining}s`)).toBeInTheDocument();
      expect(getByRole("alert", { name: "Waiting..." })).toBeInTheDocument();
    }

    // trigger the drawbotage selection screen
    act(() => {
      mockServer.emit("waitForDrawbotageSelection", {
        selector: "p2",
        timeRemaining: 20000,
      });
    });
    assertScreen(20);

    // update the timer
    act(() => {
      mockServer.emit("selectDrawbotageTimer", {
        timeRemaining: 19000,
      });
    });
    assertScreen(19);

    // fast-forward to no time left
    act(() => {
      mockServer.emit("selectDrawbotageTimer", {
        timeRemaining: 0,
      });
    });
    assertScreen(0);

    // trigger the drawbotage selection
    act(() => {
      mockServer.emit("drawbotageSelection", {
        drawbotage: "hide",
      });
    });
    expect(
      queryByRole("alert", { name: "Waiting for drawbotage selection" })
    ).not.toBeInTheDocument();
    expect(queryByText("0s")).not.toBeInTheDocument();
    expect(
      queryByRole("alert", { name: "Waiting..." })
    ).not.toBeInTheDocument();
    expect(getByText("A drawbotage has been selected!")).toBeInTheDocument();
    expect(getByText("hide")).toBeInTheDocument();

    // hide the modal
    act(() => {
      mockServer.emit("hideDrawbotageSelection", {});
    });
    expect(
      queryByText("A drawbotage has been selected!")
    ).not.toBeInTheDocument();
    expect(queryByText("hide")).not.toBeInTheDocument();
  });

  it("displays a selection screen when the current player is selecting a drawbotage", async () => {
    const mockRespondFn = jest.fn();
    const { getByRole, getByText, queryByRole, queryByText } = startGame();

    function assertScreen(timeRemaining) {
      expect(getByText("It's drawbotage time!")).toBeInTheDocument();
      expect(getByText(`${timeRemaining}s`)).toBeInTheDocument();
      expect(
        queryByRole("alert", { name: "Waiting..." })
      ).not.toBeInTheDocument();
      expect(getByText("reverse")).toBeInTheDocument();
    }

    // trigger the drawbotage choice screen
    act(() => {
      mockServer.emit(
        "selectDrawbotage",
        {
          drawbotages: [],
          timeRemaining: 20000,
        },
        mockRespondFn
      );
    });
    assertScreen(20);

    // update the timer
    act(() => {
      mockServer.emit("selectDrawbotageTimer", {
        timeRemaining: 19000,
      });
    });
    assertScreen(19);

    // fast-forward to no time left
    act(() => {
      mockServer.emit("selectDrawbotageTimer", {
        timeRemaining: 0,
      });
    });
    assertScreen(0);

    // select a drawbotage
    act(() => {
      fireEvent.click(getByRole("button", { name: "Select" }));
    });
    expect(mockRespondFn).toBeCalledTimes(1);
    expect(mockRespondFn).toHaveBeenLastCalledWith("reverse");
    expect(queryByText("It's drawbotage time!")).not.toBeInTheDocument();
    expect(queryByText("0s")).not.toBeInTheDocument();
    expect(
      queryByRole("alert", { name: "Waiting..." })
    ).not.toBeInTheDocument();
    expect(queryByText("reverse")).not.toBeInTheDocument();

    // trigger the drawbotage selection
    act(() => {
      mockServer.emit("drawbotageSelection", {
        drawbotage: "reverse",
      });
    });
    expect(
      queryByRole("alert", { name: "Waiting for drawbotage selection" })
    ).not.toBeInTheDocument();
    expect(queryByText("0s")).not.toBeInTheDocument();
    expect(
      queryByRole("alert", { name: "Waiting..." })
    ).not.toBeInTheDocument();
    expect(getByText("A drawbotage has been selected!")).toBeInTheDocument();
    expect(getByText("reverse")).toBeInTheDocument();

    // hide the modal
    act(() => {
      mockServer.emit("hideDrawbotageSelection", {});
    });
    expect(
      queryByText("A drawbotage has been selected!")
    ).not.toBeInTheDocument();
    expect(queryByText("reverse")).not.toBeInTheDocument();
  });

  it("updates the timer on 'guessTimer' events", () => {
    const { getByRole } = startGame();

    act(() => {
      mockServer.emit("guessTimer", {
        timeRemaining: 20000,
      });
    });
    expect(
      getByRole("status", { name: "20 seconds remaining in the turn" })
    ).toHaveTextContent("20");

    act(() => {
      mockServer.emit("guessTimer", {
        timeRemaining: 9000,
      });
    });
    expect(
      getByRole("status", { name: "9 seconds remaining in the turn" })
    ).toHaveTextContent("9");

    act(() => {
      mockServer.emit("guessTimer", {
        timeRemaining: 0,
      });
    });
    expect(
      getByRole("status", { name: "0 seconds remaining in the turn" })
    ).toHaveTextContent("0");
  });

  it("displays a score update screen when a turn ends", () => {
    const { getByRole, queryByRole } = startGame();

    // check case when a player correctly guesses the word
    act(() => {
      mockServer.emit("endTurn", {
        currentTeam: "blue",
        word: "something",
        points: 50,
        prevScore: 0,
        currentScore: 50,
        timeRemaining: 53000,
        playerName: "p2",
        round: 1,
      });
    });
    expect(getByRole("status", { name: "Turn result" }).textContent).toBe(
      'The word was "something". The word was correctly guessed by p2 with 53 seconds remaining.'
    );
    expect(getByRole("status", { name: "Score update" }).textContent).toBe(
      "Team 1's new score is... 0 + 50 = 50."
    );

    // hide the modal
    act(() => {
      mockServer.emit("hideTurnResult", {});
    });
    expect(
      queryByRole("status", { name: "Turn result" })
    ).not.toBeInTheDocument();
    expect(
      queryByRole("status", { name: "Score update" })
    ).not.toBeInTheDocument();

    // check case when no player correctly guesses the word
    act(() => {
      mockServer.emit("endTurn", {
        currentTeam: "blue",
        word: "something",
        points: 0,
        prevScore: 150,
        currentScore: 150,
        timeRemaining: 0,
        playerName: "p2",
        round: 1,
      });
    });
    expect(getByRole("status", { name: "Turn result" }).textContent).toBe(
      'The word was "something". Nobody correctly guessed the word.'
    );
    expect(getByRole("status", { name: "Score update" }).textContent).toBe(
      "Team 1's new score is... 150 + 0 = 150."
    );

    // hide the modal by clicking the close button
    act(() => {
      mockServer.emit("hideTurnResult", {});
    });
    expect(
      queryByRole("status", { name: "Turn result" })
    ).not.toBeInTheDocument();
    expect(
      queryByRole("status", { name: "Score update" })
    ).not.toBeInTheDocument();
  });

  it("updates the current round when a turn ends", () => {
    const { getByRole, getByText, queryByText } = startGame();

    // check case when a player correctly guesses the word
    act(() => {
      mockServer.emit("endTurn", {
        currentTeam: "blue",
        word: "something",
        points: 50,
        prevScore: 0,
        currentScore: 50,
        timeRemaining: 11000,
        playerName: "p2",
        round: 2,
      });
      mockServer.emit("hideTurnResult", {});
    });
    expect(queryByText("Round 1")).not.toBeInTheDocument();
    expect(getByText("Round 2")).toBeInTheDocument();
  });

  it("displays a game over screen when the game ends", () => {
    const { getByRole, getByText } = startGame();

    // check when winner is red
    act(() => {
      mockServer.emit("endGame", {
        redScore: 200,
        blueScore: 100,
        redTotalDrawTime: 327000,
        blueTotalDrawTime: 193000,
        winner: "red",
      });
    });
    expect(getByText("Game over")).toBeInTheDocument();
    expect(getByRole("status", { name: "Game result" }).textContent).toBe(
      "Team 2 won!"
    );
    expect(getByRole("status", { name: "Team 1 result" }).textContent).toBe(
      "Team 1 earned 100 points while spending 193 seconds drawing."
    );
    expect(getByRole("status", { name: "Team 2 result" }).textContent).toBe(
      "Team 2 earned 200 points while spending 327 seconds drawing."
    );

    // check when winner is blue
    act(() => {
      mockServer.emit("endGame", {
        redScore: 100,
        blueScore: 200,
        redTotalDrawTime: 327000,
        blueTotalDrawTime: 193000,
        winner: "blue",
      });
    });
    expect(getByText("Game over")).toBeInTheDocument();
    expect(getByRole("status", { name: "Game result" }).textContent).toBe(
      "Team 1 won!"
    );
    expect(getByRole("status", { name: "Team 1 result" }).textContent).toBe(
      "Team 1 earned 200 points while spending 193 seconds drawing."
    );
    expect(getByRole("status", { name: "Team 2 result" }).textContent).toBe(
      "Team 2 earned 100 points while spending 327 seconds drawing."
    );
  });

  it("sends messages to the server", () => {
    const { getByRole, getByText, queryByRole, getAllByRole } = startGame();
    const input = getByRole("textbox");
    const sendButton = getByRole("button", { name: "Send message" });

    // check that the chat is initially empty
    expect(queryByRole("listitem")).not.toBeInTheDocument();
    assertionCount++;

    // check that blank messages don't get sent
    act(() => {
      fireEvent.keyDown(input, { key: "Enter", code: "Enter" });
      fireEvent.click(sendButton);
    });
    // expect(queryByRole("listitem")).not.toBeInTheDocument();
    // assertionCount++;

    // check that valid messages are emitted to the server
    const messages = ["hello", "world", "test", "a multi word test"];
    mockServer.on("guess", (data) => {
      expect(messages).toContain(data.guess);
      expect(data.playerName).toBe(playerName);
      expect(data.fromTeam).toBe("blue");
      expect(data.timeRemaining).toBeFalsy();
    });
    assertionCount += messages.length * 4;

    // check that valid messages are rendered to the chat
    act(() => {
      for (let i = 0; i < messages.length; i++) {
        fireEvent.change(input, { target: { value: messages[i] } });

        if (i % 2 === 0) {
          fireEvent.keyUp(input, { key: "Enter", code: "Enter" });
        } else {
          fireEvent.click(sendButton);
        }
      }
    });

    expect.assertions(assertionCount);
  });

  it("receives messages from the server and renders them in the chat", () => {
    const { getByText, getAllByRole } = startGame();
    const messages = ["hello", "world", "test", "a multi word test"];
    const correctGuess = "test";

    mockServer.socketClient.on("message", (data) => {
      expect(messages).toContain(data.message.guess);
      expect(data.message.playerName).toBe(playerName);
      expect(data.isCorrect).toBe(data.message.guess === correctGuess);
    });
    assertionCount += messages.length * 3;

    act(() => {
      for (let i = 0; i < messages.length; i++) {
        mockServer.emit("message", {
          message: {
            playerName,
            guess: messages[i],
          },
          isCorrect: messages[i] === correctGuess,
        });
      }
    });

    const messageElements = getAllByRole("listitem");
    for (let i = 0; i < messages.length; i++) {
      const element = messageElements[i];
      expect(element.textContent).toBe(`${playerName}:${messages[i]}`);
      assertionCount++;

      if (messages[i] === correctGuess) {
        expect(getByText(messages[i])).toHaveClass("chat-correct-guess");
        assertionCount++;
      }
    }

    expect.assertions(assertionCount);
  });

  it("disables the chat if the player is the current player", () => {
    const { getByRole } = startGame();

    act(() => {
      mockServer.emit("setCurrentPlayer", {
        currentPlayerName: playerName,
      });
    });

    expect(getByRole("textbox")).toBeDisabled();
  });

  it("disables the chat if the player is the current player", () => {
    const { getByRole } = startGame();

    act(() => {
      mockServer.emit("setCurrentPlayer", {
        currentPlayerName: playerName,
      });
    });

    expect(getByRole("textbox")).toBeDisabled();
  });

  it("redirects to the error page when the connection is disconnected", async () => {
    const { findByText } = startGame();
    const message = "The connection to the server has been disconnected";

    act(() => {
      mockServer.emit("disconnect", { message });
    });
    expect(await findByText(message)).toBeInTheDocument();
    expect(history.location.pathname).toBe("/error");
    expect(history.length).toBe(1);
  });

  it("redirects to the error page when it receives an 'error' event from the server", async () => {
    const { findByText } = startGame();
    const message = "There was a server error";

    act(() => {
      mockServer.emit("error", { message });
    });
    expect(await findByText(message)).toBeInTheDocument();
    expect(history.location.pathname).toBe("/error");
    expect(history.length).toBe(1);
  });
});
