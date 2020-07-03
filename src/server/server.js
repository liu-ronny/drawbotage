const app = require("express")(),
  { v4: uuid } = require("uuid"),
  server = require("http").Server(app),
  io = require("socket.io")(server);

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.get("/roomid", (req, res) => {
  const rooms = io.sockets.adapter.rooms;
  let room = uuid();

  while (room in rooms) {
    room = uuid();
  }

  res.send(room);
});

app.get("/is-valid-roomID/:roomID", (req, res) => {
  const roomID = req.params.roomID;
  res.send(roomIsActive(roomID));
});

io.set("origins", "http://localhost:3000/");

function roomIsActive(roomID) {
  return io.sockets.adapter.rooms[roomID] ? true : false;
}

function getPlayers(roomID) {
  const players = [];
  const clients = io.sockets.adapter.rooms[roomID].sockets;
  for (let clientID in clients) {
    players.push(io.sockets.connected[clientID]);
  }
  return players;
}

function getPlayerNames(roomID) {
  const playerNames = {
    blue: [],
    red: [],
    unassigned: [],
  };
  const clients = io.sockets.adapter.rooms[roomID].sockets;
  for (let clientID in clients) {
    const clientSocket = io.sockets.connected[clientID];
    playerNames[clientSocket.drawbotageTeam].push(clientSocket.drawbotageName);
  }
  return playerNames;
}

function joinRoom(socket, data) {
  socket.drawbotageName = data.name;
  socket.drawbotageRoomID = data.roomID;
  socket.drawbotageTeam = data.team;
  socket.join(data.roomID);
}

function createRoom(socket, data) {
  joinRoom(socket, data);
  setRoomProperty(data.roomID, "rounds", data.rounds);
  setRoomProperty(data.roomID, "drawTime", data.drawTime);
}

function setRoomProperty(roomID, propertyName, propertyValue) {
  if (roomIsActive(roomID)) {
    io.sockets.adapter.rooms[roomID][propertyName] = propertyValue;
  }
}

function getRoomProperty(roomID, propertyName) {
  return io.sockets.adapter.rooms[roomID][propertyName];
}

function getSettings(roomID) {
  const rounds = getRoomProperty(roomID, "rounds");
  const drawTime = getRoomProperty(roomID, "drawTime");
  return { rounds, drawTime };
}

function broadcastSettings(roomID, socket) {
  socket.to(roomID).emit("settings", getSettings(roomID));
}

function setHost(roomID, name) {
  if (name) {
    io.sockets.adapter.rooms[roomID].drawbotageHost = name;
  } else {
    if (roomIsActive(roomID)) {
      const playerNames = getPlayerNames(roomID);
      io.sockets.adapter.rooms[roomID].drawbotageHost = playerNames[0];
    }
  }
}

function getHost(roomID, asSocket = false) {
  const hostName = io.sockets.adapter.rooms[roomID].drawbotageHost;

  if (asSocket) {
    const playerSockets = getPlayers(roomID);
    const hostSocket = playerSockets.find(
      (playerSocket) => playerSocket.drawbotageName === hostName
    );
    return hostSocket;
  }

  return hostName;
}

function sendPlayerNames(roomID, playerNames) {
  io.to(roomID).emit("playerNames", {
    host: getHost(roomID),
    playerNames: playerNames ? playerNames : getPlayerNames(roomID),
  });
}

function broadcastPlayerNames(socket, roomID) {
  socket.to(roomID).broadcast.emit("playerNames", {
    host: getHost(roomID),
    playerNames: getPlayerNames(roomID),
  });
}

function sendPlayerNamesOnLeave(name, roomID) {
  if (roomIsActive(roomID)) {
    if (name === getHost(roomID)) {
      setHost(roomID);
    }
    sendPlayerNames(roomID);
  }
}

io.sockets.on("connection", (socket) => {
  socket.on("create", (data) => {
    createRoom(socket, data);
    setHost(data.roomID, data.name);
    sendPlayerNames(data.roomID);
  });

  socket.on("join", async (data) => {
    joinRoom(socket, data);
    const hostID = getHost(data.roomID, true).id;
    io.to(hostID).emit("addPlayer", data);

    // sendPlayerNames(data.roomID, playerNames);
  });

  // socket.on("playerNamesResponse", (data) => {
  //   sendPlayerNames(data.roomID, data.playerNames);
  // });

  socket.on("updateTeams", (data) => {
    const players = getPlayers(data.roomID);
    const player = players.find(
      (playerSocket) => playerSocket.drawbotageName === data.name
    );
    player.drawbotageTeam = data.team;
    sendPlayerNames(data.roomID, data.playerNames);
  });

  socket.on("updateSettings", (data) => {
    const setting = Object.keys(data.settings)[0];
    const value = data.settings[setting];
    setRoomProperty(data.roomID, setting, value);
    broadcastSettings(data.roomID, socket);
  });

  socket.on("leave", (data) => {
    socket.leave(data.roomID);

    if (data.isHost) {
      setHost(data.roomID);
    }

    const hostID = getHost(data.roomID, true).id;
    io.to(hostID).emit("removePlayer", {
      name: socket.drawbotageName,
    });

    // sendPlayerNamesOnLeave(data.name, data.roomID);
  });

  socket.on("removePlayer", (data) => {
    sendPlayerNames(data.roomID, data.playerNames);
  });

  socket.on("disconnect", () => {
    sendPlayerNamesOnLeave(socket.drawbotageName, socket.drawbotageRoomID);
  });
});

server.listen(8080, () => {
  console.log("Server listening at http://localhost:8080/");
});
