import React from "react";
import {
  render,
  fireEvent,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import JoinForm from "../form/joinForm/joinForm";
import validateRoomId from "../../../api/validateRoomId";
import validatePlayerName from "../../../api/validatePlayerName";

jest.mock("../../../api/validateRoomId");
jest.mock("../../../api/validatePlayerName");

function renderForm(props) {
  return render(<JoinForm {...props} />);
}

const roomId = "41de3945-703e-40b3-b2c3-a31c2071cbc8";

describe("join form", () => {
  it("does not render when the 'selected' prop is not set", () => {
    const { container: container1 } = renderForm();
    expect(container1).toBeEmpty();

    const { container: container2 } = renderForm({ isSelected: false });
    expect(container2).toBeEmpty();

    const { container: container3 } = renderForm({ isSelected: false, roomId });
    expect(container3).toBeEmpty();

    const { container: container4 } = renderForm({ roomId });
    expect(container4).toBeEmpty();
  });

  it("validates the name field correctly", async () => {
    const { getByPlaceholderText, findByText, queryByText } = renderForm({
      isSelected: true,
    });

    const nameInput = getByPlaceholderText("Your name");
    fireEvent.focus(nameInput);
    fireEvent.blur(nameInput);
    expect(await findByText("Required")).toBeInTheDocument();

    validatePlayerName.mockReturnValueOnce(false);
    fireEvent.change(nameInput, { target: { value: "a" } });
    await waitForElementToBeRemoved(() => queryByText("Required"));
    expect(queryByText("Required")).not.toBeInTheDocument();
    expect(
      await findByText("Someone is already using that name")
    ).toBeInTheDocument();

    validatePlayerName.mockReturnValue(true);
    fireEvent.change(nameInput, { target: { value: "" } });
    await waitForElementToBeRemoved(() =>
      queryByText("Someone is already using that name")
    );
    expect(await findByText("Required")).toBeInTheDocument();

    fireEvent.change(nameInput, { target: { value: "abc" } });
    await waitForElementToBeRemoved(() => queryByText("Required"));
    expect(
      queryByText("Someone is already using that name")
    ).not.toBeInTheDocument();
  });

  it("validates the room ID field correctly", async () => {
    const { getByPlaceholderText, findByText, queryByText } = renderForm({
      isSelected: true,
    });

    const roomIdInput = getByPlaceholderText("Room ID");
    fireEvent.focus(roomIdInput);
    fireEvent.blur(roomIdInput);
    expect(await findByText("Required")).toBeInTheDocument();

    validateRoomId.mockReturnValueOnce(false);
    fireEvent.change(roomIdInput, { target: { value: "a" } });
    expect(await findByText("Invalid room ID")).toBeInTheDocument();

    validateRoomId.mockReturnValueOnce(true);
    fireEvent.change(roomIdInput, { target: { value: "ab" } });
    await waitForElementToBeRemoved(() => queryByText("Invalid room ID"));
    expect(queryByText("Invalid room ID")).not.toBeInTheDocument();

    fireEvent.change(roomIdInput, { target: { value: "" } });
    expect(await findByText("Required")).toBeInTheDocument();
  });

  it("renders with a filled-in room ID when the 'roomId' prop is provided", () => {
    const { getByPlaceholderText } = renderForm({
      isSelected: true,
      roomId,
    });

    expect(getByPlaceholderText("Your name")).toHaveValue("");
    expect(getByPlaceholderText("Room ID")).toHaveValue(roomId);
  });

  it("has 'Join' as the submit button text", () => {
    const { getByRole } = renderForm({ isSelected: true });

    expect(getByRole("button")).toHaveTextContent("Join");
  });
});
