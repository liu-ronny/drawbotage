import React from "react";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import { Route } from "react-router-dom";
import { render } from "@testing-library/react";
import Home from "../../home/home";
import Reload from "./reload";

function renderReload(history) {
  return render(
    <Router history={history}>
      <Route path="/" exact component={Home} />
      <Reload>
        <Route path="/test" exact>
          <div>Test</div>
        </Route>
      </Reload>
    </Router>
  );
}

const replaceStateMock = jest
  .spyOn(window.history, "replaceState")
  .mockImplementation((stateObj, title, url) => {});

let history;

beforeEach(() => {
  history = createMemoryHistory();
});

describe("reload component", () => {
  it("redirects to the home page on refresh", async () => {
    // simulate a page refresh after render
    // this situation also simulates a back button press followed by a forward button press
    history.replace("/test");
    const { unmount } = renderReload(history);
    window.onbeforeunload();
    expect(window.sessionStorage.getItem("windowUnload")).toBeTruthy();
    unmount();
    const { findByRole, queryByRole, queryByText } = renderReload(history);

    expect(
      await findByRole("alert", {
        name: "You left the game! Join to re-enter or create a new game.",
      })
    ).toBeInTheDocument();
    expect(history.location.pathname).toBe("/");
    expect(history.length).toBe(1);
    expect(replaceStateMock).toBeCalledTimes(1);

    // use the argument provided to window.history.replaceState to mock a page refresh on the home page
    // window.history.replaceState will not cause a re-render, while history.replace might (meaning that
    // the alert won't be displayed)
    history.replace("/", replaceStateMock.mock.calls[0][0]);
    expect(
      queryByRole("alert", {
        name: "You left the game! Join to re-enter or create a new game.",
      })
    ).not.toBeInTheDocument();
    expect(queryByText("Drawbotage")).toBeInTheDocument();
    expect(history.location.pathname).toBe("/");
    expect(history.length).toBe(1);

    // check that the sessionStorage marker is removed
    expect(window.sessionStorage.getItem("windowUnload")).toBeFalsy();
  });
});
