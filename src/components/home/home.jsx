import React, { useEffect } from "react";
import { Redirect, useLocation } from "react-router-dom";
import Header from "../general/header/header";
import Alert from "../general/alert/alert";
import createRoomId from "../../api/createRoomId";
import "./home.css";
import { useState } from "react";
import Form from "./form/form";

function Home(props) {
  const [status, setStatus] = useState({
    playerName: "",
    roomName: "",
    roomId: "",
    joinRoom: false,
    createRoom: false,
  });
  const [createRoomError, setCreateRoomError] = useState(false);
  const location = useLocation();
  const fromWindowUnload = location.state && location.state.fromWindowUnload;

  if (fromWindowUnload) {
    window.sessionStorage.removeItem("windowUnload");
  }

  function handleJoin(values) {
    const { roomId, name } = values;
    setCreateRoomError(false);
    setStatus({
      playerName: name,
      roomId,
      roomName: "",
      joinRoom: true,
      createRoom: false,
    });
  }

  async function handleCreate(values) {
    const { name, roomName } = values;

    try {
      var roomId = await createRoomId();

      setCreateRoomError(false);
      setStatus({
        playerName: name,
        roomId,
        roomName,
        joinRoom: false,
        createRoom: true,
      });
    } catch (err) {
      setCreateRoomError(true);
    }
  }

  useEffect(() => {
    const body = {
      backgroundColor: "aliceblue",
      height: "100%",
    };

    document.documentElement.style.height = "100%";

    for (let i in body) {
      document.body.style[i] = body[i];
    }
  }, []);

  if (status.joinRoom || status.createRoom) {
    return (
      <Redirect
        to={{
          pathname: `/${status.roomId}`,
          state: { ...status },
        }}
      />
    );
  }

  return (
    <div className="home-container d-flex flex-column">
      <div className="container">
        <Header />
        <div className="row justify-content-center">
          <div className="col-10 col-md-7 col-lg-5">
            {createRoomError ? (
              <Alert message="Unable to create room. Please try again later." />
            ) : null}
            {fromWindowUnload ? (
              <Alert message="You left the game! Join to re-enter or create a new game." />
            ) : null}
            <Form
              onJoin={handleJoin}
              onCreate={handleCreate}
              roomId={props.roomId}
            />
          </div>
        </div>
        <p className="text-secondary font-weight-bold text-center mt-5">
          How to play
        </p>
      </div>
      <div className="home-background"></div>
    </div>
  );
}

export default Home;
