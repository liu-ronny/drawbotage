import React, { Component } from "react";
import { Link } from "react-router-dom";
import Option from "./option";
import SettingsBackground from "./settingsBackground";
import "./settings.css";

class Settings extends Component {
  state = {
    url: "http://localhost:3000/" + this.props.roomId,
    urlCopied: false,
  };

  handleCopyLink = (event) => {
    navigator.clipboard.writeText(this.state.url).then(() => {
      this.setState({ urlCopied: true });
      setTimeout(() => {
        this.setState({ urlCopied: false });
      }, 2000);
    });
  };

  render() {
    return (
      <React.Fragment>
        {this.props.selected ? (
          <React.Fragment>
            <div className="settings-header text-primary">Settings</div>
            <div className="settings-content pt-5">
              <div className="mb-4">
                <Option
                  label="Rounds"
                  onChange={this.props.onChange}
                  optionName="rounds"
                  values={
                    this.props.isHost ? [3, 5, 7] : [this.props.teamInfo.rounds]
                  }
                  iconClasses="fas fa-list-ol"
                  disabled={!this.props.isHost}
                />
              </div>

              <div className="mb-4">
                <Option
                  label="Draw time"
                  onChange={this.props.onChange}
                  optionName="drawTime"
                  values={
                    this.props.isHost
                      ? [60, 80, 100]
                      : [this.props.teamInfo.drawTime]
                  }
                  iconClasses="fas fa-stopwatch-20"
                  disabled={!this.props.isHost}
                />
              </div>
              <div className="mt-5">
                <label>Invite friends</label>
                <div
                  className={
                    "input-group" + (this.state.urlCopied ? " copied" : "")
                  }
                >
                  <input
                    type="text"
                    className="form-control game-url"
                    value={this.state.url}
                    readOnly={true}
                  />
                  <div className="input-group-append">
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={this.handleCopyLink}
                    >
                      Copy
                    </button>
                  </div>
                </div>
                {this.state.urlCopied && (
                  <small className="copied-msg">Link copied!</small>
                )}
              </div>
            </div>
            <SettingsBackground />
            <div className="mt-auto">
              {this.props.isHost ? (
                <Link
                  to={{
                    pathname: `/${this.props.teamInfo.roomId}`,
                    state: {
                      fromLobby: true,
                      teamInfo: this.props.teamInfo,
                    },
                  }}
                >
                  <button className="btn btn-outline-primary mr-3 larger-bold-font">
                    Start game
                  </button>
                </Link>
              ) : null}
              <Link to="/">
                <button
                  className="btn btn-outline-dark-primary larger-bold-font"
                  onClick={this.props.onLeave}
                >
                  Leave
                </button>
              </Link>
            </div>
          </React.Fragment>
        ) : null}
      </React.Fragment>
    );
  }
}

export default Settings;
