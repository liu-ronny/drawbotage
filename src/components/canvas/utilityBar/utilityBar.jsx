import React, { Component } from "react";
import UtilityOption from "./utilityOption";

class UtilityBar extends Component {
  render() {
    return (
      <div className="col">
        <div className={"row no-gutters " + this.props.className}>
          <div className="col">
            <UtilityOption
              name="small"
              onClick={this.props.onSmallSizeClick}
              activeSizeSelection={this.props.activeSizeSelection}
            >
              <svg
                aria-hidden="true"
                focusable="false"
                data-prefix="fas"
                data-icon="circle"
                className="svg-inline--fa fa-circle fa-w-16"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                // height="20%"
                // width="20%"
              >
                <path
                  fill="#566573"
                  d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8z"
                ></path>
              </svg>
            </UtilityOption>
          </div>
          <div className="col">
            <UtilityOption
              name="medium"
              onClick={this.props.onMediumSizeClick}
              activeSizeSelection={this.props.activeSizeSelection}
            >
              <svg
                aria-hidden="true"
                focusable="false"
                data-prefix="fas"
                data-icon="circle"
                className="svg-inline--fa fa-circle fa-w-16"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                // height="40%"
                // width="40%"
              >
                <path
                  fill="#566573"
                  d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8z"
                ></path>
              </svg>
            </UtilityOption>
          </div>
          <div className="col">
            <UtilityOption
              name="large"
              onClick={this.props.onLargeSizeClick}
              activeSizeSelection={this.props.activeSizeSelection}
            >
              <svg
                aria-hidden="true"
                focusable="false"
                data-prefix="fas"
                data-icon="circle"
                className="svg-inline--fa fa-circle fa-w-16"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                // height="60%"
                // width="60%"
              >
                <path
                  fill="#566573"
                  d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8z"
                ></path>
              </svg>
            </UtilityOption>
          </div>
          <div className="col">
            <UtilityOption onClick={this.props.onEraserClick}>
              <svg
                aria-hidden="true"
                focusable="false"
                data-prefix="fas"
                data-icon="eraser"
                className="svg-inline--fa fa-eraser fa-w-16"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                // height="80%"
                // width="100%"
              >
                <path
                  fill="#AAB7B8"
                  d="M497.941 273.941c18.745-18.745 18.745-49.137 0-67.882l-160-160c-18.745-18.745-49.136-18.746-67.883 0l-256 256c-18.745 18.745-18.745 49.137 0 67.882l96 96A48.004 48.004 0 0 0 144 480h356c6.627 0 12-5.373 12-12v-40c0-6.627-5.373-12-12-12H355.883l142.058-142.059zm-302.627-62.627l137.373 137.373L265.373 416H150.628l-80-80 124.686-124.686z"
                ></path>
              </svg>
            </UtilityOption>
          </div>
          <div className="col">
            <UtilityOption onClick={this.props.onFillClick}>
              <svg
                aria-hidden="true"
                focusable="false"
                data-prefix="fas"
                data-icon="fill"
                className="svg-inline--fa fa-fill fa-w-16"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                // height="80%"
                // width="100%"
              >
                <path
                  fill="#AAB7B8"
                  d="M502.63 217.06L294.94 9.37C288.69 3.12 280.5 0 272.31 0s-16.38 3.12-22.62 9.37l-81.58 81.58L81.93 4.77c-6.24-6.25-16.38-6.25-22.62 0L36.69 27.38c-6.24 6.25-6.24 16.38 0 22.63l86.19 86.18-94.76 94.76c-37.49 37.49-37.49 98.26 0 135.75l117.19 117.19c18.75 18.74 43.31 28.12 67.87 28.12 24.57 0 49.13-9.37 67.88-28.12l221.57-221.57c12.49-12.5 12.49-32.76 0-45.26zm-116.22 70.97H65.93c1.36-3.84 3.57-7.98 7.43-11.83l13.15-13.15 81.61-81.61 58.61 58.6c12.49 12.49 32.75 12.49 45.24 0 12.49-12.49 12.49-32.75 0-45.24l-58.61-58.6 58.95-58.95 162.45 162.44-48.35 48.34z"
                ></path>
              </svg>
            </UtilityOption>
          </div>
          <div className="col">
            <UtilityOption onClick={this.props.onClearClick}>
              <svg
                aria-hidden="true"
                focusable="false"
                data-prefix="fas"
                data-icon="trash-alt"
                className="svg-inline--fa fa-trash-alt fa-w-14"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                // height="80%"
                // width="100%"
              >
                <path
                  fill="#AAB7B8"
                  d="M32 464a48 48 0 0 0 48 48h288a48 48 0 0 0 48-48V128H32zm272-256a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zm-96 0a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zm-96 0a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zM432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.72 23.72 0 0 0-21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16z"
                ></path>
              </svg>
            </UtilityOption>
          </div>
        </div>
      </div>
    );
  }
}

export default UtilityBar;
