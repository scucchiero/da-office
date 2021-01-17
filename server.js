require("dotenv").config();
const { AwakeHeroku } = require("awake-heroku");
const Socket = require("socket.io");
const Express = require("express");
const Http = require("http");
const path = require("path");

const app = Express();
const server = Http.createServer(app);
const io = Socket(server);

const password = process.env.OWNER_PASSWORD;

if (process.env.NODE_ENV === "production") {
  AwakeHeroku.add({
    url: "https://cuckooapp.herokuapp.com"
  });
}

app.use(Express.static("./client/build"));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
});

let lobby = [];
let owner;
let peer;

const streamLobby = () => io.sockets.emit("newLobby", lobby);

io.on("connection", (socket) => {
  streamLobby();

  socket.on("claimOwnership", (pwd) => {
    if (pwd === password) {
      socket.owner = true;
      owner = socket.id;
      socket.emit("ownershipGranted");
      io.sockets.emit("ownerArrived");
    }
  });
  
  socket.on("joinLobby", (name) => {
    const exists = lobby.find((p) => p.id === socket.id);
    if (!exists) {
      lobby.push({
        joinedAt: new Date(),
        id: socket.id,
        name,
      });
      streamLobby();
    }
  });

  socket.on("kick", (id) => {
    io.to(id).emit("kicked");
    lobby = lobby.filter((p) => p.id !== id);
    streamLobby();
  });
  
  socket.on("disconnect", () => {
    if (socket.owner) {
      owner = null;
      io.sockets.emit("ownerLeft");
    }
    if (socket.inCall) {
      if (socket.owner) io.to(peer).emit("callClosed");
      else io.to(owner).emit("callClosed");
    }
    lobby = lobby.filter((p) => p.id !== socket.id);
    streamLobby();
  });

  socket.on("requestCall", ({ to, signal }) => {
    if (socket.owner) {
      socket.inCall = true;
      io.to(to).inCall = true;
      io.to(to).emit("callRequested", signal);
    }
  });
  
  socket.on("closeCall", () => {
    if (socket.owner) io.to(peer).emit("callClosed");
    else io.to(owner).emit("callClosed");
  });
  
  socket.on("acceptCall", (signal) => {
    peer = socket.id;
    io.to(owner).emit("callAccepted", signal);
  });

  socket.on("rejectCall", () => io.to(owner).emit("callClosed"));
});

const port = process.env.PORT || 5000;

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
