const app = require("express")(),
  { v4: uuid } = require("uuid"),
  server = require("http").Server(app),
  Connection = require("./connection");

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

const connection = new Connection(server);

app.get("/roomid", (req, res) => {
  let roomId = uuid();

  while (connection.contains(roomId)) {
    roomId = uuid();
  }

  res.send(roomId);
});

app.get("/is-valid-roomID/:roomID", (req, res) => {
  const roomId = req.params.roomID;
  res.send(connection.contains(roomId));
});

server.listen(8080, () => {
  console.log("Server listening at http://localhost:8080/");
});
