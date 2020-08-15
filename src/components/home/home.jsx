import React, { useState, useEffect } from "react";
import { Redirect, useLocation, Link } from "react-router-dom";
import Header from "../general/header/header";
import Alert from "../general/alert/alert";
import Form from "./form/form";
import LoadingScreen from "../general/loadingScreen/loadingScreen";
import createRoomId from "../../api/createRoomId";
import "./home.css";

function Home(props) {
  const [status, setStatus] = useState({
    playerName: "",
    roomName: "",
    roomId: "",
    joinRoom: false,
    createRoom: false,
  });
  const [loading, setLoading] = useState(false);
  const [createRoomError, setCreateRoomError] = useState(false);
  const location = useLocation();
  const fromWindowUnload = location.state && location.state.fromWindowUnload;

  function handleJoin(values) {
    const { roomId, name } = values;
    setCreateRoomError(false);
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
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
      setLoading(true);

      var roomId = await createRoomId();

      setTimeout(() => setLoading(false), 2000);
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

  useEffect(() => {
    if (fromWindowUnload) {
      window.sessionStorage.removeItem("windowUnload");
      window.history.replaceState(null, "");
    }
  }, []);

  if (loading) {
    return <LoadingScreen animation="spinner" />;
  }

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
        <div className="text-center mt-5">
          <Link to="/about">
            <span className="text-secondary font-weight-bold">How to play</span>
          </Link>
        </div>
      </div>
      <div className="home-background"></div>
    </div>
  );
}

export default Home;
