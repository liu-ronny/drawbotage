import React, { useState } from "react";
import { Link } from "react-router-dom";
import Option from "./option";
import InviteLink from "./inviteLink";
import Divider from "./divider";
import "./settings.css";

const roundOptions = [3, 5, 7];
const drawTimeOptions = [60, 80, 100];

function Settings(props) {
  const { isHost, rounds, drawTime, onChange, onStart, onLeave } = props;
  const [urlCopied, setUrlCopied] = useState(false);
  const url = "http://localhost:3000/" + props.roomId;

  function handleCopy() {
    navigator.clipboard.writeText(url).then(() => {
      setUrlCopied(true);
      setTimeout(() => {
        setUrlCopied(false);
      }, 2000);
    });
  }

  return (
    <>
      <div className="lobby-settings-header text-primary">Settings</div>
      <div className="pt-5">
        <div className="mb-4">
          <Option
            label="Rounds"
            onChange={onChange}
            name="rounds"
            values={isHost ? roundOptions : [rounds]}
            iconClassName="fas fa-list-ol"
            disabled={!isHost}
          />
        </div>
        <div className="mb-4">
          <Option
            label="Draw time"
            onChange={onChange}
            name="drawTime"
            values={isHost ? drawTimeOptions : [drawTime]}
            iconClassName="fas fa-stopwatch-20"
            disabled={!isHost}
          />
        </div>
        <InviteLink url={url} urlCopied={urlCopied} onCopy={handleCopy} />
      </div>
      <Divider />
      <div className="mt-auto">
        {isHost && (
          <button
            className="btn btn-outline-primary mr-3 larger-bold-font"
            onClick={onStart}
          >
            Start game
          </button>
        )}
        <Link to="/" replace={true}>
          <button
            className="btn btn-outline-dark-primary larger-bold-font"
            onClick={onLeave}
          >
            Leave
          </button>
        </Link>
      </div>
    </>
  );
}

export default Settings;
