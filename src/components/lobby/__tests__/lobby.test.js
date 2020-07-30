import React from "react";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import { Route } from "react-router-dom";
import {
  render,
  fireEvent,
  act,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Lobby from "../lobby";
import connection from "../../../api/connection";
import Home from "../../home/home";

const emitMock = jest.fn();
connection.open = jest.fn();
connection.subscribe = jest.fn();
connection.close = jest.fn();
connection.emit = emitMock;

Object.defineProperty(navigator, "clipboard", {
  value: {
    writeText: jest.fn(() => Promise.resolve(0)),
  },
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
    </Router>
  );
}

let history;
const playerName = "test";
const roomId = "41de3945-703e-40b3-b2c3-a31c2071cbc8";
const url = "http://localhost:3000/" + roomId;
let joinRoom = false;
let createRoom = true;
const roundOptions = ["3", "5", "7"];
const drawTimeOptions = ["60", "80", "100"];

beforeEach(() => {
  history = createMemoryHistory();
  emitMock.mockClear();
});

describe("lobby page", () => {
  it("displays the Drawbotage name", () => {
    const { queryByText } = renderLobby(history, {
      playerName,
      roomId,
      joinRoom,
      createRoom,
    });
    expect(queryByText("Drawbotage")).toBeInTheDocument();
  });

  it("displays a 'Settings' header", () => {
    const { queryByText } = renderLobby(history, {
      playerName,
      roomId,
      joinRoom,
      createRoom,
    });
    expect(queryByText("Settings")).toBeInTheDocument();
  });

  it("allows the player who creates a game to choose round and draw time options", async () => {
    const { getAllByRole } = renderLobby(history, {
      playerName,
      roomId,
      joinRoom,
      createRoom,
    });

    const selects = getAllByRole("combobox");
    const options = getAllByRole("option");
    expect(selects).toHaveLength(2);
    expect(options).toHaveLength(6);

    const [rounds, drawTime] = selects;
    expect(rounds).toHaveValue(roundOptions[0]);
    expect(drawTime).toHaveValue(drawTimeOptions[0]);

    for (let i = 0; i < 3; i++) {
      expect(options[i]).toHaveTextContent(roundOptions[i]);
      expect(options[i + 3]).toHaveTextContent(drawTimeOptions[i]);

      act(() => {
        userEvent.selectOptions(rounds, roundOptions[i]);
      });
      expect(rounds).toHaveValue(roundOptions[i]);
      expect(emitMock).toHaveBeenLastCalledWith("updateSettings", {
        roomId,
        settingName: "rounds",
        settingValue: parseInt(roundOptions[i]),
      });

      act(() => {
        userEvent.selectOptions(drawTime, drawTimeOptions[i]);
      });
      expect(drawTime).toHaveValue(drawTimeOptions[i]);
      expect(emitMock).toHaveBeenLastCalledWith("updateSettings", {
        roomId,
        settingName: "drawTime",
        settingValue: parseInt(drawTimeOptions[i]),
      });
    }

    expect(emitMock).toHaveBeenCalledTimes(6);
  });

  it("displays a url for the game and allows players to copy it", async () => {
    const { getByLabelText, getByRole, findByRole, queryByRole } = renderLobby(
      history,
      {
        playerName,
        roomId,
        joinRoom,
        createRoom,
      }
    );

    expect(getByLabelText("Invite friends")).toHaveValue(url);

    const copyButton = getByRole("button", { name: "Copy" });
    fireEvent.click(copyButton);
    expect(
      await findByRole("alert", { name: "Link copied!" })
    ).toBeInTheDocument();

    await waitForElementToBeRemoved(
      () => queryByRole("alert", { name: "Link copied!" }),
      { timeout: 3000 }
    );
  });

  it("disallows players who are not the host to change the settings", async () => {
    const { getAllByRole } = renderLobby(history, {
      playerName,
      roomId,
      joinRoom: true,
      createRoom: false,
    });

    const selects = getAllByRole("combobox");
    for (const select of selects) {
      expect(select).toBeDisabled();
    }
  });

  it("redirects players to the home page when they click the 'Leave' button", async () => {
    const { getByRole, findByText } = renderLobby(history, {
      playerName,
      roomId,
      joinRoom,
      createRoom,
    });

    fireEvent.click(getByRole("button", { name: "Leave" }));
    expect(emitMock).toHaveBeenLastCalledWith("leaveGame", {
      roomId,
      playerName,
    });

    expect(await findByText("Join Game")).toBeInTheDocument();
    expect(history.location.pathname).toBe("/");
    expect(history.location.state).toBeFalsy();
    expect(history.length).toBe(1);
  });

  it("does not allow the game to start when there are less than 2 players on each team", async () => {
    const { getByRole, findByRole } = renderLobby(history, {
      playerName,
      roomId,
      joinRoom,
      createRoom,
    });
    fireEvent.click(getByRole("button", { name: "Start game" }));
    expect(emitMock).not.toHaveBeenCalled();

    expect(
      await findByRole("alert", {
        name:
          "There must be at least 2 players on each team before the game can start.",
      })
    ).toBeInTheDocument();
  });

  it("does not display a 'Start game' button for non-hosts", async () => {
    const { queryByRole } = renderLobby(history, {
      playerName,
      roomId,
      joinRoom: true,
      createRoom: false,
    });
    expect(
      queryByRole("button", { name: "Start game" })
    ).not.toBeInTheDocument();
  });
});
