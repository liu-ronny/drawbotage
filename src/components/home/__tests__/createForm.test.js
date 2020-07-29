import React from "react";
import "@testing-library/jest-dom";
import {
  render,
  fireEvent,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import CreateForm from "../form/createForm/createForm";

function renderForm(props) {
  return render(<CreateForm {...props} />);
}

describe("create form", () => {
  it("does not render when the 'selected' prop is not set", () => {
    const { container: container1 } = renderForm();
    expect(container1).toBeEmpty();

    const { container: container2 } = renderForm({ isSelected: false });
    expect(container2).toBeEmpty();
  });

  it("validates the name field correctly", async () => {
    const { getByPlaceholderText, findByText, queryByText } = renderForm({
      isSelected: true,
    });

    const nameInput = getByPlaceholderText("Your name");
    fireEvent.focus(nameInput);
    fireEvent.blur(nameInput);
    expect(await findByText("Required")).toBeInTheDocument();

    fireEvent.change(nameInput, { target: { value: "a" } });
    await waitForElementToBeRemoved(() => queryByText("Required"));
    expect(queryByText("Required")).not.toBeInTheDocument();

    fireEvent.change(nameInput, { target: { value: "" } });
    expect(await findByText("Required")).toBeInTheDocument();
  });

  it("validates the room name field correctly", async () => {
    const { getByPlaceholderText, findByText, queryByText } = renderForm({
      isSelected: true,
    });

    const roomIdInput = getByPlaceholderText("Room name");
    fireEvent.focus(roomIdInput);
    fireEvent.blur(roomIdInput);
    expect(await findByText("Required")).toBeInTheDocument();

    fireEvent.change(roomIdInput, { target: { value: "a" } });
    await waitForElementToBeRemoved(() => queryByText("Required"));
    expect(queryByText("Required")).not.toBeInTheDocument();

    fireEvent.change(roomIdInput, { target: { value: "" } });
    expect(await findByText("Required")).toBeInTheDocument();
  });

  it("has 'Create' as the submit button text", () => {
    const { getByRole } = renderForm({ isSelected: true });

    expect(getByRole("button")).toHaveTextContent("Create");
  });
});
