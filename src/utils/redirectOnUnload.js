import React, { useEffect } from "react";

// function useRedirectOnUnload(window, history) {
//   useEffect(() => {
//     if (window.sessionStorage.getItem("windowUnload")) {
//       window.sessionStorage.removeItem("windowUnload");
//       history.replace("/", { fromWindowUnload: true });
//     }

//     window.onbeforeunload = (event) => {
//       window.sessionStorage.setItem("windowUnload", "true");
//     };

//     return () => (window.onbeforeunload = null);
//   }, []);
// }

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
