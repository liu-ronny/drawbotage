import React from "react";
import "./inviteLink.css";

function InviteLink(props) {
  return (
    <div className="mt-5">
      <label htmlFor="invite-link">Invite friends</label>
      <div className="input-group">
        <input
          id="invite-link"
          type="text"
          className="lobby-settings-invite-link-url form-control"
          value={props.url}
          readOnly={true}
        />
        <div className="input-group-append">
          <button
            className="btn btn-outline-secondary"
            type="button"
            onClick={props.onCopy}
          >
            Copy
          </button>
        </div>
      </div>
      {props.urlCopied && (
        <small
          className="lobby-settings-invite-link-notification"
          role="alert"
          aria-label="Link copied!"
        >
          Link copied!
        </small>
      )}
    </div>
  );
}

export default InviteLink;
