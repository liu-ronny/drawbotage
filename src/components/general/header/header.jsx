import React from "react";
import "./header.css";

function Header(props) {
  return (
    <div>
      <h1 className="header-text text-primary text-center mt-4">Drawbotage</h1>
      <h1 className="text-secondary text-center mb-4">
        <svg
          className="header-logo bi bi-pencil"
          width="1em"
          height="1em"
          fill="url(#logo-gradient) currentColor"
          viewBox="0 0 16 16"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M11.293 1.293a1 1 0 011.414 0l2 2a1 1 0 010 1.414l-9 9a1 1 0 01-.39.242l-3 1a1 1 0 01-1.266-1.265l1-3a1 1 0 01.242-.391l9-9zM12 2l2 2-9 9-3 1 1-3 9-9z"
            clipRule="evenodd"
          />
          <path
            fillRule="evenodd"
            d="M12.146 6.354l-2.5-2.5.708-.708 2.5 2.5-.707.708zM3 10v.5a.5.5 0 00.5.5H4v.5a.5.5 0 00.5.5H5v.5a.5.5 0 00.5.5H6v-1.5a.5.5 0 00-.5-.5H5v-.5a.5.5 0 00-.5-.5H3z"
            clipRule="evenodd"
          />
        </svg>
      </h1>

      <svg
        style={{
          width: 0,
          height: 0,
          position: "absolute",
        }}
        aria-hidden="true"
        focusable="false"
      >
        <linearGradient id="logo-gradient" x1="0" y1="1" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--color-stop-1)" />
          <stop offset="25%" stopColor="var(--color-stop-2)" />
          <stop offset="50%" stopColor="var(--color-stop-3)" />
          <stop offset="75%" stopColor="var(--color-stop-4)" />
          <stop offset="100%" stopColor="var(--color-stop-5)" />
        </linearGradient>
      </svg>
    </div>
  );
}

export default Header;
