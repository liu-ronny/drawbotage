import React from "react";
import { Router, Route } from "react-router-dom";
import { createMemoryHistory } from "history";
import { render, fireEvent } from "@testing-library/react";
import Home from "../home";
import createRoomId from "../../../api/createRoomId";
import validateRoomId from "../../../api/validateRoomId";
import validatePlayerName from "../../../api/validatePlayerName";

jest.mock("../../../api/createRoomId");
jest.mock("../../../api/validateRoomId");
jest.mock("../../../api/validatePlayerName");

function renderHome(history) {
  return render(
    <Router history={history}>
      <Route path="/" exact>
        <Home />
      </Route>
      <Route path="/:id">
        <div>Settings</div>
      </Route>
    </Router>
  );
}

let history;
const roomId = "41de3945-703e-40b3-b2c3-a31c2071cbc8";

beforeEach(() => {
  history = createMemoryHistory();
});

describe("home page", () => {
  it("displays the Drawbotage name", () => {
    const { queryByText } = renderHome(history);
    expect(queryByText("Drawbotage")).toBeInTheDocument();
  });

  it("displays a 'how to play' link", () => {
    const { queryByRole } = renderHome(history);
    expect(queryByRole("link", { name: "How to play" })).toBeInTheDocument();
  });

  it("displays the 'join game' and 'create game' options", () => {
    const { queryByText } = renderHome(history);
    expect(queryByText("Join Game")).toBeInTheDocument();
    expect(queryByText("Create Game")).toBeInTheDocument();
  });

  it("underlines the 'join game' button by default", () => {
    const { getByText } = renderHome(history);
    expect(getByText("Join Game")).toHaveClass("home-form-tab--active");
    expect(getByText("Create Game")).not.toHaveClass("home-form-tab--active");
  });

  it("has input fields and a button for joining a game by default", () => {
    const { queryByPlaceholderText, getByRole } = renderHome(history);
    expect(queryByPlaceholderText("Your name")).toBeInTheDocument();
    expect(queryByPlaceholderText("Room ID")).toBeInTheDocument();
    expect(getByRole("button")).toHaveTextContent("Join");
  });

  it("underlines the 'create game' button when clicked", () => {
    const { getByText } = renderHome(history);
    fireEvent.click(getByText("Create Game"));
    expect(getByText("Create Game")).toHaveClass("home-form-tab--active");
    expect(getByText("Join Game")).not.toHaveClass("home-form-tab--active");
  });

  it("has input fields and a button for creating a game when 'create game' is clicked", () => {
    const { getByText, queryByPlaceholderText, getByRole } = renderHome(
      history
    );
    fireEvent.click(getByText("Create Game"));
    expect(queryByPlaceholderText("Your name")).toBeInTheDocument();
    expect(queryByPlaceholderText("Room name")).toBeInTheDocument();
    expect(getByRole("button")).toHaveTextContent("Create");
  });

  it("displays the same form when the corresponding button is clicked multiple times", () => {
    const { getByText, queryByPlaceholderText, getByRole } = renderHome(
      history
    );
    const joinGameTab = getByText("Join Game");
    const createGameTab = getByText("Create Game");

    for (let i = 0; i < 10; i++) {
      fireEvent.click(joinGameTab);
      expect(joinGameTab).toHaveClass("home-form-tab--active");
      expect(queryByPlaceholderText("Your name")).toBeInTheDocument();
      expect(queryByPlaceholderText("Room ID")).toBeInTheDocument();
      expect(queryByPlaceholderText("Room name")).not.toBeInTheDocument();
      expect(getByRole("button")).toHaveTextContent("Join");
    }

    for (let i = 0; i < 10; i++) {
      fireEvent.click(createGameTab);
      expect(createGameTab).toHaveClass("home-form-tab--active");
      expect(queryByPlaceholderText("Your name")).toBeInTheDocument();
      expect(queryByPlaceholderText("Room name")).toBeInTheDocument();
      expect(queryByPlaceholderText("Room ID")).not.toBeInTheDocument();
      expect(getByRole("button")).toHaveTextContent("Create");
    }
  });

  it("correctly toggles back and forth between the 'join game' and 'create game' forms", () => {
    const { queryByText, queryByPlaceholderText, getByRole } = renderHome(
      history
    );
    const joinGameTab = queryByText("Join Game");
    const createGameTab = queryByText("Create Game");
    let currentTab = joinGameTab;

    for (let i = 0; i < 20; i++) {
      currentTab = Object.is(currentTab, joinGameTab)
        ? createGameTab
        : joinGameTab;
      const visibleText = Object.is(currentTab, joinGameTab)
        ? "Room ID"
        : "Room name";
      const hiddenText = Object.is(currentTab, joinGameTab)
        ? "Room name"
        : "Room ID";
      const submitButtonText = Object.is(currentTab, joinGameTab)
        ? "Join"
        : "Create";

      fireEvent.click(currentTab);
      expect(currentTab).toHaveClass("home-form-tab--active");
      expect(queryByPlaceholderText("Your name")).toBeInTheDocument();
      expect(queryByPlaceholderText(visibleText)).toBeInTheDocument();
      expect(queryByPlaceholderText(hiddenText)).not.toBeInTheDocument();
      expect(getByRole("button")).toHaveTextContent(submitButtonText);
    }
  });

  it("redirects to a /:id path on create", async () => {
    const {
      getByPlaceholderText,
      getByText,
      findByText,
      getByRole,
    } = renderHome(history);

    fireEvent.click(getByText("Create Game"));

    const nameInput = getByPlaceholderText("Your name");
    const roomNameInput = getByPlaceholderText("Room name");
    const createButton = getByRole("button");

    createRoomId.mockReturnValue(roomId);
    fireEvent.change(nameInput, { target: { value: "abc" } });
    fireEvent.change(roomNameInput, { target: { value: "123" } });
    fireEvent.submit(createButton);

    expect(await findByText("Settings")).toBeInTheDocument();
    expect(history.location.pathname).toBe(`/${roomId}`);
  });

  it("redirects to a /:id path on join", async () => {
    const { getByPlaceholderText, findByText, getByRole } = renderHome(history);
    const nameInput = getByPlaceholderText("Your name");
    const roomIdInput = getByPlaceholderText("Room ID");
    const joinButton = getByRole("button");

    validateRoomId.mockReturnValue(true);
    validatePlayerName.mockReturnValue(true);
    fireEvent.change(nameInput, { target: { value: "abc" } });
    fireEvent.change(roomIdInput, {
      target: { value: roomId },
    });
    fireEvent.submit(joinButton);

    expect(await findByText("Settings")).toBeInTheDocument();
    expect(history.location.pathname).toBe(`/${roomId}`);
  });

  it("displays an error on an unsuccessful create", async () => {
    const {
      getByPlaceholderText,
      getByText,
      getByRole,
      findByRole,
    } = renderHome(history);

    fireEvent.click(getByText("Create Game"));

    const nameInput = getByPlaceholderText("Your name");
    const roomNameInput = getByPlaceholderText("Room name");
    const createButton = getByRole("button");

    createRoomId.mockImplementation(() => {
      throw new Error();
    });

    fireEvent.change(nameInput, { target: { value: "abc" } });
    fireEvent.change(roomNameInput, { target: { value: "123" } });
    fireEvent.submit(createButton);

    expect(await findByRole("alert")).toHaveTextContent(
      "Unable to create room. Please try again later."
    );
  });
});
