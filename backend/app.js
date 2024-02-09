const express = require("express");
const bodyParser = require("body-parser");

const sequelize = require("./util/database");

const User = require("./models/users.js");
const Messages = require("./models/messages");

var cors = require("cors");

const app = express();
const http = require("http");
const server = http.createServer(app);

const { Server } = require("socket.io");

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const chatIo = io.of("/chat");

app.use(cors());

const userRoutes = require("./routes/users");
const chatRoutes = require("./routes/meesages");

app.use(bodyParser.json({ extended: false }));

app.use(userRoutes);
app.use(chatRoutes);

User.hasMany(Messages);
Messages.belongsTo(User);

const candidates = {
  0: { votes: 0, label: "JavaScript", color: randomRGB() },
  1: { votes: 0, label: "C#", color: randomRGB() },
  2: { votes: 0, label: "Java", color: randomRGB() },
  3: { votes: 0, label: "Python", color: randomRGB() },
};

io.on("connection", (socket) => {
  io.emit("update", candidates);

  socket.on("vote", (index) => {
    if (candidates[index]) {
      candidates[index].votes += 1;
    }

    console.log(candidates);

    io.emit("update", candidates);
  });
});

chatIo.on("connection", (socket) => {
  console.log("chat", socket.id);
  socket.on("sendmsg", (msg, name) => {
    chatIo.emit("receivemsg", msg, name);
  });
});

function randomRGB() {
  const r = () => (Math.random() * 256) >> 0;
  return `rgb(${r()}, ${r()}, ${r()})`;
}

sequelize
  .sync()
  .then((result) => {
    server.listen(8000);
  })
  .catch((err) => console.log(err));
