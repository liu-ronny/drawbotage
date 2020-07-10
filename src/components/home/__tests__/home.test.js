import React from "react";
import "@testing-library/jest-dom";
import {
  render,
  fireEvent,
  wait,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import App from "../../../App";

jest.mock("../../api/getRoomId", () => {
  return jest.fn(() => "41de3945-703e-40b3-b2c3-a31c2071cbc8");
});

jest.mock("../../api/validateRoomId", () => {
  return jest.fn(() => true);
});

jest.mock("../../api/connection", () => {
  return { subscribeFromLobby: jest.fn(), unsubscribeFromLobby: jest.fn() };
});

function renderApp(props) {
  return render(<App {...props} />);
}

beforeEach(() => {
  delete window.location;
  // @ts-ignore
  window.location = new URL("http://localhost/");
});

describe("home page", () => {
  it("renders without crashing", () => {
    renderApp();
  });

  it("displays the Drawbotage name", () => {
    const { queryByText } = renderApp();
    expect(queryByText("Drawbotage")).toBeTruthy();
  });

  it("displays a 'how to play' link", () => {
    const { queryByText } = renderApp();
    expect(queryByText("How to play")).toBeTruthy();
  });

  it("displays the 'join game' and 'create game' options", () => {
    const { queryByText } = renderApp();
    expect(queryByText("Join Game")).toBeTruthy();
    expect(queryByText("Create Game")).toBeTruthy();
  });

  it("underlines the 'join game' button by default", () => {
    const { queryByText } = renderApp();
    expect(queryByText("Join Game")).toHaveClass("active-form-button");
    expect(queryByText("Create Game")).not.toHaveClass("active-form-button");
  });

  it("has input fields and a button for joining a game by default", () => {
    const { queryByPlaceholderText, getByRole } = renderApp();
    expect(queryByPlaceholderText("Your name")).toBeTruthy();
    expect(queryByPlaceholderText("Room ID")).toBeTruthy();
    expect(getByRole("button")).toHaveTextContent("Join");
  });

  it("underlines the 'create game' button when clicked", () => {
    const { getByText, queryByText } = renderApp();
    fireEvent.click(getByText("Create Game"));
    expect(getByText("Create Game")).toHaveClass("active-form-button");
    expect(queryByText("Join Game")).not.toHaveClass("active-form-button");
  });

  it("has input fields and a button for creating a game when 'create game' is clicked", () => {
    const { getByText, queryByPlaceholderText, getByRole } = renderApp();
    fireEvent.click(getByText("Create Game"));
    expect(queryByPlaceholderText("Your name")).toBeTruthy();
    expect(queryByPlaceholderText("Room name")).toBeTruthy();
    expect(getByRole("button")).toHaveTextContent("Create");
  });

  it("displays the same form when the corresponding button is clicked multiple times", () => {
    const { queryByText, queryByPlaceholderText, getByRole } = renderApp();
    const joinGameButton = queryByText("Join Game");
    const createGameButton = queryByText("Create Game");

    for (let i = 0; i < 10; i++) {
      fireEvent.click(joinGameButton);
      expect(joinGameButton).toHaveClass("active-form-button");
      expect(queryByPlaceholderText("Your name")).toBeTruthy();
      expect(queryByPlaceholderText("Room ID")).toBeTruthy();
      expect(queryByPlaceholderText("Room name")).toBeFalsy();
      expect(getByRole("button")).toHaveTextContent("Join");
    }

    for (let i = 0; i < 10; i++) {
      fireEvent.click(createGameButton);
      expect(createGameButton).toHaveClass("active-form-button");
      expect(queryByPlaceholderText("Your name")).toBeTruthy();
      expect(queryByPlaceholderText("Room name")).toBeTruthy();
      expect(queryByPlaceholderText("Room ID")).toBeFalsy();
      expect(getByRole("button")).toHaveTextContent("Create");
    }
  });

  it("correctly toggles back and forth between the 'join game' and 'create game' forms", () => {
    const { queryByText, queryByPlaceholderText, getByRole } = renderApp();
    const joinGameButton = queryByText("Join Game");
    const createGameButton = queryByText("Create Game");

    for (let i = 0; i < 20; i++) {
      const button = Math.random() < 0.5 ? joinGameButton : createGameButton;
      const visibleText = Object.is(button, joinGameButton)
        ? "Room ID"
        : "Room name";
      const hiddenText = Object.is(button, joinGameButton)
        ? "Room name"
        : "Room ID";
      const submitButtonText = Object.is(button, joinGameButton)
        ? "Join"
        : "Create";

      fireEvent.click(button);
      expect(button).toHaveClass("active-form-button");
      expect(queryByPlaceholderText("Your name")).toBeTruthy();
      expect(queryByPlaceholderText(visibleText)).toBeTruthy();
      expect(queryByPlaceholderText(hiddenText)).toBeFalsy();
      expect(getByRole("button")).toHaveTextContent(submitButtonText);
    }
  });

  it("redirects to the lobby on create", async () => {
    const {
      getByPlaceholderText,
      getByText,
      queryByText,
      queryAllByText,
      getByRole,
    } = renderApp();

    fireEvent.click(getByText("Create Game"));

    const nameInput = getByPlaceholderText("Your name");
    const roomNameInput = getByPlaceholderText("Room name");
    const createButton = getByRole("button");

    fireEvent.change(nameInput, { target: { value: "abc" } });
    fireEvent.change(roomNameInput, { target: { value: "123" } });
    fireEvent.submit(createButton);

    await wait(() => {
      expect(queryAllByText("Loading...").length).toBeGreaterThan(0);
    });
    await waitForElementToBeRemoved(() => queryAllByText("Loading...")[0]);
    expect(queryByText("Settings")).toBeTruthy();
  });

  it("redirects to the lobby on join", async () => {
    const {
      getByPlaceholderText,
      queryByText,
      queryAllByText,
      getByRole,
    } = render(<App />);
    const nameInput = getByPlaceholderText("Your name");
    const roomIdInput = getByPlaceholderText("Room ID");
    const joinButton = getByRole("button");

    fireEvent.change(nameInput, { target: { value: "abc" } });
    fireEvent.change(roomIdInput, {
      target: { value: "41de3945-703e-40b3-b2c3-a31c2071cbc8" },
    });
    fireEvent.submit(joinButton);

    await wait(() => {
      expect(queryAllByText("Loading...").length).toBeGreaterThan(0);
    });
    await waitForElementToBeRemoved(() => queryAllByText("Loading...")[0]);
    expect(queryByText("Settings")).toBeTruthy();
  });
});
