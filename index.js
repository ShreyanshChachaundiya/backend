const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const socketIO = require("socket.io");
const http = require("http");
const dotenv = require("dotenv");
const usersRoutes = require("./routes/user-routes");
const postsRoutes = require("./routes/post-routes");
const blogsRoutes = require("./routes/blog-routes");
const itemsRoutes = require("./routes/item-routes");
const videosRoutes = require("./routes/video-routes");
const musicsRoutes = require("./routes/music-routes");
const reviewsRoutes = require("./routes/review-routes");
const convsRoutes = require("./routes/conv-routes");
const msgsRoutes = require("./routes/msg-routes");
const { dummy } = require("./controllers/users-controllers");
const cors = require("cors");
const { log } = require("console");

const app = express();
app.use(cors());
// Parse JSON and URL-encoded request bodies

const server = http.createServer(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const io = socketIO(server);

//app.options('*', cors());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  next();
});

let users = [];

const getUser = (userId) => {
  // console.log("active",users);
  return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  // console.log("New client connected", socket.id);

  // Handle socket events
  socket.on("addUser", (userId) => {
    const exist = users.find((user) => user.userId === userId);
    if (!exist) {
      const user = { userId, socketId: socket.id };
      users.push(user);

      io.emit("getUser", users);
    }
  });

  socket.on("sendMessage", ({ sender, reciever, message }) => {
    //console.log("active",users);
    const user = getUser(reciever);

    console.log(message, user?.userId);

    io.to(user?.socketId).emit("getMessage", { message, sender });
    // Handle event2
  });

  // Disconnect event
  socket.on("disconnect", () => {
    // console.log(users);
    users = users.filter((user) => user.socketId !== socket.id);
    io.emit("getUser", users);
    console.log("Client disconnected");
  });
});

app.use("/uploads/videos", express.static(path.join("uploads", "videos")));

app.use("/uploads/musics", express.static(path.join("uploads", "musics")));

app.get("/", dummy);

app.use("/api/users", usersRoutes);
app.use("/api/posts", postsRoutes);
app.use("/api/blogs", blogsRoutes);
app.use("/api/items", itemsRoutes);
app.use("/api/reviews", reviewsRoutes);
app.use("/api/videos", videosRoutes);
app.use("/api/musics", musicsRoutes);
app.use("/api/conversation", convsRoutes);
app.use("/api/message", msgsRoutes);

dotenv.config();

const username = process.env.DB_USERNAME;
const password = process.env.DB_PASS;

app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    });
  }
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({
    message: error.message || "an unknown error occurred",
    status: error.code,
  });
});

mongoose
  .connect(
    `mongodb+srv://${username}:${password}@cluster0.o3vsgrd.mongodb.net/project1`
  )
  .then(() => {
    server.listen(5000);
    console.log("connected");
  })
  .catch((err) => {
    console.log(err);
  });
