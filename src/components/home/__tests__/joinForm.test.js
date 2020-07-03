import React from "react";
import { Router, Route } from "react-router-dom";
import "@testing-library/jest-dom";
import {
  render,
  fireEvent,
  waitForElementToBeRemoved,
  wait,
} from "@testing-library/react";
import { createMemoryHistory } from "history";
import JoinForm from "../joinForm";
import validateRoomIDMock from "../api/validateRoomID";

jest.mock("../api/validateRoomID", () => {
  return jest.fn(() => false);
});

function renderForm(props) {
  const history = createMemoryHistory();

  return {
    history,
    utils: render(
      <Router history={history}>
        <Route>
          <JoinForm selected={true} {...props} />
        </Route>
      </Router>
    ),
  };
}

describe("join form", () => {
  it("validates the name field correctly", async () => {
    const {
      getByPlaceholderText,
      findByText,
      queryByText,
    } = renderForm().utils;

    const nameInput = getByPlaceholderText("Your name");
    fireEvent.focus(nameInput);
    fireEvent.blur(nameInput);

    let errorMsg = await findByText("Required");
    expect(errorMsg).toBeTruthy();

    fireEvent.change(nameInput, { target: { value: "a" } });
    await waitForElementToBeRemoved(() => queryByText("Required"));
    expect(queryByText("Required")).toBeFalsy();

    fireEvent.change(nameInput, { target: { value: "" } });
    errorMsg = await findByText("Required");
    expect(errorMsg).toBeTruthy();
  });

  it("validates the room ID field correctly", async () => {
    const {
      getByPlaceholderText,
      findByText,
      queryByText,
    } = renderForm().utils;

    const roomIdInput = getByPlaceholderText("Room ID");
    fireEvent.focus(roomIdInput);
    fireEvent.blur(roomIdInput);

    let errorMsg = await findByText("Required");
    expect(errorMsg).toBeTruthy();

    fireEvent.change(roomIdInput, { target: { value: "a" } });
    errorMsg = await findByText("Invalid room ID");
    expect(errorMsg).toBeTruthy();

    validateRoomIDMock.mockImplementationOnce(() => true);
    fireEvent.change(roomIdInput, { target: { value: "ab" } });
    await waitForElementToBeRemoved(() => queryByText("Invalid room ID"));
    expect(queryByText("Invalid room ID")).toBeFalsy();

    fireEvent.change(roomIdInput, { target: { value: "" } });
    errorMsg = await findByText("Required");
    expect(errorMsg).toBeTruthy();
  });

  // it("validates correctly on submission", async () => {
  //   const { history, utils } = renderForm();
  //   const {
  //     getByPlaceholderText,
  //     findByText,
  //     getByRole,
  //     findAllByText,
  //     queryByText,
  //   } = utils;
  //   const nameInput = getByPlaceholderText("Your name");
  //   const roomIdInput = getByPlaceholderText("Room ID");
  //   const joinButton = getByRole("button");

  //   fireEvent.submit(joinButton);
  //   const errorMsgs = await findAllByText("Required");
  //   expect(errorMsgs).toHaveLength(2);

  //   fireEvent.change(nameInput, { target: { value: "a" } });
  //   fireEvent.submit(joinButton);
  //   let errorMsg = await findByText("Required");
  //   expect(errorMsg).toBeTruthy();

  //   validateRoomIDMock.mockImplementation(() => true);
  //   fireEvent.change(nameInput, { target: { value: "" } });
  //   fireEvent.change(roomIdInput, { target: { value: "123" } });
  //   fireEvent.submit(joinButton);
  //   errorMsg = await findByText("Required");
  //   expect(errorMsg).toBeTruthy();

  //   fireEvent.change(nameInput, { target: { value: "abc" } });
  //   await waitForElementToBeRemoved(() => queryByText("Required"));
  //   expect(queryByText("Required")).toBeFalsy();
  //   expect(queryByText("Invalid room ID")).toBeFalsy();

  //   fireEvent.submit(joinButton);

  //   await wait(() => {
  //     expect(history.location.pathname).toBe("/123");
  //     expect(history.location.state.name).toBe("abc");
  //     expect(history.location.state.roomID).toBe("123");
  //   });

  //   validateRoomIDMock.mockImplementation(() => false);
  // });
});
