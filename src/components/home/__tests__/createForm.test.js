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
import CreateForm from "../createForm";

jest.mock("../api/getRoomID", () => {
  return jest.fn(() => "41de3945-703e-40b3-b2c3-a31c2071cbc8");
});

function renderForm(props) {
  const history = createMemoryHistory();

  return {
    history,
    utils: render(
      <Router history={history}>
        <Route>
          <CreateForm selected={true} {...props} />
        </Route>
      </Router>
    ),
  };
}

describe("create form", () => {
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

  it("validates the room name field correctly", async () => {
    const {
      getByPlaceholderText,
      findByText,
      queryByText,
    } = renderForm().utils;

    const roomIdInput = getByPlaceholderText("Room name");
    fireEvent.focus(roomIdInput);
    fireEvent.blur(roomIdInput);

    let errorMsg = await findByText("Required");
    expect(errorMsg).toBeTruthy();

    fireEvent.change(roomIdInput, { target: { value: "a" } });
    await waitForElementToBeRemoved(() => queryByText("Required"));
    expect(queryByText("Required")).toBeFalsy();

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
  //   const roomNameInput = getByPlaceholderText("Room name");
  //   const createButton = getByRole("button");

  //   fireEvent.submit(createButton);
  //   const errorMsgs = await findAllByText("Required");
  //   expect(errorMsgs).toHaveLength(2);

  //   fireEvent.change(nameInput, { target: { value: "a" } });
  //   fireEvent.submit(createButton);
  //   let errorMsg = await findByText("Required");
  //   expect(errorMsg).toBeTruthy();

  //   fireEvent.change(nameInput, { target: { value: "" } });
  //   fireEvent.change(roomNameInput, { target: { value: "123" } });
  //   fireEvent.submit(createButton);
  //   errorMsg = await findByText("Required");
  //   expect(errorMsg).toBeTruthy();

  //   fireEvent.change(nameInput, { target: { value: "abc" } });
  //   await waitForElementToBeRemoved(() => queryByText("Required"));
  //   expect(queryByText("Required")).toBeFalsy();

  //   fireEvent.submit(createButton);

  //   await wait(() => {
  //     expect(history.location.pathname).toBe("/12345");
  //     expect(history.location.state.name).toBe("abc");
  //     expect(history.location.state.roomName).toBe("123");
  //     expect(history.location.state.create).toBe(true);
  //   });
  // });
});
