import React from "react";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import { Route } from "react-router-dom";
import { render, fireEvent, waitFor, act } from "@testing-library/react";
import Lobby from "../lobby";
import Home from "../../home/home";
import ErrorPage from "../../errorPage";
import MockSocket from "socket.io-mock";

jest.mock("socket.io-client", () => {
  return jest.fn(() => mockClient);
});
jest.mock("../../game/game", () => {
  return () => <div>Game mock</div>;
});

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
const playerName = "test";
const roomId = "41de3945-703e-40b3-b2c3-a31c2071cbc8";
let joinRoom = true;
let createRoom = false;
const roundOptions = [3, 5, 7];
const drawTimeOptions = [60, 80, 100];

beforeEach(() => {
  history = createMemoryHistory();
  mockServer = new MockSocket();
  mockClient = mockServer.socketClient;
  mockClient.close = jest.fn();
  assertionCount = 0;
});

describe("lobby page", () => {
  it("emits a 'createGame' event to the server when a player creates a game", () => {
    mockServer.on("createGame", (data) => {
      expect(data.playerName).toBe(playerName);
      expect(data.roomId).toBe(roomId);
      expect(data.rounds).toBe(roundOptions[0]);
      expect(data.drawTime).toBe(drawTimeOptions[0]);
    });
    assertionCount += 4;

    renderLobby(history, {
      playerName,
      roomId,
      joinRoom: false,
      createRoom: true,
    });

    expect.assertions(assertionCount);
  });

  it("emits a 'joinGame' event to the server when a player joins a game", () => {
    mockServer.on("joinGame", (data) => {
      expect(data.playerName).toBe(playerName);
      expect(data.roomId).toBe(roomId);
      expect(data.rounds).toBe(roundOptions[0]);
      expect(data.drawTime).toBe(drawTimeOptions[0]);
    });
    assertionCount += 4;

    renderLobby(history, {
      playerName,
      roomId,
      joinRoom,
      createRoom,
    });

    expect.assertions(assertionCount);
  });

  it("emits a 'leaveGame' event to the server when a player leaves a game", () => {
    const { getByRole } = renderLobby(history, {
      playerName,
      roomId,
      joinRoom,
      createRoom,
    });

    mockServer.on("leaveGame", (data) => {
      expect(data.playerName).toBe(playerName);
      expect(data.roomId).toBe(roomId);
    });
    assertionCount += 2;

    fireEvent.click(getByRole("button", { name: "Leave" }));
    expect.assertions(assertionCount);
  });

  it("updates settings when it receives an 'info' event from the server", () => {
    const { getAllByRole } = renderLobby(history, {
      playerName,
      roomId,
      joinRoom,
      createRoom,
    });

    act(() => {
      mockServer.emit("info", {
        host: "",
        bluePlayerNames: [],
        redPlayerNames: [],
        unassignedPlayerNames: [playerName],
        rounds: roundOptions[1],
        drawTime: drawTimeOptions[0],
      });
    });
    expect(getAllByRole("combobox")[0]).toHaveValue(roundOptions[1].toString());

    act(() => {
      mockServer.emit("info", {
        host: "",
        bluePlayerNames: [],
        redPlayerNames: [],
        unassignedPlayerNames: [playerName],
        rounds: roundOptions[1],
        drawTime: drawTimeOptions[2],
      });
    });
    expect(getAllByRole("combobox")[1]).toHaveValue(
      drawTimeOptions[2].toString()
    );

    act(() => {
      mockServer.emit("info", {
        host: "",
        bluePlayerNames: [],
        redPlayerNames: [],
        unassignedPlayerNames: [playerName],
        rounds: roundOptions[2],
        drawTime: drawTimeOptions[0],
      });
    });
    expect(getAllByRole("combobox")[0]).toHaveValue(roundOptions[2].toString());
    expect(getAllByRole("combobox")[1]).toHaveValue(
      drawTimeOptions[0].toString()
    );

    for (let select of getAllByRole("combobox")) {
      expect(select).toBeDisabled();
    }
  });

  it("redirects to the error page when the connection is disconnected", async () => {
    const { findByText } = renderLobby(history, {
      playerName,
      roomId,
      joinRoom,
      createRoom,
    });
    const message = "The connection to the server has been disconnected";

    act(() => {
      mockServer.emit("disconnect", { message });
    });
    expect(await findByText(message)).toBeInTheDocument();
    expect(history.location.pathname).toBe("/error");
    expect(history.length).toBe(1);
  });

  it("redirects to the error page when it receives an 'error' event from the server", async () => {
    const { findByText } = renderLobby(history, {
      playerName,
      roomId,
      joinRoom,
      createRoom,
    });
    const message = "There was a server error";

    act(() => {
      mockServer.emit("error", { message });
    });
    expect(await findByText(message)).toBeInTheDocument();
    expect(history.location.pathname).toBe("/error");
    expect(history.length).toBe(1);
  });

  it("does not allow the game to start when there are less than 2 players on each team", async () => {
    const { getByRole, findByRole, queryByRole } = renderLobby(history, {
      playerName,
      roomId,
      joinRoom: false,
      createRoom: true,
    });
    fireEvent.click(getByRole("button", { name: "Start game" }));

    // no players on either team
    expect(
      await findByRole("alert", {
        name:
          "There must be at least 2 players on each team before the game can start.",
      })
    ).toBeInTheDocument();

    async function assertPlayerCountError(
      bluePlayerNames,
      redPlayerNames,
      unassignedPlayerNames
    ) {
      act(() => {
        mockServer.emit("info", {
          host: playerName,
          bluePlayerNames,
          redPlayerNames,
          unassignedPlayerNames,
          rounds: roundOptions[0],
          drawTime: drawTimeOptions[0],
        });
      });
      fireEvent.click(getByRole("button", { name: "Start game" }));

      const alert = await findByRole("alert", {
        name:
          "There must be at least 2 players on each team before the game can start.",
      });
      expect(alert).toBeInTheDocument();
      expect(
        queryByRole("alert", {
          name:
            "All players must be assigned to a team before the game can start.",
        })
      ).not.toBeInTheDocument();

      fireEvent.click(alert);
      await waitFor(() =>
        expect(
          queryByRole("alert", {
            name:
              "There must be at least 2 players on each team before the game can start.",
          })
        ).not.toBeInTheDocument()
      );
    }

    await assertPlayerCountError([playerName], [], []); // 1 player on blue team
    await assertPlayerCountError([], [playerName], []); // 1 player on red team
    await assertPlayerCountError(["a"], [playerName], []); // 1 player on both teams
    await assertPlayerCountError(["a", "b"], [playerName], []); // 2 players on blue team and 1 player on red team
    await assertPlayerCountError(["a"], [playerName, "b"], []); // 2 players on red team and 1 player on blue team
  });

  it("does not allow the game to start when there are unassigned players", async () => {
    const { getByRole, findByRole, queryByRole } = renderLobby(history, {
      playerName,
      roomId,
      joinRoom: false,
      createRoom: true,
    });

    async function assertUnassignedPlayerError(
      bluePlayerNames,
      redPlayerNames,
      unassignedPlayerNames
    ) {
      act(() => {
        mockServer.emit("info", {
          host: playerName,
          bluePlayerNames,
          redPlayerNames,
          unassignedPlayerNames,
          rounds: roundOptions[0],
          drawTime: drawTimeOptions[0],
        });
      });
      fireEvent.click(getByRole("button", { name: "Start game" }));

      const alert = await findByRole("alert", {
        name:
          "All players must be assigned to a team before the game can start.",
      });
      expect(alert).toBeInTheDocument();
      expect(
        queryByRole("alert", {
          name:
            "There must be at least 2 players on each team before the game can start.",
        })
      ).not.toBeInTheDocument();

      fireEvent.click(alert);
      await waitFor(() =>
        expect(
          queryByRole("alert", {
            name:
              "All players must be assigned to a team before the game can start.",
          })
        ).not.toBeInTheDocument()
      );
    }

    // Just enough players on both teams to start
    await assertUnassignedPlayerError(["a", "b"], [playerName, "c"], ["d"]);
    await assertUnassignedPlayerError(
      ["a", "b"],
      [playerName, "c"],
      ["d", "e", "f"]
    );

    // More than enough players on both teams to start
    await assertUnassignedPlayerError(
      ["a", "b", "d"],
      [playerName, "c"],
      ["e"]
    );
    await assertUnassignedPlayerError(
      ["a", "b"],
      [playerName, "c", "d"],
      ["e"]
    );
    await assertUnassignedPlayerError(
      ["a", "b", "d"],
      [playerName, "c"],
      ["e", "f", "g"]
    );
    await assertUnassignedPlayerError(
      ["a", "b"],
      [playerName, "c", "d"],
      ["e", "f", "g"]
    );
  });

  it("only displays one error message at a time", async () => {
    const { getByRole, findByRole, queryByRole } = renderLobby(history, {
      playerName,
      roomId,
      joinRoom: false,
      createRoom: true,
    });

    // trigger a playerCountError then trigger an unassignedPlayerError
    fireEvent.click(getByRole("button", { name: "Start game" }));
    expect(
      await findByRole("alert", {
        name:
          "There must be at least 2 players on each team before the game can start.",
      })
    ).toBeInTheDocument();
    expect(
      queryByRole("alert", {
        name:
          "All players must be assigned to a team before the game can start.",
      })
    ).not.toBeInTheDocument();

    act(() => {
      mockServer.emit("info", {
        host: playerName,
        bluePlayerNames: ["a", "b"],
        redPlayerNames: ["c", "d"],
        unassignedPlayerNames: [playerName],
        rounds: roundOptions[0],
        drawTime: drawTimeOptions[0],
      });
    });
    fireEvent.click(getByRole("button", { name: "Start game" }));
    expect(
      await findByRole("alert", {
        name:
          "All players must be assigned to a team before the game can start.",
      })
    ).toBeInTheDocument();
    expect(
      queryByRole("alert", {
        name:
          "There must be at least 2 players on each team before the game can start.",
      })
    ).not.toBeInTheDocument();

    // trigger a playerCountError after the unassignedPlayerError
    act(() => {
      mockServer.emit("info", {
        host: playerName,
        bluePlayerNames: ["a"],
        redPlayerNames: ["c", "d"],
        unassignedPlayerNames: [playerName],
        rounds: roundOptions[0],
        drawTime: drawTimeOptions[0],
      });
    });
    fireEvent.click(getByRole("button", { name: "Start game" }));
    expect(
      await findByRole("alert", {
        name:
          "There must be at least 2 players on each team before the game can start.",
      })
    ).toBeInTheDocument();
    expect(
      queryByRole("alert", {
        name:
          "All players must be assigned to a team before the game can start.",
      })
    ).not.toBeInTheDocument();
  });

  it("changes permissions when the host changes", async () => {
    const { getAllByRole, getByText, queryByRole } = renderLobby(history, {
      playerName,
      roomId,
      joinRoom: true,
      createRoom: false,
    });

    act(() => {
      mockServer.emit("info", {
        host: "a",
        bluePlayerNames: ["a", "b"],
        redPlayerNames: ["c", playerName],
        unassignedPlayerNames: [],
        rounds: roundOptions[0],
        drawTime: drawTimeOptions[0],
      });
    });
    expect(getByText("a")).toHaveClass("host-player-tag");
    expect(getByText("b")).not.toHaveClass("host-player-tag");
    expect(getByText("c")).not.toHaveClass("host-player-tag");
    expect(getByText(playerName)).not.toHaveClass("host-player-tag");
    let selects = getAllByRole("combobox");
    expect(selects[0]).toBeDisabled();
    expect(selects[1]).toBeDisabled();
    expect(
      queryByRole("button", { name: "Start game" })
    ).not.toBeInTheDocument();

    act(() => {
      mockServer.emit("info", {
        host: playerName,
        bluePlayerNames: ["b"],
        redPlayerNames: ["c", playerName],
        unassignedPlayerNames: [],
        rounds: roundOptions[0],
        drawTime: drawTimeOptions[0],
      });
    });
    expect(getByText(playerName)).toHaveClass("host-player-tag");
    expect(getByText("b")).not.toHaveClass("host-player-tag");
    expect(getByText("c")).not.toHaveClass("host-player-tag");
    selects = getAllByRole("combobox");
    expect(selects[0]).not.toBeDisabled();
    expect(selects[1]).not.toBeDisabled();
    expect(queryByRole("button", { name: "Start game" })).toBeInTheDocument();
  });

  it("displays the 'Game' component on start", async () => {
    const { getByRole, findByText } = renderLobby(history, {
      playerName,
      roomId,
      joinRoom: false,
      createRoom: true,
    });
    const gameInfo = {
      host: playerName,
      bluePlayerNames: ["a", "b"],
      redPlayerNames: ["c", playerName],
      unassignedPlayerNames: [],
      rounds: roundOptions[0],
      drawTime: drawTimeOptions[0],
    };

    act(() => {
      mockServer.emit("info", gameInfo);
    });

    mockServer.on("startGame", (data) => {
      expect(data.roomId).toBe(roomId);
      mockServer.emit("startGame", gameInfo);
    });
    assertionCount++;

    fireEvent.click(getByRole("button", { name: "Start game" }));
    expect(await findByText("Game mock")).toBeInTheDocument();
    assertionCount++;

    expect.assertions(assertionCount);
  });
});
