function redirectOnUnload(window, history) {
  if (window.sessionStorage.getItem("windowUnload")) {
    window.sessionStorage.removeItem("windowUnload");
    history.replace("/", { fromWindowUnload: true });
    return true;
  }

  window.onbeforeunload = (event) => {
    window.sessionStorage.setItem("windowUnload", "true");
  };

  return false;
}

export default redirectOnUnload;
